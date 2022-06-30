import React, { useState, useEffect } from "react";
import { Grid, Typography, Chip } from "@mui/material";
import { NoData } from "components/layouts";
import { ReactComponent as CompleteIcon } from "assets/images/complete.svg";
import { Loader, DisplayProfile1 } from "components/Utilities";
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { getDiagnosticTest } from "components/graphQL/useQuery";

const useStyles = makeStyles((theme) => ({
  gridsWrapper: {
    background: "#fff",
    borderRadius: "1rem",
    padding: "5rem",
    gap: "max(2rem, 3vw)",
    justifyContent: "center",
    flexWrap: "nowrap",
    width: "100%",
    boxShadow: "0px 0px 5px -1px rgba(0,0,0,0.2)",
  },

  cardsWrapper: {
    "&.MuiGrid-root > *": {
      flexWrap: "wrap",
    },
  },
  card: {
    "&.MuiGrid-root": {
      height: "100%",
      borderRadius: "1rem",
      flexDirection: "column",
      padding: "min(3rem,4vw)",
      gap: "1rem",
    },
  },

  chipRoot: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    wordBreak: "break-all",
    fontSize: "1.3rem !important",
    color: "#2dd39e !important",
    border: "1px solid #bdbdbd",
    padding: ".4rem",
    maxWidth: "max-content",
    minHeight: "2rem",
  },
  chipLabel: {
    overflowWrap: "break-word",
    whiteSpace: "normal",
    textOverflow: "clip",
  },

  cardContainer: {
    "&.MuiGrid-root": {
      display: "grid",
      gap: "3rem",
      "& > *": {
        flex: 1,
        boxShadow: "0px 0px 5px -1px rgba(0,0,0,0.2)",
        minHeight: "14.9rem",
        // justifyContent: "center",
        background: "#fff",
      },
    },
  },
  buttonsGridWrapper: {
    marginTop: "5rem !important",
  },

  title: {
    "&.MuiTypography-root": {
      color: theme.palette.common.grey,
    },
  },

  link: {
    display: "flex",
    alignItems: "center",
    fontSize: "1.25rem",
    color: theme.palette.common.green,
    border: `1px solid ${theme.palette.common.lightGrey}`,
    padding: ".75rem",
    borderRadius: "1.5rem",
    textDecoration: "none",
  },

  notLink: {
    border: "none",
    justifyContent: "center",
    fontSize: "1rem",
    maxWidth: "7.2rem !important",
    padding: ".75rem 0",
  },
}));

