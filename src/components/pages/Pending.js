import React, { useState, useEffect } from "react";
import { dateMoment } from "components/Utilities/Time";
import {
  Grid,
  Avatar,
  Button,
  Chip,
  TableRow,
  TableCell,
  Checkbox,
  FormControl,
  FormLabel,
} from "@mui/material";
import {
  Loader,
  Modals,
  Search,
  FilterList,
  FormSelect,
} from "components/Utilities";
import { EnhancedTable, NoData, EmptyTable } from "components/layouts";
import { makeStyles } from "@mui/styles";
import { patientsHeadCells } from "components/Utilities/tableHeaders";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import displayPhoto from "assets/images/avatar.svg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useActions } from "components/hooks/useActions";
import { handleSelectedRows } from "helpers/selectedRows";
import { isSelected } from "helpers/isSelected";
import useFormInput from "components/hooks/useFormInput";
import { useLazyQuery } from "@apollo/client";
import { getDiagnosticTests } from "components/graphQL/useQuery";
import prettyMoney from "pretty-money";
import {
  changeTableLimit,
  fetchMoreData,
  handlePageChange,
} from "helpers/filterHelperFunctions";
const referralOptions = ["Hello", "World", "Goodbye", "World"];

const plans = ["Plan 1", "Plan 2", "Plan 3", "Plan 4"];

const statusType = ["Active", "Blocked"];

const useStyles = makeStyles((theme) => ({
  button: {
    "&.MuiButton-root": {
      background: "#fff",
      color: theme.palette.common.grey,
      textTransform: "none",
      borderRadius: "2rem",
      display: "flex",
      alignItems: "center",
      padding: "1rem",
      maxWidth: "10rem",

      "&:hover": {
        background: "#fcfcfc",
      },

      "&:active": {
        background: "#fafafa",
      },

      "& .MuiButton-endIcon>*:nth-of-type(1)": {
        fontSize: "1.2rem",
      },

      "& .MuiButton-endIcon": {
        marginLeft: ".3rem",
        marginTop: "-.2rem",
      },
    },
  },

  tableCell: {
    "&.MuiTableCell-root": {
      fontSize: "1.25rem",
      textAlign: "left",
    },
  },

  badge: {
    "&.MuiChip-root": {
      fontSize: "1.25rem !important",
      height: "2.7rem",

      borderRadius: "1.3rem",
    },
  },
  chip: {
    "&.MuiChip-root": {
      fontSize: "1.25rem",
      height: "3rem",
      borderRadius: "1.3rem",
      cursor: "pointer",
      background: theme.palette.common.white,
      color: theme.palette.common.grey,
      "& .MuiChip-deleteIcon": {
        color: "inherit",
        fontSize: "inherit",
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
}));

const Pending = () => {
  const classes = useStyles();
  const [pendingState, setPendingState] = useState([]);
  const status = "pending";
  const partnerProviderId = localStorage.getItem("partnerProviderId");
  const [fetchDiagnostics, { data, loading, error }] =
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
  const debouncer = useCallback(debounce(fetchDiagnostics), []);
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
      setPendingState(data?.getDiagnosticTests.data);
      setPageInfo(data.getDiagnosticTests.pageInfo);
    }
  }, [data]);

  const [inputValue, handleInputValue] = useFormInput({
    date: "",
    plan: "",
    gender: "",
    status: "",
  });

  const { date, plan } = inputValue;

  const { selectedRows } = useSelector((state) => state.tables);
  const { setSelectedRows } = useActions();
  const [isOpen, setIsOpen] = useState(false);

  const handleDialogOpen = () => setIsOpen(true);

  const handleDialogClose = () => setIsOpen(false);
  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;
  const prettyDollarConfig = {
    currency: "₦",
    position: "before",
    spaced: false,
    thousandsDelimiter: ",",
  };

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
              onChange={(e) => {
                let value = e.target.value;
                if (value !== "") {
                  return debouncer({
                    variables: { referralId: value, partnerProviderId },
                  });
                }
              }}
              placeholder="Type to search Test by referral ID..."
              height="5rem"
            />
          </Grid>
          <Grid item>
            <FilterList title="Filter" onClick={handleDialogOpen} />
          </Grid>
        </Grid>
        {/* The Search and Filter ends here */}
        {pendingState.length > 0 ? (
          <Grid item container height="100%">
            <EnhancedTable
              headCells={patientsHeadCells}
              rows={pendingState}
              paginationLabel="orders per page"
              handleChangePage={(e, pageNum) =>
                fetchMoreData(e, pageNum, status, partnerProviderId)
              }
              hasCheckbox={true}
              changeLimit={(e) =>
                changeTableLimit(e, fetchDiagnostics, status, partnerProviderId)
              }
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
              {pendingState.map((row, index) => {
                const {
                  createdAt,
                  _id,
                  referralId,
                  patientData,
                  doctorData,
                  tests,
                } = row;
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
                      {referralId}
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
                            alt={`Display Photo of ${doctorData?.lastName}`}
                            src={doctorData ? doctorData.picture : displayPhoto}
                            sx={{ width: 24, height: 24 }}
                          />
                        </span>
                        <span style={{ fontSize: "1.25rem" }}>
                          {doctorData
                            ? `${doctorData.firstName} ${doctorData.lastName}`
                            : " No Doctor"}
                        </span>
                      </div>
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
                            src={
                              patientData?.image
                                ? patientData.image
                                : displayPhoto
                            }
                            sx={{ width: 24, height: 24 }}
                          />
                        </span>
                        <span style={{ fontSize: "1.25rem" }}>
                          {/* {row.firstName} */}
                          {patientData
                            ? `${patientData.firstName} ${patientData.lastName}`
                            : " No User"}
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
                        label="View request"
                        variant="outlined"
                        component={Link}
                        to={`pending/${_id}/request`}
                        className={classes.chip}
                        sx={{ "&:hover": { cursor: "pointer" } }}
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
            headCells={patientsHeadCells}
            paginationLabel="Orders  per page"
            text="No pending test"
          />
        )}
      </Grid>
      <Modals
        isOpen={isOpen}
        title="Filter"
        rowSpacing={5}
        handleClose={handleDialogClose}
      >
        <Grid item container direction="column" rowGap={3}>
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
                        options={referralOptions}
                        value={date}
                        onChange={handleInputValue}
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
                      Refferal ID
                    </FormLabel>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <FormSelect
                        name="plan"
                        options={plans}
                        value={plan}
                        onChange={handleInputValue}
                        placeholderText="Enter ID"
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
                    <FormLabel component="legend" className={classes.FormLabel}>
                      Affliation
                    </FormLabel>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth style={{ height: "3rem" }}>
                      <FormSelect
                        name="status"
                        options={statusType}
                        value={status}
                        onChange={handleInputValue}
                        placeholderText="Select Affliation"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item marginTop={3}>
            <Button
              variant="contained"
              onClick={handleDialogClose}
              type="submit"
              className={classes.searchFilterBtn}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Modals>
    </>
  );
};

export default Pending;
