import React, { useState, useEffect, useCallback } from "react";
import { dateMoment, timeMoment } from "components/Utilities/Time";
import {
  TableRow,
  Avatar,
  Grid,
  Checkbox,
  FormControl,
  FormLabel,
  TableCell,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLazyQuery } from "@apollo/client";
import { getDrugOrders } from "components/graphQL/useQuery";
import { NoData, EmptyTable } from "components/layouts"; //
import useFormInput from "components/hooks/useFormInput";
import { EnhancedTable } from "components/layouts/";
import { messagesHeadCells } from "components/Utilities/tableHeaders";
import displayPhoto from "assets/images/avatar.svg";
import { useSelector } from "react-redux";
import { useActions } from "components/hooks/useActions";
import { handleSelectedRows } from "helpers/selectedRows";
import { isSelected } from "helpers/isSelected";
import {
  changeTableLimit,
  handlePageChange,
} from "helpers/filterHelperFunctions";

import {
  Modals,
  Loader,
  FormSelect,
  FilterList,
  Search,
} from "components/Utilities";
import { debounce } from "helpers/debounce";

const useStyles = makeStyles((theme) => ({
  button: {
    "&.MuiButton-root": {
      background: "#fff",
      color: theme.palette.common.grey,
      textTransform: "none",
      borderRadius: "2rem",
      display: "flex",
      alignItems: "center",
      padding: "0.5rem",
      maxWidth: "10rem",
      fontSize: ".85rem",

      "&:hover": {
        background: "#fcfcfc",
      },

      "&:active": {
        background: "#fafafa",
      },

      "& .MuiButton-endIcon>*:nth-of-type(1)": {
        fontSize: "0.85rem",
      },

      "& .MuiButton-endIcon": {
        marginLeft: ".2rem",
      },
    },
  },
  searchFilterBtn: {
    "&.MuiButton-root": {
      ...theme.typography.btn,
      background: theme.palette.common.black,
      width: "100%",
    },
  },
  badge: {
    "&.MuiChip-root": {
      fontSize: "1.25rem !important",
      height: "2.7rem",
      textAlign: "left",
      borderRadius: "1.3rem",
    },
  },
  tableBtn: {
    "&.MuiButton-root": {
      ...theme.typography.btn,
      height: "3rem",
      fontSize: "1.25rem",
      borderRadius: "2rem",
      boxShadow: "none",

      "&:hover": {
        "& .MuiButton-endIcon>*:nth-of-type(1)": {
          color: "#fff",
        },
      },

      "&:active": {
        boxShadow: "none",
      },

      "& .MuiButton-endIcon>*:nth-of-type(1)": {
        fontSize: "1.5rem",
      },
    },
  },

  redBtn: {
    "&.MuiButton-root": {
      background: theme.palette.common.lightRed,
      color: theme.palette.common.red,

      "&:hover": {
        background: theme.palette.error.light,
        color: "#fff",
      },
    },
  },
}));