const ViewResult = () => {
  const classes = useStyles();
  const { completeId } = useParams();
  const [scheduleState, setScheduleState] = useState([]);

  const { loading, error, data } = useQuery(getDiagnosticTest, {
    variables: {
      id: completeId,
    },
  });

  useEffect(() => {
    if (data) {
      setScheduleState(data?.getDiagnosticTest);
    }
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;
  const {
    createdAt,
    sampleCollection,
    referralId,
    reason,
    userLocation,
    status,
    doctor,
    testId,
    affiliation,
    testResults,
    testOption,
    doctorData,
    patientData,
    tests,
    // eslint-disable-next-line
  } = scheduleState;

  return (
    <>
      <Grid container direction="column" style={{ paddingBottom: "2rem" }}>
        {/* Display photo and profile name grid */}

        <DisplayProfile1
          createdAt={createdAt}
          sampleCollection={sampleCollection}
          referralId={referralId}
          reason={reason}
          status={status}
          doctor={doctor}
          affiliation={affiliation}
          testOption={testOption}
          doctorData={doctorData}
          patientData={patientData}
          type="scheduled"
        />
        <Grid
          item
          container
          className={classes.cardContainer}
          gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
          sx={{ paddingTop: "5rem" }}
        >
          <Grid
            item
            xs={12}
            md={12}
            container
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            padding={{ sm: "min(3rem,4vw)" }}
            className={classes.card}
          >
            <Grid item>
              <Typography variant="body1">
                {tests && tests.length > 1 ? "Tests" : "Test"}
              </Typography>
            </Grid>
            <Grid
              item
              container
              justifyContent={{ sm: "flex-start", xs: "center" }}
              alignItems={{ sm: "flex-start", xs: "center" }}
              gap={2}
            >
              {tests && tests.length > 0 ? (
                tests.map((i) => {
                  return (
                    <Grid item>
                      <Chip
                        variant="outlined"
                        label={i.name}
                        classes={{
                          root: classes.chipRoot,
                          label: classes.chipLabel,
                        }}
                      />
                    </Grid>
                  );
                })
              ) : (
                <Grid item>
                  <Chip
                    variant="outlined"
                    label={"No Test yet"}
                    classes={{
                      root: classes.chipRoot,
                      label: classes.chipLabel,
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid
            item
            md={12}
            xs={12}
            container
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            padding={{ sm: "min(3rem,4vw)" }}
            className={classes.card}
          >
            <Grid item>
              <Typography variant="body1">Test ID </Typography>
            </Grid>
            <Grid item>
              <Chip
                variant="outlined"
                label={testId ? testId : "No Value"}
                classes={{ root: classes.chipRoot, label: classes.chipLabel }}
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            md={12}
            xs={12}
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            padding={{ sm: "min(3rem,4vw)" }}
            className={classes.card}
          >
            <Grid item>
              <Typography variant="body1">Doctor Name</Typography>
            </Grid>
            <Grid item>
              <Chip
                variant="outlined"
                label={
                  doctorData
                    ? `${doctorData.firstName} ${doctorData.lastName}`
                    : "No Doctor"
                }
                classes={{ root: classes.chipRoot, label: classes.chipLabel }}
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            md={12}
            xs={12}
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            padding={{ sm: "min(3rem,4vw)" }}
            className={classes.card}
          >
            <Grid item>
              <Typography variant="body1">Affliation</Typography>
            </Grid>
            <Grid item>
              <Chip
                variant="outlined"
                label={affiliation ? affiliation : "No Affliation"}
                classes={{ root: classes.chipRoot, label: classes.chipLabel }}
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            md={12}
            xs={12}
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            padding={{ sm: "min(3rem,4vw)" }}
            className={classes.card}
          >
            <Grid item>
              <Typography variant="body1">Test Option</Typography>
            </Grid>
            <Grid item>
              <Chip
                variant="outlined"
                label={sampleCollection ? sampleCollection : "No Value"}
                classes={{ root: classes.chipRoot, label: classes.chipLabel }}
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            md={12}
            xs={12}
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            padding={{ sm: "min(3rem,4vw)" }}
            className={classes.card}
          >
            <Grid item>
              <Typography variant="body1">Test Collection Details</Typography>
            </Grid>
            {userLocation ? (
              <Grid
                item
                container
                justifyContent={{ sm: "flex-start", xs: "center" }}
                alignItems={{ sm: "flex-start", xs: "center" }}
                gap={2}
              >
                <Grid item>
                  <Chip
                    variant="outlined"
                    label={userLocation.address}
                    classes={{
                      root: classes.chipRoot,
                      label: classes.chipLabel,
                    }}
                  />
                </Grid>
                <Grid item>
                  <Chip
                    variant="outlined"
                    label={userLocation.city}
                    classes={{
                      root: classes.chipRoot,
                      label: classes.chipLabel,
                    }}
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid item>
                <Chip
                  variant="outlined"
                  label="No Collection Details"
                  classes={{ root: classes.chipRoot, label: classes.chipLabel }}
                />
              </Grid>
            )}
          </Grid>
          <Grid
            item
            container
            md={12}
            xs={12}
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            padding={{ sm: "min(3rem,4vw)" }}
            className={classes.card}
          >
            <Grid item>
              <Typography variant="body1">Reason For Referral</Typography>
            </Grid>
            <Grid item>
              <Chip
                variant="outlined"
                label={reason ? reason : "No Reason"}
                classes={{ root: classes.chipRoot, label: classes.chipLabel }}
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            md={12}
            xs={12}
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            padding={{ sm: "min(3rem,4vw)" }}
            className={classes.card}
          >
            <Grid item>
              <Typography variant="body1">Test Result</Typography>
            </Grid>
            <Grid
              item
              container
              justifyContent={{ sm: "flex-start", xs: "center" }}
              alignItems={{ sm: "flex-start", xs: "center" }}
              gap={2}
            >
              {testResults ? (
                testResults?.map((item, index) => {
                  return (
                    <Grid item key={index}>
                      <Grid container direction="column">
                        <Grid item className={classes.container}>
                          <a href={item?.file} rel="noreferrer" target="_blank">
                            <CompleteIcon />
                          </a>
                        </Grid>
                        <Grid
                          item
                          className={`${classes.link} ${classes.notLink}`}
                        >
                          {item?.title}
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })
              ) : (
                <Grid item className={classes.link}>
                  no test result yet
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ViewResult;
