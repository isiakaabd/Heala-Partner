import React, { useState, useEffect } from "react";
import {
  Grid,
  Avatar,
  FormControl,
  FormLabel,
  Button,
  TableCell,
  Checkbox,
  TableRow,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import prettyMoney from "pretty-money";
import {
  FormSelect,
  Loader,
  CustomButton,
  Modals,
  Search,
} from "components/Utilities";
import useFormInput from "components/hooks/useFormInput";
import { makeStyles } from "@mui/styles";
import {
  changeTableLimit,
  handlePageChange,
} from "helpers/filterHelperFunctions";
import { useHistory } from "react-router-dom";
import { partnersHeadCells } from "components/Utilities/tableHeaders";
import displayPhoto from "assets/images/avatar.svg";
import { useSelector } from "react-redux";
import { useActions } from "components/hooks/useActions";
import { handleSelectedRows } from "helpers/selectedRows";
import { isSelected } from "helpers/isSelected";
import { useLazyQuery } from "@apollo/client";
import { getDrugOrders } from "components/graphQL/useQuery";
import { NoData, EmptyTable, EnhancedTable } from "components/layouts";
import { dateMoment, timeMoment } from "components/Utilities/Time";
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
      maxWidth: "7rem",
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
        marginTop: "-.2rem",
      },
    },
  },
  badge: {
    "&.MuiChip-root": {
      fontSize: "1.25rem !important",
      height: "2.7rem",
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
  FormLabel: {
    "&.MuiFormLabel-root": {
      ...theme.typography.FormLabel,
    },
  },
  searchFilterBtn: {
    "&.MuiButton-root": {
      ...theme.typography.btn,
      background: theme.palette.common.black,
      width: "100%",
    },
  },
  chip: {
    "&.MuiChip-root": {
      fontSize: "1.25rem",
      height: "3rem",
      cursor: "pointer",
      borderRadius: "1.3rem",
      background: theme.palette.common.white,
      color: theme.palette.common.grey,
      "& .MuiChip-deleteIcon": {
        color: "inherit",
        fontSize: "inherit",
      },
    },
  },
}));

const dates = ["Hello", "World", "Goodbye", "World"];
const specializations = ["Dentistry", "Pediatry", "Optometry", "Pathology"];
const hospitals = ["General Hospital, Lekki", "H-Medix", "X Lab"];

const CompletedOrders = () => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [state, setState] = useState([]);
  const [search, setSearch] = useState("");
  const prettyDollarConfig = {
    currency: "₦",
    position: "before",
    spaced: false,
    thousandsDelimiter: ",",
  };

  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
  };
  const [openFilterPartner, setOpenFilterPartner] = useState(false);
  const orderStatus = "completed";
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
  const partnerProviderId = localStorage.getItem("partnerProviderId");

  useEffect(() => {
    fetchDiagnostics({
      variables: {
        status: orderStatus,
        first: pageInfo.limit,
        partnerProviderId,
      },
    });
  }, [fetchDiagnostics, partnerProviderId, pageInfo.limit]);
  useEffect(() => {
    if (data) {
      setState(data?.getDrugOrders.data);
      setPageInfo(data?.getDrugOrders.pageInfo);
    }
  }, [data]);
  const handleSubmitSearch = async () => {
    try {
      const { data } = await fetchDiagnostics({
        variables: { orderId: search, status: orderStatus, partnerProviderId },
      });
      if (data) {
        setState(data?.getDrugOrders.data);
        setPageInfo(data.getDrugOrders.pageInfo);
      }
    } catch (e) {
      console.error(e);
    }
  };
  // FILTER PARTNERS SELECT STATES
  const [filterSelectInput, handleSelectedInput] = useFormInput({
    hospitalName: "",
    date: "",
    categoryName: "",
  });

  const { hospitalName, date, categoryName } = filterSelectInput;

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
        <Grid item container spacing={{ md: 4, sm: 4, xs: 2 }}>
          <Grid item flex={1}>
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type to search Order by orderId..."
            />
          </Grid>
          <Grid item>
            <CustomButton
              title="Search"
              type={buttonType}
              disabled={!search}
              onClick={handleSubmitSearch}
            />
          </Grid>
        </Grid>
        {state.length > 0 ? (
          <Grid item container height="100%" direction="column">
            <EnhancedTable
              headCells={partnersHeadCells}
              rows={state}
              page={page}
              paginationLabel="orders per page"
              hasCheckbox={true}
              changeLimit={(e) => {
                changeTableLimit(e, fetchDiagnostics, orderStatus);
              }}
              dataPageInfo={pageInfo}
              handlePagination={(page) => {
                handlePageChange(fetchDiagnostics, page, pageInfo, orderStatus);
              }}
            >
              {state.map((row, index) => {
                const { orderId, createdAt, prescriptions, _id, patientData } =
                  row;
                const isItemSelected = isSelected(_id, selectedRows);
                const x = prescriptions.map((i) => i.drugPrice);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={_id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                    onClick={() => history.push(`completed-order/${_id}/order`)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        onClick={() =>
                          handleSelectedRows(
                            row.id,
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
                            src={patientData?.image || displayPhoto}
                            sx={{ width: 24, height: 24 }}
                          />
                        </span>
                        <span style={{ fontSize: "1.25rem" }}>
                          {patientData
                            ? `${patientData?.firstName} ${patientData?.lastName}`
                            : "No Value"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {prettyMoney(
                        prettyDollarConfig,
                        x?.reduce(function (accumulator, currentValue) {
                          return accumulator + currentValue;
                        }, 0)
                      )}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {x?.length}
                    </TableCell>
                  </TableRow>
                );
              })}
            </EnhancedTable>
          </Grid>
        ) : (
          <EmptyTable
            headCells={partnersHeadCells}
            paginationLabel="Orders  per page"
            text="No Completed Test"
          />
        )}
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
                      <FormLabel
                        component="legend"
                        className={classes.FormLabel}
                      >
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
                      <FormLabel
                        component="legend"
                        className={classes.FormLabel}
                      >
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
                      <FormLabel
                        component="legend"
                        className={classes.FormLabel}
                      >
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
      </Grid>
    </>
  );
};

export default CompletedOrders;
