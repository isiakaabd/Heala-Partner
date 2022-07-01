import React, { useState, useEffect } from "react";
import { Loader, Search } from "components/Utilities";

import {
  TableRow,
  Grid,
  Checkbox,
  TableCell,
  Avatar,
  Button,
} from "@mui/material";
import { dateMoment } from "components/Utilities/Time";
import { EnhancedTable, NoData, EmptyTable } from "components/layouts";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import { referralHeaderss } from "components/Utilities/tableHeaders";
// import { FilterList } from "components/Utilities";
import displayPhoto from "assets/images/avatar.svg";
import { useSelector } from "react-redux";
import { useActions } from "components/hooks/useActions";
import { handleSelectedRows } from "helpers/selectedRows";
import { isSelected } from "helpers/isSelected";
import { useLazyQuery } from "@apollo/client";
import { getRefferals } from "components/graphQL/useQuery";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import Filter from "components/Forms/Filters";

import { Link } from "react-router-dom";
import {
  changeHospitalTableLimit,
  handleHospitalPageChange,
  // onFilterValueChange,
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
      padding: "1rem",
      width: "10rem",

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

const ReferralTab = () => {
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
    totalDocs: 0,
  });
  const providerId = localStorage.getItem("partnerProviderId");
  const theme = useTheme();
  const [fetchRefferals, { loading, error, data, refetch }] =
    useLazyQuery(getRefferals);

  const classes = useStyles();
  const onChange = async (e) => {
    setSearchMail(e);
    if (e === "") {
      refetch();
    } else refetch({ id: e });
  };

  useEffect(() => {
    fetchRefferals({
      variables: {
        first: pageInfo.limit,
        providerId: providerId,
      },
    });
  }, [fetchRefferals, pageInfo, providerId]);

  const { selectedRows } = useSelector((state) => state.tables);
  const { setSelectedRows } = useActions();
  const [searchMail, setSearchMail] = useState("");

  const [referral, setReferral] = useState([]);

  useEffect(() => {
    if (data) {
      setReferral(data.getReferrals.referral);
      setPageInfo(data.getReferrals.pageInfo);
    }
  }, [data]);

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
          direction={{ sm: "row", md: "row", xs: "column" }}
          spacing={{ sm: 4, md: 4, xs: 2 }}
          container
        >
          <Grid item flex={1}>
            <Search
              value={searchMail}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Type to search referrals by ID e.g 1Ntqaazu..."
              height="5rem"
            />
          </Grid>
          {/* <Grid item>
            <FilterList title="Filter" onClick={handleDialogOpen} />
          </Grid> */}
        </Grid>
        {loading ? (
          <Loader />
        ) : referral?.length > 0 ? (
          <Grid item container>
            <EnhancedTable
              headCells={referralHeaderss}
              rows={referral}
              paginationLabel="referral per page"
              hasCheckbox={true}
              changeLimit={(e) =>
                changeHospitalTableLimit(fetchRefferals, {
                  first: e,
                  providerId: providerId,
                })
              }
              dataPageInfo={pageInfo}
              handlePagination={(page) =>
                handleHospitalPageChange(fetchRefferals, page, pageInfo, {
                  providerId: providerId,
                })
              }
            >
              {referral.map((row, index) => {
                const { _id, createdAt, type, doctorData, patientData } = row;

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
                      {/* {new Date(updatedAt)} */}
                      {_id ? _id : "No Value"}
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
                            alt={`image of ${
                              doctorData?.firstName
                                ? doctorData.firstName
                                : "placeholder Display Image"
                            }`}
                            src={
                              doctorData?.picture
                                ? doctorData?.picture
                                : displayPhoto
                            }
                            sx={{ width: 24, height: 24 }}
                          />
                        </span>
                        <span style={{ fontSize: "1.25rem" }}>
                          {doctorData?.firstName
                            ? `${doctorData?.firstName} ${doctorData?.lastName}`
                            : "No Doctor"}
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
                            alt={`image of ${
                              patientData?.firstName
                                ? patientData?.firstName
                                : "placeholder Display Image"
                            }`}
                            src={
                              patientData?.picture
                                ? patientData?.picture
                                : displayPhoto
                            }
                            sx={{ width: 24, height: 24 }}
                          />
                        </span>
                        <span style={{ fontSize: "1.25rem" }}>
                          {patientData?.firstName
                            ? `${patientData?.firstName} ${patientData?.lastName}`
                            : "No Patient"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell
                      align="left"
                      className={classes.tableCell}
                      style={{ color: theme.palette.common.black }}
                    >
                      {type}
                    </TableCell>

                    <TableCell align="left" className={classes.tableCell}>
                      <Button
                        variant="contained"
                        className={classes.button}
                        component={Link}
                        to={`referrals/${_id}`}
                        endIcon={<ArrowForwardIosIcon />}
                      >
                        View Referral
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </EnhancedTable>
          </Grid>
        ) : (
          <EmptyTable
            headCells={referralHeaderss}
            paginationLabel="Referral  per page"
          />
        )}
      </Grid>
    </>
  );
};

export default ReferralTab;
