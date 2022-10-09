import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Card,
  TableCell,
  TableRow,
  Checkbox,
} from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import {
  timeMoment,
  dateMoment,
  formatNumber,
} from "components/Utilities/Time";
import { EnhancedTable, NoData, EmptyTable } from "components/layouts";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import { financeHeader2 } from "components/Utilities/tableHeaders";
import { useSelector } from "react-redux";
import { useActions } from "components/hooks/useActions";
import { handleSelectedRows } from "helpers/selectedRows";
import { isSelected } from "helpers/isSelected";
import { Loader } from "components/Utilities";
import { useLazyQuery } from "@apollo/client";
import { getSubscriptionsIncome } from "components/graphQL/useQuery";
import { defaultPageInfo } from "helpers/mockData";
import {
  changeHospitalTableLimit,
  handleHospitalPageChange,
} from "helpers/filterHelperFunctions";
import { useAlert } from "components/hooks";

const useStyles = makeStyles((theme) => ({
  button: {
    "&.css-1zf5oc-MuiButtonBase-root-MuiButton-root": {
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

      "& .css-9tj150-MuiButton-endIcon>*:nth-of-type(1)": {
        fontSize: "1.2rem",
      },

      "& .css-9tj150-MuiButton-endIcon": {
        marginLeft: ".3rem",
        marginTop: "-.2rem",
      },
    },
  },
  iconWrapper: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    display: "grid",
    placeContent: "center",
    background: theme.palette.common.lightGreen,
  },

  tableCell: {
    "&.css-1jilxo7-MuiTableCell-root": {
      fontSize: "1.25rem",
    },
  },

  badge: {
    "&.css-1eelh6y-MuiChip-root": {
      fontSize: "1.6rem !important",
      height: "3rem",
      borderRadius: "1.3rem",
    },
  },
}));

const SubscriptionIncome = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [profiles, setProfiles] = useState("");
  const { displayMessage } = useAlert();
  const { selectedRows } = useSelector((state) => state.tables);
  const { setSelectedRows } = useActions();
  const [pageInfo, setPageInfo] = useState(defaultPageInfo);

  const [fetchDoctors, { error, loading }] = useLazyQuery(
    getSubscriptionsIncome
  );

  const setTableData = async (response, errMsg) => {
    try {
      setPageInfo(
        response.getEarningStats.subscriptionIncomeData.PageInfo || []
      );
      setProfiles(
        response.getEarningStats.subscriptionIncomeData.data || defaultPageInfo
      );
    } catch (error) {
      console.error(error);
      displayMessage("error", error);
    }
  };
  const partnerProviderId = localStorage.getItem("partnerProviderId");

  useEffect(() => {
    try {
      async function fetchData() {
        const { data } = await fetchDoctors({
          variables: {
            first: pageInfo.limit,
            providerId: partnerProviderId,
          },
        });
        if (data) {
          setPageInfo(
            data.getEarningStats.subscriptionIncomeData.PageInfo || []
          );
          setProfiles(
            data.getEarningStats.subscriptionIncomeData.data || defaultPageInfo
          );
        }
        // ...
      }
      fetchData();
    } catch (err) {
      console.error(err);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;
  return (
    <Grid container direction="column" gap={2} height="100%">
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: "1.5rem",
          borderColor: "transparent",
          p: 2,
          mt: 2,
        }}
      >
        <Grid item container gap={1} alignItems="center">
          <Grid item flex={1}>
            <Typography noWrap variant="h1" component="div" color="#2D2F39">
              Subscription Earnings table
            </Typography>
          </Grid>
          <Grid item className={classes.iconWrapper}>
            <TrendingDownIcon color="success" className={classes.cardIcon} />
          </Grid>
        </Grid>
        {profiles.length > 0 ? (
          <Grid item container>
            <EnhancedTable
              headCells={financeHeader2}
              rows={profiles}
              paginationLabel="finance per page"
              hasCheckbox={true}
              dataPageInfo={pageInfo}
              changeLimit={async (e) => {
                const res = await changeHospitalTableLimit(fetchDoctors, {
                  first: e,
                  providerId: partnerProviderId,
                });
                console.log(res);
                await setTableData(res.data, "Failed to change table limit");
              }}
              handlePagination={async (page) => {
                const res = handleHospitalPageChange(
                  fetchDoctors,
                  page,
                  pageInfo,
                  partnerProviderId
                );
                await setTableData(res, "Failed to change page.");
              }}
            >
              {profiles.map((row, index) => {
                const { createdAt, amount, patientData, providerId, planId } =
                  row;
                const { firstName, image, lastName } = patientData || {};
                const isItemSelected = isSelected(row._id, selectedRows);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row._id}
                    selected={isItemSelected}
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
                      align="left"
                      className={classes.tableCell}
                      style={{ color: theme.palette.common.red }}
                    >
                      {formatNumber(amount.toFixed(2))}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {patientData && patientData !== {} ? (
                        <div
                          style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontSize: "1.25rem" }}>
                            {patientData &&
                              `${firstName && firstName} ${
                                lastName && lastName
                              }`}
                          </span>
                        </div>
                      ) : (
                        "No name"
                      )}
                    </TableCell>
                    <TableCell
                      align="left"
                      className={classes.tableCell}
                      style={{ color: theme.palette.common.red }}
                    >
                      {planId}
                    </TableCell>
                    <TableCell
                      align="left"
                      className={classes.tableCell}
                      style={{ color: theme.palette.common.red }}
                    >
                      {providerId}
                    </TableCell>

                    <TableCell
                      id={labelId}
                      scope="row"
                      align="left"
                      className={classes.tableCell}
                      style={{ color: theme.palette.common.black }}
                    >
                      {`${dateMoment(createdAt)} - ${timeMoment(createdAt)}`}
                    </TableCell>
                  </TableRow>
                );
              })}
            </EnhancedTable>
          </Grid>
        ) : (
          <EmptyTable
            headCells={financeHeader2}
            paginationLabel="Finance  per page"
          />
        )}
      </Card>
    </Grid>
  );
};

export default SubscriptionIncome;
