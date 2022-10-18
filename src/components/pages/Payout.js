import React, { useEffect, useState } from "react";
import { EmptyTable, NoData } from "components/layouts";
import { defaultPageInfo } from "helpers/mockData";
import { Grid, Typography, Chip, TableRow, TableCell } from "@mui/material";
import { timeMoment, dateMoment } from "components/Utilities/Time";
import { useAlert } from "components/hooks";
import { Loader } from "components/Utilities";
import { useLazyQuery } from "@apollo/client";
import { getEarningStats } from "components/graphQL/useQuery";
import EnhancedTable from "components/layouts/EnhancedTable";
import {
  changeHospitalTableLimit,
  handleHospitalPageChange,
} from "helpers/filterHelperFunctions";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import { payoutHeader } from "components/Utilities/tableHeaders";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useSelector } from "react-redux";
import { isSelected } from "helpers/isSelected";

const useStyles = makeStyles((theme) => ({
  searchGrid: {
    "&.css-13i4rnv-MuiGrid-root": {
      flex: 1,
      marginRight: "5rem",
    },
  },
  iconWrapper: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    display: "grid",
    placeContent: "center",
    marginLeft: "1rem",
    background: theme.palette.common.lightGreen,
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

  tableCell: {
    "&.css-1jilxo7-MuiTableCell-root": {
      fontSize: "1.25rem",
    },
  },

  badge: {
    "&.MuiChip-root": {
      fontSize: "1.6rem !important",
      height: "3rem",
      borderRadius: "1.3rem",
    },
  },
}));

const Payout = () => {
  const classes = useStyles();
  const theme = useTheme();
  const partnerProviderId = localStorage.getItem("partnerProviderId");
  const [profiles, setProfiles] = useState("");
  const { displayMessage } = useAlert();
  const { selectedRows } = useSelector((state) => state.tables);
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
          setPageInfo(data.getEarningStats.payoutData.PageInfo || []);
          setProfiles(data.getEarningStats.payoutData.data || defaultPageInfo);
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
    response
      .then(({ data }) => {
        setPageInfo(data.getEarningStats.payoutData.PageInfo || []);
        setProfiles(data.getEarningStats.payoutData.data || defaultPageInfo);
      })
      .catch((error) => {
        console.error(error);
        displayMessage("error", error);
      });
  };
  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;

  return (
    <Grid container direction="column" rowSpacing={2}>
      <>
        <Grid
          item
          container
          justifyContent="space-between"
          style={{ paddingBottom: "3rem" }}
        >
          <Grid item>
            <Grid item container alignItems="center">
              <Typography noWrap variant="h1" component="div" color="#2D2F39">
                Payout table
              </Typography>
              <Grid item className={classes.iconWrapper} marginLeft="1rem">
                <TrendingUpIcon color="success" className={classes.cardIcon} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {profiles?.length > 0 ? (
          <Grid item container>
            <EnhancedTable
              headCells={payoutHeader}
              rows={profiles}
              paginationLabel="payout per page"
              hasCheckbox={true}
              dataPageInfo={pageInfo}
              changeLimit={async (e) => {
                const res = await changeHospitalTableLimit(fetchDoctors, {
                  first: e,
                  providerId: partnerProviderId,
                });

                await setTableData(res, "Failed to change table limit");
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
                const { amount, createdAt, status, _id, doctorData } = row;
                const data = doctorData || [];
                const { firstName, lastName } = data[0] || {};
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
                    <TableCell
                      id={labelId}
                      scope="row"
                      align="left"
                      className={classes.tableCell}
                      style={{ color: theme.palette.common.black }}
                    >
                      {dateMoment(createdAt)}
                    </TableCell>
                    <TableCell
                      id={labelId}
                      scope="row"
                      align="left"
                      className={classes.tableCell}
                      style={{ color: theme.palette.common.black }}
                    >
                      {timeMoment(createdAt)}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      {row?.doctorData && row?.doctorData[0] !== {} ? (
                        <div
                          style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "left",
                          }}
                        >
                          <span style={{ fontSize: "1.25rem" }}>{`${
                            firstName && firstName
                          } ${lastName && lastName}`}</span>
                        </div>
                      ) : (
                        "No Name"
                      )}
                    </TableCell>
                    <TableCell
                      align="left"
                      className={classes.tableCell}
                      style={{ color: theme.palette.common.red }}
                    >
                      {amount}
                    </TableCell>
                    <TableCell align="left" className={classes.tableCell}>
                      <Chip
                        label={status}
                        className={classes.badge}
                        style={{
                          background:
                            status === "Success"
                              ? theme.palette.common.lightGreen
                              : status === "Failed"
                              ? theme.palette.common.lightGreen
                              : theme.palette.common.lightRed,
                          color:
                            status === "Success"
                              ? theme.palette.common.green
                              : status === "Failed"
                              ? theme.palette.common.danger
                              : theme.palette.common.red,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </EnhancedTable>
          </Grid>
        ) : (
          <EmptyTable
            headCells={payoutHeader}
            paginationLabel="Payout  per page"
          />
        )}
      </>
    </Grid>
  );
};

export default Payout;
