import React, { useEffect, useState, useCallback } from "react";
import { Grid, Typography, Card } from "@mui/material";
import { Loader } from "components/Utilities";

import { EmptyTable } from "components/layouts";
import { Modals } from "components/Utilities";
import {
  changeHospitalTableLimit,
  handleHospitalPageChange,
} from "helpers/filterHelperFunctions";
import { useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { TableRow, TableCell, Chip } from "@mui/material";
import { NoData } from "components/layouts";
import { CustomSelect } from "components/validation/Select";
import EnhancedTable from "components/layouts/EnhancedTable";
import { availabilityHeadCells10 } from "components/Utilities/tableHeaders";
import {
  getDoctorAvailabilityForDate,
  getAvailabilities,
} from "components/graphQL/useQuery";
import { hours, days, today } from "components/Utilities/Time";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import { defaultPageInfo } from "helpers/mockData";
const HcpAvailability = () => {
  const useStyles = makeStyles((theme) => ({
    tableCell: {
      "&.MuiTableCell-root": {
        fontSize: "1.25rem",
      },
    },

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
        whiteSpace: "nowrap",

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

    badge: {
      "&.MuiChip-root": {
        fontSize: "1.2rem !important",
        height: "2.7rem",
        borderRadius: "1.3rem",
      },
    },
  }));
  const { hcpId } = useParams();
  const id = localStorage.getItem("partnerProviderId");
  const theme = useTheme();
  // const { loading, data, error } = useQuery(getAvailability, {
  //   variables: {
  //     id: hcpId,
  //   },
  // });
  const classes = useStyles();
  const [availabilities, setAvailabilities] = useState([]);

  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
    totalDocs: 0,
  });
  const [fetchDay, { data: dt, loading: load2 }] = useLazyQuery(
    getDoctorAvailabilityForDate
  );
  const [fetchAvailabilities, { error, loading }] =
    useLazyQuery(getAvailabilities);
  // useEffect(() => {
  //   if (data) {
  //     const filteredAvailbility = (
  //       data?.getAvailabilities?.availability || []
  //     ).filter((availability) => availability?.times?.length > 0);
  //     setAvailabiltyArray(filteredAvailbility);
  //   }
  // }, [data]);
  useEffect(() => {
    fetchAvailabilities({
      variables: {
        first: 5,
        providerId: id,
        day: select,
        doctor: hcpId,
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
  const [select, setSelect] = useState(today());
  const [modal, setModal] = useState(false);
  const [avail, setAvail] = useState("");

  const setTableData = async (response, errMsg) => {
    if (response?.data) {
      setPageInfo(response?.data?.getAvailabilities?.pageInfo || []);
      setAvailabilities(
        response?.data?.getAvailabilities?.availability || defaultPageInfo
      );
    } else {
      console.error(errMsg);
    }
  };
  const [, setLoading] = useState(false);

  const handleCheckDay = useCallback((day, doctor) => {
    setModal(true);
    fetchDay({
      variables: {
        day,
        doctor,
      },
    });
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (dt) {
      const { available, day, times } = dt?.getDoctorAvailabilityForDate;
      setAvail({
        available,
        day,
        times,
      });
    } else {
      setAvail({
        availale: false,
        day: "Not Available",
        times: [],
      });
    }
  }, [dt]);

  const handleSelectChange = async (e) => {
    const { value } = e.target;

    setLoading(true);
    await fetchAvailabilities({
      variables: {
        first: 5,
        day: value,
        doctor: hcpId,
      },
    }).then(({ data }) => {
      if (data) {
        setPageInfo(data?.getAvailabilities?.pageInfo || []);
        setAvailabilities(
          data?.getAvailabilities?.availability || defaultPageInfo
        );
      }
    });
    setLoading(false);
    setSelect(value);
  };

  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;
  const { day, available, times } = avail;
  const partnerProviderId = localStorage.getItem("partnerProviderId");
  return (
    <>
      <Grid item container direction="column" height="100%">
        <Card
          variant="outlined"
          sx={{
            width: "100%",
            borderRadius: "1.5rem",
            borderColor: "transparent",
            p: 2,
          }}
        >
          <Grid item container alignItems="center" sx={{ mb: 2 }}>
            <Grid item flex={1}>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "20px",
                  lineHeight: "25px",
                  letterSpacing: "-0.01em",
                  color: "#010101",
                }}
              >
                Doctor Availabilities
              </Typography>
            </Grid>
            <Grid item>
              <CustomSelect
                value={select}
                onChange={handleSelectChange}
                options={days}
                name="select"
              />
            </Grid>
            {/* <Grid item>
              <CustomSelect
                value={form}
                onChange={onChange}
                options={dropDown}
                name="availability-dropdown"
              />
            </Grid> */}
          </Grid>
          {availabilities?.length > 0 ? (
            <Grid
              item
              container
              direction="column"
              overflow="hidden"
              sx={{ mt: 2 }}
              maxWidth={{ md: "100%", sm: "100%", xs: "100%" }}
            >
              <EnhancedTable
                headCells={availabilityHeadCells10}
                rows={availabilities}
                paginationLabel="Availabilities per page"
                hasCheckbox={true}
                changeLimit={async (e) => {
                  const res = await changeHospitalTableLimit(
                    fetchAvailabilities,
                    {
                      first: e,
                      providerId: partnerProviderId,
                    }
                  );

                  await setTableData(res, "Failed to change table limit.");
                }}
                dataPageInfo={pageInfo}
                handlePagination={async (page) => {
                  const res = handleHospitalPageChange(
                    fetchAvailabilities,
                    page,
                    pageInfo,
                    {
                      day: select,
                      providerId: partnerProviderId,
                      id: hcpId,
                    }
                  );
                  await setTableData(res, "Failed to change page.");
                }}
              >
                {availabilities?.map((row, index) => {
                  const { _id, day, times, doctor } = row;
                  const startTime = times && hours(times[0]?.start);
                  const endTime = times && hours(times[times.length - 1]?.stop);

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={_id}
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleCheckDay(day, doctor)}
                    >
                      {/* <TableCell
                        id={labelId}
                        scope="row"
                        align="left"
                        className={classes.tableCell}
                        style={{ color: theme.palette.common.grey }}
                      >
                        {doctorData?.dociId?.split("-")[1]}
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
                          {/* <span style={{ marginRight: "1rem" }}>
                            <Avatar
                              alt={`${doctorData?.firstName} ${doctorData?.lastName}`}
                              src={picture ? picture : displayPhoto}
                              sx={{ width: 24, height: 24 }}
                            />
                          </span> 
                          <span style={{ fontSize: "1.25rem" }}>
                            {doctorData?.firstName
                              ? `${doctorData?.firstName} ${doctorData?.lastName}`
                              : "no name"}
                          </span>
                        </div>
                      </TableCell> */}
                      <TableCell align="left" className={classes.tableCell}>
                        {day}
                      </TableCell>
                      <TableCell
                        align="left"
                        className={classes.tableCell}
                        style={{
                          color: theme.palette.common.red,
                        }}
                      >
                        <Chip
                          label={startTime ? startTime : "No Value"}
                          className={classes.badge}
                          style={{
                            background: theme.palette.common.lightRed,
                            color: theme.palette.common.red,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        align="left"
                        className={classes.tableCell}
                        style={{
                          color: theme.palette.common.red,
                        }}
                      >
                        <Chip
                          label={endTime ? endTime : "No Value"}
                          className={classes.badge}
                          style={{
                            background: theme.palette.common.lightRed,
                            color: theme.palette.common.red,
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
              headCells={availabilityHeadCells10}
              paginationLabel="Availability  per page"
            />
          )}
        </Card>
      </Grid>
      <Modals
        isOpen={modal}
        title="Doctor Availability Time"
        rowSpacing={5}
        width="10vw"
        handleClose={() => setModal(false)}
      >
        {load2 && <Loader />}
        <Grid item container alignItems="center" gap={2}>
          <Typography variant="h4">{day}</Typography>
          <div
            style={{
              background: available
                ? theme.palette.common.green
                : theme.palette.common.red,
              width: "20px",
              height: "20px",
              borderRadius: "50%",
            }}
          ></div>
        </Grid>
        <Grid item container gap={1}>
          {times
            ? times?.map((time, ind) => {
                const { start, stop } = time;
                return (
                  <Chip
                    key={ind}
                    label={`${hours(start)} - ${hours(stop)} `}
                    className={classes.badge}
                    style={{
                      background: theme.palette.common.lightRed,
                      color: theme.palette.common.red,
                    }}
                  />
                );
              })
            : "No Time"}
        </Grid>
      </Modals>
    </>
  );
  // return (
  //   <Grid container direction="column" gap={2} flexWrap="nowrap" height="100%">
  //     <Grid item>
  //       <Typography variant="h2">HCP Availability</Typography>
  //     </Grid>
  //     <Grid
  //       item
  //       container
  //       gap={3}
  //       direction="column"
  //       flexWrap="nowrap"
  //       height="100%"
  //     >
  //       {availabiltyArray.length > 0 ? (
  //         availabiltyArray.map((availability, index) => {
  //           if (availability?.times) {
  //             return (
  //               <Grid item key={index}>
  //                 <AvailabilityCard availability={availability} />
  //               </Grid>
  //             );
  //           } else {
  //             return null;
  //           }
  //         })
  //       ) : (
  //         <NoData />
  //       )}
  //     </Grid>
  //   </Grid>
  // );
};

export default HcpAvailability;
