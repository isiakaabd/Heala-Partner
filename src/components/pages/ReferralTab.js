import React, { useState, useEffect } from "react";
import { Loader, Filter } from "components/Utilities";

import {
  TableRow,
  Grid,
  Checkbox,
  Card,
  TableCell,
  Button,
} from "@mui/material";
import { dateMoment } from "components/Utilities/Time";
import { EnhancedTable, NoData, EmptyTable } from "components/layouts";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import { referralHeaderss } from "components/Utilities/tableHeaders";
import { useSelector } from "react-redux";
import { useActions } from "components/hooks/useActions";
import { handleSelectedRows } from "helpers/selectedRows";
import { isSelected } from "helpers/isSelected";
import { useLazyQuery } from "@apollo/client";
import { getRefferals } from "components/graphQL/useQuery";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import Filter from "components/Forms/Filters";
import {
  referralFilterBy,
  referralPageDefaultFilterValues,
} from "helpers/mockData";
import { Link } from "react-router-dom";
import {
  changeHospitalTableLimit,
  handleHospitalPageChange,
  onFilterValueChange,
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
  const [filterValues, setFilterValues] = useState(
    referralPageDefaultFilterValues
  );

  const [fetchRefferals, { loading, error, data, refetch, variables }] =
    useLazyQuery(getRefferals);

  const classes = useStyles();

  useEffect(() => {
    fetchRefferals({
      variables: {
        first: pageInfo.limit,
        providerId,
      },
    });
  }, [fetchRefferals, pageInfo, providerId]);

  const { selectedRows } = useSelector((state) => state.tables);
  const { setSelectedRows } = useActions();

  const [referral, setReferral] = useState([]);

  useEffect(() => {
    if (data) {
      const { referral, pageInfo } = data?.getReferrals;
      setReferral(referral);
      setPageInfo(pageInfo);
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
          <Grid
            item
            direction={{ sm: "row", md: "row", xs: "column" }}
            spacing={{ sm: 4, md: 4, xs: 2 }}
            container
            sx={{ mb: 2 }}
          >
            <Grid item>
              <Filter
                onHandleChange={(e) =>
                  onFilterValueChange(
                    e,
                    "type",
                    filterValues,
                    setFilterValues,
                    fetchRefferals,
                    variables,
                    refetch
                  )
                }
                options={referralFilterBy}
                name="status"
                placeholder="By Type"
                value={filterValues.type}
              />
            </Grid>
          </Grid>
          {referral?.length > 0 ? (
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
                          <span style={{ marginRight: "1rem" }}></span>
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
        </Card>
      </Grid>
    </>
  );
};

export default ReferralTab;
