import React, { useState, useEffect } from "react";
import { dateMoment } from "components/Utilities/Time";
import {
  Grid,
  Button,
  FormControl,
  Chip,
  Avatar,
  TableRow,
  FormLabel,
  Checkbox,
  TableCell,
} from "@mui/material";
import { Modals, Search, FilterList, Loader } from "components/Utilities";
import FormSelect from "components/Utilities/FormSelect";
import EnhancedTable from "components/layouts/EnhancedTable";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import { patientsHeadCells } from "components/Utilities/tableHeaders";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import displayPhoto from "assets/images/avatar.svg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useActions } from "components/hooks/useActions";
import { handleSelectedRows } from "helpers/selectedRows";
import { isSelected } from "helpers/isSelected";
import useFormInput from "components/hooks/useFormInput";
import { useQuery } from "@apollo/client";
import { getDrugOrders } from "components/graphQL/useQuery";
import { NoData, EmptyTable } from "components/layouts"; //
import prettyMoney from "pretty-money";
const referralOptions = ["Hello", "World", "Goodbye", "World"];

const plans = ["Plan 1", "Plan 2", "Plan 3", "Plan 4"];
const genderType = ["Male", "Female", "Prefer not to say"];
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

const PendingOrder = () => {
  const classes = useStyles();
  const theme = useTheme();

  const [state, setState] = useState([]);
  const orderState = "pending";
  const { data, loading, error } = useQuery(getDrugOrders, {
    variables: { status: orderState },
  });
  useEffect(() => {
    if (data) return setState(data?.getDrugOrders.data);
  }, [data]);

  const [inputValue, handleInputValue] = useFormInput({
    date: "",
    plan: "",
    gender: "",
    status: "",
  });

  const { date, plan, gender, status } = inputValue;

  const { rowsPerPage, selectedRows, page } = useSelector(
    (state) => state.tables
  );
  const { setSelectedRows } = useActions();

  const [searchPatient, setSearchPatient] = useState("");
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
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
              placeholder="Type to search referrals..."
              height="5rem"
            />
          </Grid>
          <Grid item>
            <FilterList title="Filter " onClick={handleDialogOpen} />
          </Grid>
        </Grid>
        {/* The Search and Filter ends here */}
        {state.length > 0 ? (
          <Grid item container height="100%" direction="column">
            <EnhancedTable
              headCells={patientsHeadCells}
              rows={state}
              page={page}
              paginationLabel="orders per page"
              hasCheckbox={true}
            >
              {state.length > 0 &&
                state
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const {
                      orderId,
                      createdAt,
                      _id,
                      patientData,
                      doctorData,
                      prescriptions,
                    } = row;
                    const isItemSelected = isSelected(_id, selectedRows);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const x = prescriptions.map((i) => i.drugPrice);

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
                          style={{ color: theme.palette.common.grey }}
                        >
                          {dateMoment(createdAt)}
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
                                alt={`Display Photo of ${doctorData?.firstName}`}
                                src={doctorData?.picture || displayPhoto}
                                sx={{ width: 24, height: 24 }}
                              />
                            </span>
                            <span style={{ fontSize: "1.25rem" }}>
                              {doctorData
                                ? `${doctorData?.firstName} ${doctorData?.lastName}`
                                : "No Value"}
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
                            label="view request"
                            variant="outlined"
                            component={Link}
                            to={`pending-order/${_id}/order`}
                            className={classes.chip}
                            type="pending"
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
            text="No pending Order"
          />
        )}
      </Grid>
      <Modals
        isOpen={isOpen}
        title="Filter"
        rowSpacing={5}
        handleClose={handleDialogClose}
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
                        options={referralOptions}
                        value={date}
                        onChange={handleInputValue}
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
                      Order ID
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
          <Grid item style={{ marginBottom: "18rem", marginTop: "3rem" }}>
            <Grid container spacing={2}>
              <Grid item md>
                <Grid container direction="column">
                  <Grid item>
                    <FormLabel component="legend" className={classes.FormLabel}>
                      List of Drugs
                    </FormLabel>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth style={{ height: "3rem" }}>
                      <FormSelect
                        name="gender"
                        options={genderType}
                        value={gender}
                        onChange={handleInputValue}
                        placeholderText="Select Drugs"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md>
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
          <Grid item>
            <Button
              variant="contained"
              onClick={handleDialogClose}
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

export default PendingOrder;
