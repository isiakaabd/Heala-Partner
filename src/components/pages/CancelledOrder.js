import React, { useState, useEffect } from "react";
import {
  Grid,
  TableRow,
  FormLabel,
  FormControl,
  TableCell,
  Button,
} from "@mui/material";
import { dateMoment } from "components/Utilities/Time";
import { makeStyles } from "@mui/styles";
import { NoData, EmptyTable, EnhancedTable } from "components/layouts";
import {
  Search,
  Modals,
  Loader,
  CustomButton,
  FormSelect,
} from "components/Utilities";
import useFormInput from "components/hooks/useFormInput";
import { messagesHeadCell } from "components/Utilities/tableHeaders";
import { useSelector } from "react-redux";
import { isSelected } from "helpers/isSelected";
import { useLazyQuery } from "@apollo/client";
import { getDiagnosticTests } from "components/graphQL/useQuery";
import { useTheme } from "@mui/material/styles";
import {
  changeTableLimit,
  handlePageChange,
} from "helpers/filterHelperFunctions";

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

const CancelledOrder = () => {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const classes = useStyles();
  const status = "cancelled";
  const partnerProviderId = localStorage.getItem("partnerProviderId");
  const [scheduleState, setScheduleState] = useState([]);
  const [fetchDiagnostics, { loading, error, data }] =
    useLazyQuery(getDiagnosticTests);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
    totalDocs: 0,
  });
  //eslint-disable-next-line
  const handleSubmitSearch = async () => {
    try {
      const { data } = await fetchDiagnostics({
        variables: { testId: search, status, partnerProviderId },
      });
      if (data) {
        setScheduleState(data?.getDiagnosticTests.data);
        setPageInfo(data.getDiagnosticTests.pageInfo);
      }
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    fetchDiagnostics({
      variables: {
        first: pageInfo.limit,
        status,
        partnerProviderId,
      },
    });
  }, [fetchDiagnostics, partnerProviderId, pageInfo]);

  useEffect(() => {
    if (data) {
      setScheduleState(data?.getDiagnosticTests.data);
      setPageInfo(data?.getDiagnosticTests.pageInfo);
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
  const { selectedRows } = useSelector((state) => state.tables);
  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
  };

  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;
  return (
    <>
      <Grid
        container
        direction="column"
        gap={2}
        height="100%"
        flexWrap="nowrap"
      >
        <Grid item container spacing={{ md: 4, sm: 4, xs: 2 }}>
          <Grid item flex={1}>
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type to search Test by test ID..."
            />
          </Grid>
          <Grid item>
            <CustomButton
              title="Search"
              type={buttonType}
              disabled={!search}
              onClick={handleSubmitSearch}
            />
            {/* <FilterList
              onClick={() => setOpenFilterPartner(true)}
              title="Filter Referrals"
            /> */}
          </Grid>
        </Grid>
        {scheduleState.length > 0 ? (
          <Grid item container height="100%">
            <EnhancedTable
              headCells={messagesHeadCell}
              rows={scheduleState}
              paginationLabel="Cancelled per page"
              hasCheckbox={true}
              changeLimit={(e) => {
                changeTableLimit(
                  e,
                  fetchDiagnostics,
                  status,
                  partnerProviderId
                );
              }}
              dataPageInfo={pageInfo}
              handlePagination={(page) => {
                handlePageChange(
                  fetchDiagnostics,
                  page,
                  pageInfo,
                  status,
                  partnerProviderId
                );
              }}
            >
              {scheduleState.map((row, index) => {
                const {
                  createdAt,
                  _id,
                  referralId,
                  patientData,
                  testId,
                  cancellationReason,
                } = row;
                const isItemSelected = isSelected(row.id, selectedRows);

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
                    <TableCell
                      id={labelId}
                      scope="row"
                      align="left"
                      className={classes.tableCell}
                    >
                      {dateMoment(createdAt)}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {referralId}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {testId}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {cancellationReason}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: "1.25rem" }}>
                          {patientData
                            ? `${patientData.firstName} ${patientData.lastName}`
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
            headCells={messagesHeadCell}
            paginationLabel="Orders  per page"
            text="No Cancelled Test"
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
              <Grid item xs={6}>
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
              <Grid item xs={6}>
                <Grid container direction="column">
                  <Grid item>
                    <FormLabel component="legend" className={classes.FormLabel}>
                      Referral ID
                    </FormLabel>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <FormSelect
                        name="Referral"
                        options={specializations}
                        value={hospitalName}
                        onChange={handleSelectedInput}
                        placeholderText="Referral ID"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item style={{ marginBlock: "3rem" }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Grid container direction="column">
                  <Grid item>
                    <FormLabel component="legend" className={classes.FormLabel}>
                      Reason
                    </FormLabel>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth style={{ height: "3rem" }}>
                      <FormSelect
                        name="Reason"
                        options={hospitals}
                        value={categoryName}
                        onChange={handleSelectedInput}
                        placeholderText="Reason"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md></Grid>
            </Grid>
          </Grid>
          <Grid item marginTop={2}>
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

export default CancelledOrder;
