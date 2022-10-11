import React, { useState, useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link, useHistory } from "react-router-dom";
import {
  changeHospitalTableLimit,
  handleHospitalPageChange,
} from "helpers/filterHelperFunctions";
import {
  Grid,
  Typography,
  TableCell,
  Button,
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
import { payoutHeaderss1 } from "components/Utilities/tableHeaders";
import { useSelector } from "react-redux";
import { useActions } from "components/hooks/useActions";
import { handleSelectedRows } from "helpers/selectedRows";
import { isSelected } from "helpers/isSelected";
import { Loader } from "components/Utilities";
import { useLazyQuery } from "@apollo/client";
import { getEarningStats } from "components/graphQL/useQuery";
import { defaultPageInfo } from "helpers/mockData";
import { useAlert } from "components/hooks";
const useStyles = makeStyles((theme) => ({
  searchGrid: {
    "&.css-13i4rnv-MuiGrid-root": {
      flex: 1,
      marginRight: "5rem",
    },
  },
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
  buttons: {
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

const Financetable = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { displayMessage } = useAlert();
  const partnerProviderId = localStorage.getItem("partnerProviderId");
  const [profiles, setProfiles] = useState("");
  const { selectedRows } = useSelector((state) => state.tables);
  const { setSelectedRows } = useActions();
  const [fetchDoctors, { error, loading }] = useLazyQuery(getEarningStats);

  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
    totalDocs: 0,
  });

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
          setPageInfo(data.getEarningStats.earningData.PageInfo || []);
          setProfiles(data.getEarningStats.earningData.data || defaultPageInfo);
        }
        // ...
      }
      fetchData();
    } catch (err) {
      console.error(err);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTableData = async (response, errMsg) => {
    try {
      setPageInfo(response.getEarningStats.earningData.PageInfo || []);
      setProfiles(response.getEarningStats.earningData.data || defaultPageInfo);
    } catch (error) {
      console.error(error);
      displayMessage("error", error);
    }
  };
  const history = useHistory();
  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;

  return (
    <Grid container direction="column" gap={2} height="100%">
      <>
        <Grid item container gap={1} alignItems="center">
          <Grid item>
            <Typography noWrap variant="h1" component="div" color="#2D2F39">
              Earnings table
            </Typography>
          </Grid>
          <Grid item className={classes.iconWrapper}>
            <TrendingDownIcon color="success" className={classes.cardIcon} />
          </Grid>
        </Grid>
        {profiles.length > 0 ? (
          <Grid item container>
            <EnhancedTable
              headCells={payoutHeaderss1}
              rows={profiles}
              paginationLabel="finance per page"
              hasCheckbox={true}
              dataPageInfo={pageInfo}
              changeLimit={async (e) => {
                const res = await changeHospitalTableLimit(fetchDoctors, {
                  first: e,
                  providerId: partnerProviderId,
                });

                await setTableData(res.data, "Failed to change table limit");
              }}
              handlePagination={async (page) => {
                const res = handleHospitalPageChange(
                  fetchDoctors,
                  page,
                  pageInfo,
                  partnerProviderId
                );
                await setTableData(res.data, "Failed to change page.");
              }}
            >
              {profiles.map((row, index) => {
                const { createdAt, providerId, balance, doctorData } = row;
                const { firstName, lastName } = doctorData[0] || {};
                const isItemSelected = isSelected(row._id, selectedRows);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row._id}
                    style={{ cursor: "pointer" }}
                    selected={isItemSelected}
                    onClick={() =>
                      history.replace(
                        `/hcps/${doctorData[0]._id}/consultations`
                      )
                    }
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
                      {formatNumber(balance.toFixed(2))}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {doctorData && doctorData[0] !== {} ? (
                        <div
                          style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontSize: "1.25rem" }}>
                            {doctorData &&
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
                      id={labelId}
                      scope="row"
                      align="left"
                      className={classes.tableCell}
                      style={{ color: theme.palette.common.black }}
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
            headCells={payoutHeaderss1}
            paginationLabel="Finance  per page"
          />
        )}
      </>
    </Grid>
  );
};

export default Financetable;
