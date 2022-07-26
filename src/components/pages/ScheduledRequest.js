import React, { useState, useCallback, useEffect } from "react";
import {
  Grid,
  TableRow,
  Avatar,
  Chip,
  FormControl,
  FormLabel,
  Button,
  Checkbox,
  TableCell,
} from "@mui/material";
import { dateMoment, timeMoment } from "components/Utilities/Time";
import prettyMoney from "pretty-money";
import useFormInput from "components/hooks/useFormInput";
import { makeStyles } from "@mui/styles";
import {
  Modals,
  FormSelect,
  Search,
  CustomButton,
  Loader,
} from "components/Utilities";
import { Link } from "react-router-dom";
import { EnhancedTable, NoData, EmptyTable } from "components/layouts";
import { partnersHeadCells } from "components/Utilities/tableHeaders";
import displayPhoto from "assets/images/avatar.svg";
import { useSelector } from "react-redux";
import { useActions } from "components/hooks/useActions";
import { handleSelectedRows } from "helpers/selectedRows";
import { isSelected } from "helpers/isSelected";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useLazyQuery } from "@apollo/client";
import { getDiagnosticTests } from "components/graphQL/useQuery";
import {
  changeTableLimit,
  fetchMoreData,
  handlePageChange,
} from "helpers/filterHelperFunctions";
import { useTheme } from "@mui/material/styles";
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
  tableCell: {
    "&.MuiTableCell-root": {
      fontSize: "1.25rem",
      textAlign: "left",
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

const ScheduledRequest = () => {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const theme = useTheme();
  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
  };
  const status = "scheduled";
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
  useEffect(() => {
    fetchDiagnostics({
      variables: {
        first: pageInfo.limit,
        status,
        partnerProviderId,
      },
    });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (data) {
      setScheduleState(data?.getDiagnosticTests.data);
      setPageInfo(data?.getDiagnosticTests.pageInfo);
    }
  }, [data]);
  const [openFilterPartner, setOpenFilterPartner] = useState(false);

  // FILTER PARTNERS SELECT STATES
  const [filterSelectInput, handleSelectedInput] = useFormInput({
    hospitalName: "",
    date: "",
    categoryName: "",
  });
  const handleSubmitSearch = useCallback(async () => {
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
    //eslint-disable-next-line
  }, [search]);
  const { hospitalName, date, categoryName } = filterSelectInput;
  const prettyDollarConfig = {
    currency: "₦",
    position: "before",
    spaced: false,
    thousandsDelimiter: ",",
  };

  const { selectedRows } = useSelector((state) => state.tables);

  const { setSelectedRows } = useActions();
  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;
  return (
    <>
      <Grid
        container
        direction="column"
        height="100%"
        gap={2}
        flexWrap="nowrap"
      >
        <Grid
          item
          container
          flexDirection={{ md: "row", sm: "row", xs: "column" }}
          spacing={{ md: 4, sm: 4, xs: 2 }}
        >
          <Grid item flex={1}>
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type to search Tests by test ID..."
              height="5rem"
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
        {scheduleState?.length > 0 ? (
          <Grid item container>
            <EnhancedTable
              headCells={partnersHeadCells}
              rows={scheduleState}
              paginationLabel="schedule per page"
              handleChangePage={(e, pageNum) =>
                fetchMoreData(e, pageNum, status, partnerProviderId)
              }
              hasCheckbox={true}
              changeLimit={(e) =>
                changeTableLimit(e, fetchDiagnostics, status, partnerProviderId)
              }
              dataPageInfo={pageInfo}
              handlePagination={(page) =>
                handlePageChange(
                  fetchDiagnostics,
                  page,
                  pageInfo,
                  status,
                  partnerProviderId
                )
              }
            >
              {scheduleState.map((row, index) => {
                const { _id, patientData, tests, createdAt, testId } = row;
                const isItemSelected = isSelected(_id, selectedRows);
                const labelId = `enhanced-table-checkbox-${index}`;
                const x = tests.map((i) => i.price);
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
                          handleSelectedRows(_id, selectedRows, setSelectedRows)
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
                      {testId ? testId : "No Test ID"}
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
                            alt={`Display Photo of ${
                              patientData ? patientData.firstName : "user"
                            }`}
                            src={patientData ? patientData.image : displayPhoto}
                            sx={{ width: 24, height: 24 }}
                          />
                        </span>
                        <span style={{ fontSize: "1.25rem" }}>
                          {patientData
                            ? `${patientData.firstName} ${patientData.lastName}`
                            : "No Patient"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {prettyMoney(
                        prettyDollarConfig,
                        x.reduce(function (accumulator, currentValue) {
                          return accumulator + currentValue;
                        }, 0)
                      )}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {x.length}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="View schedule"
                        variant="outlined"
                        component={Link}
                        to={`/schedule/${_id}/schedule`}
                        className={classes.chip}
                        deleteIcon={<ArrowForwardIosIcon />}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </EnhancedTable>
          </Grid>
        ) : (
          <EmptyTable
            headCells={partnersHeadCells}
            paginationLabel="Requests  per page"
            text="No Scheduled Test"
          />
        )}
        <Modals
          isOpen={openFilterPartner}
          title="Filter"
          rowSpacing={5}
          handleClose={() => setOpenFilterPartner(false)}
        >
          <Grid item container rowGap={3} direction="column">
            <Grid item>
              <Grid container spacing={2}>
                <Grid item xs={6}>
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
                <Grid item xs={6}>
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
            <Grid item>
              <Grid container spacing={2}>
                <Grid item xs={6}>
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
            <Grid item marginTop={3}>
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

export default ScheduledRequest;