const CancelledOrders = () => {
  const classes = useStyles();
  // const theme = useTheme();
  const [state, setState] = useState([]);
  // const orderState = "cancelled";
  const [fetchDiagnostics, { data, loading, error }] =
    useLazyQuery(getDrugOrders);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
    totalDocs: 0,
  });
  const status = "cancelled";
  useEffect(() => {
    fetchDiagnostics({
      variables: {
        status,
        first: pageInfo.limit,
      },
    });
  }, [fetchDiagnostics, pageInfo.limit]);
  useEffect(() => {
    if (data) {
      setState(data?.getDrugOrders.data);
      setPageInfo(data?.getDrugOrders.pageInfo);
    }
  }, [data]);

  const specializations = ["Dentistry", "Pediatry", "Optometry", "Pathology"];
  const hospitals = ["General Hospital, Lekki", "H-Medix", "X Lab"];
  const dates = ["Hello", "World", "Goodbye", "World"];
  const [openFilterPartner, setOpenFilterPartner] = useState(false);
  const [filterSelectInput, handleSelectedInput] = useFormInput({
    hospitalName: "",
    date: "",
    categoryName: "",
  });
  const { hospitalName, date, categoryName } = filterSelectInput;
  // eslint-disable-next-line
  const debouncer = useCallback(debounce(fetchDiagnostics), []);

  const { selectedRows, page } = useSelector((state) => state.tables);
  const { setSelectedRows } = useActions();

  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;
  return (
    <>
      <Grid
        container
        direction="column"
        gap={2}
        flexWrap="nowrap"
        height="100%"
      >
        <Grid
          item
          container
          flexDirection={{ md: "row", sm: "row", xs: "column" }}
          spacing={{ md: 4, sm: 4, xs: 2 }}
        >
          <Grid item flex={1}>
            <Search
              onChange={(e) => {
                let value = e.target.value;
                if (value !== "") {
                  return debouncer({
                    variables: { orderId: value },
                  });
                }
              }}
              placeholder="Type to search Test by orderId..."
            />
          </Grid>
          <Grid item>
            <FilterList
              onClick={() => setOpenFilterPartner(true)}
              title="Filter"
            />
          </Grid>
        </Grid>
        {state.length > 0 ? (
          <Grid item container height="100%" direction="column">
            <EnhancedTable
              rows={state}
              page={page}
              headCells={messagesHeadCells}
              paginationLabel="orders per page"
              hasCheckbox={true}
              changeLimit={(e) => {
                changeTableLimit(e, fetchDiagnostics, status);
              }}
              dataPageInfo={pageInfo}
              handlePagination={(page) => {
                handlePageChange(fetchDiagnostics, page, pageInfo, "cancelled");
              }}
            >
              {state
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const { _id, createdAt, orderId, patientData, reason } = row;
                  const isItemSelected = isSelected(_id, selectedRows);

                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={_id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onClick={() =>
                            handleSelectedRows(
                              _id,
                              selectedRows,
                              setSelectedRows
                            )
                          }
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        id={labelId}
                        scope="row"
                        align="left"
                        className={classes.tableCell}
                      >
                        {dateMoment(createdAt)}
                      </TableCell>
                      <TableCell align="left" className={classes.tableCell}>
                        {timeMoment(createdAt)}
                      </TableCell>
                      <TableCell align="left" className={classes.tableCell}>
                        {orderId}
                      </TableCell>
                      <TableCell align="left" className={classes.tableCell}>
                        {reason}
                      </TableCell>
                      <TableCell align="left" className={classes.tableCell}>
                        <div
                          style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ marginRight: "1rem" }}>
                            <Avatar
                              alt={`Display Photo of ${patientData?.firstName}`}
                              src={
                                patientData ? patientData.image : displayPhoto
                              }
                              sx={{ width: 24, height: 24 }}
                            />
                          </span>
                          <span style={{ fontSize: "1.25rem" }}>
                            {patientData
                              ? `${patientData.firstName}
                            ${patientData.lastName}`
                              : "No Patient"}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </EnhancedTable>
          </Grid>
        ) : (
          <EmptyTable
            headCells={messagesHeadCells}
            paginationLabel="Orders  per page"
            text="No Cancelled Order"
          />
        )}
      </Grid>

      <Modals
        isOpen={openFilterPartner}
        title="Filter"
        rowSpacing={5}
        handleClose={() => setOpenFilterPartner(false)}
      >
        <Grid item container direction="column">
          <Grid item>
            <Grid container spacing={2}>
              <Grid item md>
                <Grid container direction="column">
                  <Grid item>
                    <FormLabel component="legend" className={classes.FormLabel}>
                      Date
                    </FormLabel>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <FormSelect
                        name="date"
                        options={dates}
                        value={date}
                        onChange={handleSelectedInput}
                        placeholderText="Choose Date"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md>
                <Grid container direction="column">
                  <Grid item>
                    <FormLabel component="legend" className={classes.FormLabel}>
                      Time
                    </FormLabel>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <FormSelect
                        name="Time"
                        options={specializations}
                        value={hospitalName}
                        onChange={handleSelectedInput}
                        placeholderText="Select Time"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item style={{ marginBottom: "18rem", marginTop: "3rem" }}>
            <Grid container spacing={2}>
              <Grid item md>
                <Grid container direction="column">
                  <Grid item>
                    <FormLabel component="legend" className={classes.FormLabel}>
                      Order Number
                    </FormLabel>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth style={{ height: "3rem" }}>
                      <FormSelect
                        name="Order Number"
                        options={hospitals}
                        value={categoryName}
                        onChange={handleSelectedInput}
                        placeholderText="Enter order number"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md></Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => setOpenFilterPartner(false)}
              type="submit"
              className={classes.searchFilterBtn}
            >
              Apply Filter
            </Button>
          </Grid>
        </Grid>
      </Modals>
    </>
  );
};

export default CancelledOrders;
