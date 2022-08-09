import React, { useState, useEffect } from "react";
import {
  TableRow,
  Grid,
  Typography,
  TableCell,
  Avatar,
  Chip,
  Checkbox,
} from "@mui/material";

import { useSelector } from "react-redux";
import { handleSelectedRows } from "helpers/selectedRows";
import {
  changeHospitalTableLimit,
  handleHospitalPageChange,
} from "helpers/filterHelperFunctions";
import EnhancedTable from "./EnhancedTable";
import { isSelected } from "helpers/isSelected";
import { availabilityHeadCells } from "components/Utilities/tableHeaders";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import displayPhoto from "assets/images/avatar.svg";
import { hours } from "components/Utilities/Time";
import { EmptyTable } from "components/layouts";
import { useActions } from "components/hooks/useActions";
import PropTypes from "prop-types";
import { useLazyQuery } from "@apollo/client";
import { defaultPageInfo } from "helpers/mockData";
import { getAvailabilities } from "components/graphQL/useQuery";
const useStyles = makeStyles((theme) => ({
  tableCell: {
    "&.MuiTableCell-root": {
      fontSize: "1.25rem",
    },
  },
  button: {
    "&.MuiButton-root": {
      ...theme.typography.rowBtn,
      paddingTop: ".5rem",
      paddingBottom: ".5rem",
      background: theme.palette.common.lightGrey,
      color: theme.palette.primary.dark,

      "&:hover": {
        background: "#ccc",
      },

      "&:active": {
        background: theme.palette.primary.light,
        color: "#fff",
      },

      "& .MuiButton-endIcon>*:nth-of-type(1)": {
        fontSize: "1.2rem",
      },
    },
  },

  badge: {
    "&.MuiChip-root": {
      fontSize: "1.2rem !important",
      height: "2.7rem",
      borderRadius: "1.3rem",
    },
  },
}));

const AvailabilityTable = ({ data }) => {
  // const [avaliablity, setAvaliablity] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
    totalDocs: 0,
  });
  // useEffect(() => {
  //   setAvaliablity(data.availableDoctors);
  // }, [data]);
  const [fetchAvailabilities] = useLazyQuery(getAvailabilities);
  useEffect(() => {
    fetchAvailabilities({
      variables: {
        first: 10,
      },
    });
  }, [fetchAvailabilities]);

  useEffect(() => {
    fetchAvailabilities({
      variables: {
        first: pageInfo.limit,
      },
    }).then(({ data }) => {
      if (data) {
        setPageInfo(data?.getAvailabilities?.pageInfo || []);
        setAvailabilities(
          data?.getAvailabilities?.availability || defaultPageInfo
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { selectedRows } = useSelector((state) => state.tables);

  const { setSelectedRows } = useActions();
  const [availabilities, setAvailabilities] = useState([]);

  const setTableData = async (response, errMsg) => {
    response
      .then(({ data }) => {
        setPageInfo(data?.getAvailabilities?.pageInfo || []);
        setAvailabilities(
          data?.getAvailabilities?.availability || defaultPageInfo
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Grid item container direction="column" height="100%" rowGap={2}>
      <Grid item>
        <Typography variant="h4">Availability Table</Typography>
      </Grid>
      {availabilities?.length > 0 ? (
        <Grid
          item
          container
          direction="column"
          overflow="hidden"
          maxWidth={{ md: "100%", sm: "100%", xs: "100%" }}
        >
          <EnhancedTable
            headCells={availabilityHeadCells}
            rows={availabilities}
            paginationLabel="Availabilities per page"
            hasCheckbox={true}
            changeLimit={async (e) => {
              const res = changeHospitalTableLimit(fetchAvailabilities, {
                first: e,
              });
              await setTableData(res, "Failed to change table limit.");
            }}
            dataPageInfo={pageInfo}
            handlePagination={(page) => {
              handleHospitalPageChange(fetchAvailabilities, page, pageInfo);
            }}
          >
            {availabilities?.map((row, index) => {
              const { _id, picture, firstName, lastName, dociId, day, times } =
                row;
              const labelId = `enhanced-table-checkbox-${index}`;
              const isItemSelected = isSelected(_id, selectedRows);

              return (
                <TableRow hover tabIndex={-1} key={_id}>
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
                    style={{ color: theme.palette.common.grey }}
                  >
                    {dociId ? dociId?.split("-")[1] : "No Value"}
                  </TableCell>
                  <TableCell align="left" className={classes.tableCell}>
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        textAlign: "left",
                      }}
                    >
                      <span style={{ marginRight: "1rem" }}>
                        <Avatar
                          alt="Remy Sharp"
                          src={picture ? picture : displayPhoto}
                          sx={{ width: 24, height: 24 }}
                        />
                      </span>
                      <span style={{ fontSize: "1.25rem" }}>
                        {firstName ? `${firstName} ${lastName}` : "no name"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell align="left" className={classes.tableCell}>
                    {day ? day : "No Value"}
                  </TableCell>
                  <TableCell align="left" className={classes.tableCell}>
                    <Grid container gap={1}>
                      {times
                        ? times?.map((time, ind) => {
                            const { start, stop, available } = time;
                            return (
                              <Chip
                                key={ind}
                                label={`${hours(start)} - ${hours(stop)} `}
                                className={classes.badge}
                                style={{
                                  background: !!available
                                    ? theme.palette.common.lightGreen
                                    : theme.palette.common.lightRed,
                                  color: !!available
                                    ? theme.palette.common.green
                                    : theme.palette.common.red,
                                  textDecoration: !!available
                                    ? ""
                                    : "line-through",
                                }}
                              />
                            );
                          })
                        : "No Time"}
                    </Grid>
                  </TableCell>
                </TableRow>
              );
            })}
          </EnhancedTable>
        </Grid>
      ) : (
        <EmptyTable
          headCells={availabilityHeadCells}
          paginationLabel="Availability  per page"
        />
      )}
    </Grid>
  );
};
AvailabilityTable.propTypes = {
  data: PropTypes.object,
};

export default AvailabilityTable;
