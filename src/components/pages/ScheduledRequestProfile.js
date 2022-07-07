import React, { useState, useEffect } from "react";
import {
  Modals,
  Loader,
  CustomButton,
  DisplayProfile1,
} from "components/Utilities";
import { useAlert } from "hooks";
import * as Yup from "yup";
import { FormikControl } from "components/validation";
import { Formik, Form } from "formik";
import { Grid, Typography, Chip, Avatar } from "@mui/material";
import { NoData } from "components/layouts";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import { DeleteOrDisable } from "components/modals";
import { useParams, useHistory } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  getDiagnosticTest,
  getDiagnosticTests,
} from "components/graphQL/useQuery";
import {
  cancelDiagnosticTest,
  completeDiagnosticTest,
} from "components/graphQL/Mutation";

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
    color: theme.palette.common.green,
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
        // justifyContent: "center",
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

const ScheduledRequestProfile = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [displayMessage] = useAlert();
  const history = useHistory();

  const { scheduleId } = useParams();
  const onConfirm = () => setCancel(true);
  const [scheduleState, setScheduleState] = useState([]);

  const { loading, error, data } = useQuery(getDiagnosticTest, {
    variables: {
      id: scheduleId,
    },
  });
  const [value, setValue] = useState({
    val: [],
  });

  const handleClick = (values, setFieldValue) => {
    const { title, image } = values;
    if (title !== "" && image !== null) {
      const newValue = {
        title,
        file: image,
      };

      setValue((prevState) => ({
        val: [...prevState.val, newValue],
      }));
      setFieldValue("image", "");
      setFieldValue("title", "");
    }
  };

  const handleDelete = (index) => {
    const z = value.val.filter((_, ind) => index !== ind);

    setValue({
      val: z,
    });
  };
  useEffect(() => {
    if (data) {
      setScheduleState(data.getDiagnosticTest);
    }
  }, [data]);

  const [openDisablePatient, setOpenDisablePatient] = useState(false);
  const [modal, setModal] = useState(false);
  const [cancel, setCancel] = useState(false);
  const handleDialogClose = () => setModal(false);
  const handleDialogOpen = () => setModal(true);

  const initialValues = {
    reason: "",
  };
  const validationSchema = Yup.object({
    reason: Yup.string("Enter Reason ").trim().required("Reason is required"),
  });
  const partnerProviderId = localStorage.getItem("partnerProviderId");
  const [cancelTest] = useMutation(cancelDiagnosticTest);
  const onSubmit = async (values) => {
    const { reason } = values;
    try {
      await cancelTest({
        variables: {
          id: scheduleId,
          reason,
        },
        refetchQueries: [
          {
            query: getDiagnosticTests,
            variables: {
              status: "scheduled",
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

  const darkButton = {
    background: theme.palette.primary.main,
    hover: theme.palette.primary.light,
    active: theme.palette.primary.dark,
    disabled: "#868686",
  };

  const trasparentButton = {
    background: "transparent",
    hover: "#fafafa",
    active: "#f4f4f4",
  };
  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
    disabled: "#868686",
  };

  const initialValues1 = {
    title: "",
    image: null,
  };
  const validationSchema1 = Yup.object({
    title: Yup.string("select date and time ").trim(),

    image: Yup.string("Upload a single Image"),
  });
  const [completeTest] = useMutation(completeDiagnosticTest);
  const onSubmit1 = async () => {
    try {
      await completeTest({
        variables: {
          id: scheduleId,
          testResults: [...value.val],
        },
        refetchQueries: [
          {
            query: getDiagnosticTests,
            variables: {
              status: "scheduled",
              partnerProviderId,

            },
          },
          {
            query: getDiagnosticTests,
            variables: {
              status: "completed",
              partnerProviderId,

            },
          },
        ],
      });

      displayMessage("success", "Test completed successfully");
      history.push("/completed");
      handleDialogClose();
    } catch (error) {
      displayMessage("error", error);
      console.error(error);
    }
  };

  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;
  const {
    createdAt,
    gender,
    sampleCollection,
    referralId,
    reason,
    userLocation,
    status,
    doctor,
    tests,
    testId,
    affiliation,
    testOption,
    scheduledAt,
    doctorData,
    patient,
    patientData,
    partnerData,
    // eslint-disable-next-line
  } = scheduleState;

  return (
    <>
      <Grid container direction="column" style={{ paddingBottom: "2rem" }}>
        {/* Display photo and profile name grid */}

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
          patient={patient}
          patientData={patientData}
          doctorData={doctorData}
          partnerData={partnerData}
          scheduledAt={scheduledAt}
          type="scheduled"
        />
        <Grid
          item
          container
          className={classes.cardContainer}
          gridTemplateColumns={{ sm: "repeat(2,1fr)", xs: "1fr" }}
          sx={{ paddingTop: "5rem" }}
        >
          <Grid
            item
            xs={12}
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            padding={{ sm: "min(3rem,4vw)" }}
            md={12}
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
              container
              justifyContent={{ sm: "flex-start", xs: "center" }}
              alignItems={{ sm: "flex-start", xs: "center" }}
              gap={2}
              className={classes.cardsWrapper}
            >
              {tests && tests.length > 0 ? (
                tests.map((i, index) => {
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
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            padding={{ sm: "min(3rem,4vw)" }}
            xs={12}
            container
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
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            padding={{ sm: "min(3rem,4vw)" }}
            md={12}
            xs={12}
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
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            padding={{ sm: "min(3rem,4vw)" }}
            md={12}
            xs={12}
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
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            padding={{ sm: "min(3rem,4vw)" }}
            md={12}
            xs={12}
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
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            padding={{ sm: "min(3rem,4vw)" }}
            md={12}
            xs={12}
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
            justifyContent={{ sm: "flex-start", xs: "center" }}
            alignItems={{ sm: "flex-start", xs: "center" }}
            padding={{ sm: "min(3rem,4vw)" }}
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
                classes={{ root: classes.chipRoot, label: classes.chipLabel }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          container
          gap={{ sm: 5, xs: 2 }}
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
          <Grid item columns={{ md: 3, xs: 12 }}>
            <CustomButton
              variant="contained"
              title="Complete Test"
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
            isOpen={modal}
            title="Complete Test"
            rowSpacing={5}
            handleClose={handleDialogClose}
          >
            <Formik
              initialValues={initialValues1}
              onSubmit={onSubmit1}
              validationSchema={validationSchema1}
              validateOnChange={false}
              validateOnMount={false}
            >
              {({ isSubmitting, dirty, isValid, values, setFieldValue }) => {
                return (
                  <Form style={{ marginTop: "3rem" }}>
                    <Grid item container direction="column" rowGap={3}>
                      <Grid item container>
                        <FormikControl
                          control="input"
                          name="title"
                          label="Title"
                          placeholder="Enter Title"
                        />
                      </Grid>

                      <Grid item container>
                        <FormikControl
                          control="file"
                          name="image"
                          value={values.image}
                          label="Upload Your File"
                          setFieldValue={setFieldValue}
                        />
                      </Grid>

                      {value.val.length > 0 ? (
                        <Grid item container gap={1} marginTop={2}>
                          {value.val.map((item, index) => {
                            return (
                              <Chip
                                avatar={
                                  <Avatar alt={item.title} src={item.file} />
                                }
                                onDelete={() => handleDelete(index)}
                                label={item.title}
                                variant="outlined"
                              />
                            );
                          })}
                        </Grid>
                      ) : null}
                      <Grid
                        item
                        container
                        gap={3}
                        justifyContent="space-between"
                        flexWrap="nowrap"
                      >
                        <CustomButton
                          variant="contained"
                          title={
                            value.val.length <= 0 ? "Add Result" : "Upload More"
                          }
                          type={buttonType}
                          complete
                          width="50%"
                          onClick={() => handleClick(values, setFieldValue)}
                        />

                        <CustomButton
                          title="Complete Test"
                          width="50%"
                          type={buttonType}
                          isSubmitting={isSubmitting}
                          sx={{ whiteSpace: "nowrap" }}
                          disabled={
                            !(dirty || isValid) || value.val.length <= 0
                          }
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
      <DeleteOrDisable
        open={openDisablePatient}
        setOpen={setOpenDisablePatient}
        title="Cancel Test"
        btnValue="cancel"
        confirmationMsg="Cancel Test"
        onConfirm={onConfirm}
      />
    </>
  );
};

export default ScheduledRequestProfile;
