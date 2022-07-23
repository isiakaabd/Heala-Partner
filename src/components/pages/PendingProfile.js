import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { NoData } from "components/layouts";
import { FormikControl } from "components/validation";
import { Formik, Form } from "formik";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import { DeleteOrDisable } from "components/modals";
import { time } from "components/Utilities/Time";
import { useQuery, useMutation } from "@apollo/client";
import { useParams, useHistory } from "react-router-dom";
import {
  getDiagnosticTest,
  getDiagnosticTests,
} from "components/graphQL/useQuery";
import {
  cancelDiagnosticTest,
  scheduleDiagnosticTest,
} from "components/graphQL/Mutation";
import { useAlert } from "components/hooks";
import { Typography, Grid, Chip } from "@mui/material";
import {
  DisplayProfile1,
  CustomButton,
  Loader,
  Modals,
} from "components/Utilities";

const useStyles = makeStyles((theme) => ({
  gridsWrapper: {
    background: "#fff",
    borderRadius: "1rem",
    minHeight: "15rem",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
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

      gap: "1rem",
    },
  },

  chipRoot: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    wordBreak: "break-all",
    fontSize: "clamp(1.2rem, 3vw, 1.3rem) ",
    color: theme.palette.common.green,
    border: "1px solid #bdbdbd",
    padding: ".4rem",
    maxWidth: "max-content",
    minHeight: "2rem",
  },
  chipLabel: {
    overflowWrap: "break-word",
    whiteSpace: "nowrap",
    textOverflow: "clip",
  },

  cardContainer: {
    "&.MuiGrid-root": {
      display: "grid",
      gap: "2rem",

      "& > *": {
        flex: 1,
        boxShadow: "0px 0px 5px -1px rgba(0,0,0,0.2)",
        minHeight: "14.9rem",
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
}));

const PendingProfile = () => {
  const { displayMessage } = useAlert();
  const initialValues = {
    reason: "",
  };
  const partnerProviderId = localStorage.getItem("partnerProviderId");
  const validationSchema = Yup.object({
    reason: Yup.string("Enter Reason").trim().required("Reason is required"),
  });
  const [scheduleReferrals] = useMutation(scheduleDiagnosticTest);
  const [cancel, setCancel] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
    disabled: theme.palette.common.black,
  };

  const { requestId } = useParams();
  const [cancelTest] = useMutation(cancelDiagnosticTest);
  const onSubmit = async (values) => {
    const { reason } = values;
    try {
      await cancelTest({
        variables: {
          id: requestId,
          reason,
        },
        refetchQueries: [
          {
            query: getDiagnosticTests,
            variables: {
              status: "pending",
              partnerProviderId,
            },
          },
          {
            query: getDiagnosticTests,
            variables: {
              status: "cancelled",
              partnerProviderId,
            },
          },
        ],
      });
      history.push("/cancelled");
      displayMessage("success", "Test cancelled successfully");
    } catch (error) {
      displayMessage("error", error);
      console.error(error);
    }
  };

  const onConfirm = () => setCancel(true);

  const { data, loading, error } = useQuery(getDiagnosticTest, {
    variables: { id: requestId },
  });

  useEffect(() => {
    if (data) return setPendingProfile(data?.getDiagnosticTest);
  }, [data]);

  // <NotistackAlert variant="success" message="order has been scheduled" />;
  const onSubmit1 = async (values) => {
    const { date } = values;
    const timeValue = time(date);
    try {
      await scheduleReferrals({
        variables: { id: requestId, time: timeValue },
        refetchQueries: [
          {
            query: getDiagnosticTests,
            variables: {
              status: "pending",
              partnerProviderId,
            },
          },
          {
            query: getDiagnosticTests,
            variables: {
              status: "scheduled",
              partnerProviderId,
            },
          },
        ],
      });
      displayMessage("success", "Test scheduled successfully");
      history.push("/schedule");
    } catch (error) {
      displayMessage("error", error);
      console.error(error);
    }
    handlePatientCloses();
  };
  const initialValues1 = {
    date: "",
  };
  const validationSchema1 = Yup.object({
    date: Yup.string("select date and time ").required(
      "Date  and time is required"
    ),
  });
  const [openDisablePatient, setOpenDisablePatient] = useState(false);
  const [isPatients, setIsPatients] = useState(false);
  const handleDialogOpen = () => setIsPatients(true);
  const [pendingProfile, setPendingProfile] = useState([]);

  const {
    createdAt,
    gender,
    sampleCollection,
    referralId,
    reason,
    testId,
    userLocation,
    status,
    doctor,
    tests,
    affiliation,
    testOption,
    doctorData,
    patientData,
    partnerData,
    // eslint-disable-next-line
  } = pendingProfile;

  const darkButton = {
    background: theme.palette.primary.main,
    hover: theme.palette.primary.light,
    active: theme.palette.primary.dark,
  };

  const trasparentButton = {
    background: "transparent",
    hover: "#fafafa",
    active: "#f4f4f4",
  };

  const handlePatientCloses = () => setIsPatients(false);

  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;
  return (
    <>
      <Grid container direction="column" style={{ paddingBottom: "5rem" }}>
        <DisplayProfile1
          createdAt={createdAt}
          gender={gender}
          sampleCollection={sampleCollection}
          referralId={referralId}
          reason={reason}
          status={status}
          doctor={doctor}
          affiliation={affiliation}
          testOption={testOption}
          doctorData={doctorData}
          patientData={patientData}
          partnerData={partnerData}
          type="pending"
        />
        <Grid
          item
          container
          gridTemplateColumns={{ sm: "repeat(2,1fr)", xs: "repeat(1,1fr)" }}
          className={classes.cardContainer}
          sx={{ paddingTop: "5rem" }}
        >
          <Grid
            item
            xs={12}
            md={12}
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            padding={{ sm: "min(3rem,4vw)" }}
            container
            className={classes.card}
          >
            <Grid item>
              <Typography variant="body1">
                {tests && tests.length > 1 ? "Tests" : "Test"}
              </Typography>
            </Grid>
            <Grid
              item
              justifyContent={{ sm: "flex-start", xs: "center" }}
              alignItems={{ sm: "flex-start", xs: "center" }}
              container
              gap={2}
              className={classes.cardsWrapper}
            >
              {/* <Grid item>asdcbkjsadbasjkb</Grid> */}

              {tests?.length > 0 ? (
                tests?.map((i, index) => {
                  return (
                    <Grid item key={index}>
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
                    label="No Test yet"
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
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            md={12}
            xs={12}
            container
            className={classes.card}
            padding={{ sm: "min(3rem,4vw)" }}
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
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            container
            md={12}
            xs={12}
            className={classes.card}
            padding={{ sm: "min(3rem,4vw)" }}
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
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            container
            md={12}
            xs={12}
            className={classes.card}
            padding={{ sm: "min(3rem,4vw)" }}
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
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            container
            md={12}
            xs={12}
            className={classes.card}
            padding={{ sm: "min(3rem,4vw)" }}
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
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            container
            md={12}
            xs={12}
            className={classes.card}
            padding={{ sm: "min(3rem,4vw)" }}
          >
            <Grid item>
              <Typography variant="body1">Test Collection Details</Typography>
            </Grid>
            {userLocation ? (
              <Grid
                item
                container
                gap={2}
                justifyContent={{ sm: "flex-start", xs: "center" }}
                alignItems={{ sm: "flex-start", xs: "center" }}
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
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            item
            padding={{ sm: "min(3rem,4vw)" }}
            container
            md={12}
            xs={12}
            className={classes.card}
          >
            <Grid item>
              <Typography variant="body1">Reason For Referral</Typography>
            </Grid>
            <Grid item>
              <Chip
                variant="outlined"
                label={reason ? reason : "No Reason"}
                sx={{ whiteSpace: "nowrap !important" }}
                classes={{ root: classes.chipRoot, label: classes.chipLabel }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          container
          gap={{ sm: 5, xs: 2 }}
          // direction={{ sm: "row", md: "row", xs: "column" }}
          className={`${classes.gridsWrapper} ${classes.buttonsGridWrapper}`}
        >
          <Grid item columns={{ md: 3, xs: 10 }}>
            <CustomButton
              variant="contained"
              title="Cancel"
              type={trasparentButton}
              width="100%"
              textColor={theme.palette.common.black}
              onClick={() => setOpenDisablePatient(true)}
            />
          </Grid>
          <Grid item columns={{ md: 3, xs: 10 }}>
            <CustomButton
              variant="contained"
              title="Schedule Test"
              width="100%"
              type={darkButton}
              onClick={handleDialogOpen}
            />
          </Grid>

          <DeleteOrDisable
            open={openDisablePatient}
            setOpen={setOpenDisablePatient}
            title="Cancel Test"
            btnValue="cancel"
            confirmationMsg="Cancel Test"
            onConfirm={onConfirm}
          />

          <Modals
            isOpen={isPatients}
            title="Schedule Test"
            rowSpacing={5}
            height="auto"
            width={{ sm: "40vw", xs: "90vw" }}
            handleClose={handlePatientCloses}
          >
            <Formik
              initialValues={initialValues1}
              onSubmit={onSubmit1}
              validationSchema={validationSchema1}
              validateOnChange={false}
              validateOnMount={false}
            >
              {({ isSubmitting, dirty, isValid, setFieldValue }) => {
                return (
                  <Form style={{ marginTop: "3rem" }}>
                    <Grid container rowGap={3}>
                      <Grid item container>
                        <FormikControl
                          control="time"
                          name="date"
                          label="Date"
                          placeholder="Choose Date and Time"
                          setFieldValue={setFieldValue}
                        />
                      </Grid>
                      <Grid item container>
                        <CustomButton
                          title="Schedule Test"
                          width="100%"
                          type={buttonType}
                          isSubmitting={isSubmitting}
                          disabled={!(dirty || isValid)}
                        />
                      </Grid>
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          </Modals>
        </Grid>
      </Grid>
      <Modals
        isOpen={cancel}
        title="Cancel Test"
        rowSpacing={5}
        handleClose={() => setCancel(false)}
      >
        <Formik
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnMount={false}
          initialValues={initialValues}
          enableReinitialize
        >
          {({ isSubmitting, dirty, isValid }) => {
            return (
              <Form style={{ marginTop: "3rem" }}>
                <Grid container>
                  <Grid item container>
                    <FormikControl
                      control="input"
                      label="State a Reason"
                      name="reason"
                      placeholder="Enter reason"
                    />
                  </Grid>
                  <Grid item container sx={{ flexGrow: 1, marginTop: "10rem" }}>
                    <CustomButton
                      title="Cancel Test"
                      type={darkButton}
                      width="100%"
                      isSubmitting={isSubmitting}
                      disabled={!(dirty || isValid)}
                    />
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Modals>
    </>
  );
};

export default PendingProfile;
