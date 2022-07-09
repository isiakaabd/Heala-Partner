import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { useAlert } from "hooks";
import * as Yup from "yup";
import { FormikControl } from "components/validation";
import { Formik, Form } from "formik";
import {
  DisplayProfile,
  CustomButton,
  Loader,
  Modals,
} from "components/Utilities";
import { NoData } from "components/layouts";
import { useTheme } from "@mui/material/styles";
import DisablePatient from "components/modals/DeleteOrDisable";
import { dateMoment } from "components/Utilities/Time";
import { useParams, useHistory } from "react-router-dom";
import { Chip, Grid, Typography } from "@mui/material";
import { useQuery, useMutation } from "@apollo/client";
import {
  getDrugOrder,
  getDrugOrders,
  cancelDrugOrder,
} from "components/graphQL/useQuery";
import { updateDrugOrder } from "components/graphQL/Mutation";

const useStyles = makeStyles((theme) => ({
  gridsWrapper: {
    background: "#fff",
    borderRadius: "1rem",
    minHeight: "15rem",
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
      gap: "2rem",

      "& > *": {
        flex: 1,
        boxShadow: "0px 0px 5px -1px rgba(0,0,0,0.2)",
        minHeight: "14.9rem",
        padding: "2rem",
        justifyContent: "center",
        alignItems: "center",
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

const PendingOrderProfile = () => {
  const [displayMessage] = useAlert();
  const classes = useStyles();
  const theme = useTheme();
  const { orderId } = useParams();

  const { data, loading, error } = useQuery(getDrugOrder, {
    variables: { id: orderId },
  });
  const [state, setState] = useState([]);
  const [fulfill] = useMutation(updateDrugOrder);
  useEffect(() => {
    if (data) return setState(data?.getDrugOrder);
  }, [data]);
  const onConfirm = () => setCancel(true);

  const [openDisablePatient, setOpenDisablePatient] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [openProcess, setOpenProcess] = useState(false);
  const handleDialogClose = () => setOpenProcess(false);
  const handleDialogOpen = () => setOpenProcess(true);

  const processOrder = async () => {
    try {
      await fulfill({
        variables: {
          id: orderId,
        },
        refetchQueries: [
          {
            query: getDrugOrders,
            variables: {
              status: "pending",
              partnerProviderId,
            },
          },

          {
            query: getDrugOrders,
            variables: {
              status: "processing",
              partnerProviderId,
            },
          },
        ],
      });
      displayMessage("success", "Test scheduled");

      history.push("/processing-order");
      handleDialogClose();
    } catch (error) {
      displayMessage("error", error);

      console.error(error);
    }
  };
  const [cancelTest] = useMutation(cancelDrugOrder);

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
  const history = useHistory();
  const partnerProviderId = localStorage.getItem("partnerProviderId");
  const initialValues = {
    reason: "",
  };
  const validationSchema = Yup.object({
    reason: Yup.string("Enter Reason ").trim().required("Reason is required"),
  });
  const onSubmit = async (values) => {
    const { reason } = values;
    try {
      await cancelTest({
        variables: {
          id: orderId,
          reason,
        },
        refetchQueries: [
          {
            query: getDrugOrders,
            variables: {
              status: "pending",
              partnerProviderId,
            },
          },
          {
            query: getDrugOrders,
            variables: {
              status: "processing",
              partnerProviderId,
            },
          },
          {
            query: getDrugOrders,
            variables: {
              status: "cancelled",
              partnerProviderId,
            },
          },
        ],
      });
      history.push("/cancelled-order");
      displayMessage("success", "Test cancelled");
    } catch (error) {
      displayMessage("error", error);
      console.error(error);
    }
  };
  const {
    createdAt,
    affliation,
    prescriptions,
    orderId: idOrder,
    doctorData,
    diagnostics,
    patientData,
    // eslint-disable-next-line
  } = state;

  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;

  return (
    <>
      <Grid container direction="column" rowGap={3}>
        {/* Display photo and profile name grid */}
        <Grid item>
          <DisplayProfile
            medicalTitle="User ID"
            patientData={patientData}
            chatPath={`/patients/${orderId}/profile/chat`}
          />
        </Grid>
        {/* PERSONAL INFO SECTION */}
        <Grid
          item
          container
          className={classes.cardContainer}
          gridTemplateColumns={{ sm: "repeat(2,1fr)", xs: "1fr" }}
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
              <Typography variant="h4">Date </Typography>
            </Grid>
            <Grid item>
              <Chip
                variant="outlined"
                label={dateMoment(createdAt)}
                classes={{
                  root: classes.chipRoot,
                  label: classes.chipLabel,
                }}
              />
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
              <Typography variant="h4">Order ID</Typography>
            </Grid>
            <Grid item>
              <Chip
                label={idOrder}
                variant="outlined"
                classes={{
                  root: classes.chipRoot,
                  label: classes.chipLabel,
                }}
              />
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
              <Typography variant="h4">Doctor Name</Typography>
            </Grid>
            <Grid item>
              <Chip
                label={
                  doctorData
                    ? `${doctorData.firstName} ${doctorData.lastName}`
                    : "No Value"
                }
                variant="outlined"
                classes={{
                  root: classes.chipRoot,
                  label: classes.chipLabel,
                }}
              />
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
              <Typography variant="h4">Diagnostics</Typography>
            </Grid>
            <Grid item>
              <Chip
                variant="outlined"
                label={diagnostics ? diagnostics : "No Value"}
                classes={{
                  root: classes.chipRoot,
                  label: classes.chipLabel,
                }}
              />
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
              <Typography variant="h4">Affliation</Typography>
            </Grid>
            <Grid item>
              <Chip
                variant="outlined"
                label={affliation ? affliation : "No Value"}
                classes={{
                  root: classes.chipRoot,
                  label: classes.chipLabel,
                }}
              />
            </Grid>
          </Grid>

          {prescriptions?.map((i, index) => {
            return (
              <Grid
                item
                justifyContent={{ sm: "flex-start", xs: "center" }}
                alignItems={{ sm: "flex-start", xs: "center" }}
                md={12}
                xs={12}
                key={index}
                container
                className={classes.card}
                padding={{ sm: "min(3rem,4vw)" }}
              >
                <Grid item>
                  <Typography variant="h4">{index + 1} Prescription</Typography>
                </Grid>

                <Grid item container padding={{ xs: 2 }}>
                  <ul style={{ color: "#606060" }}>
                    <Typography variant="h6">
                      <li>Drugs : {i.drugName}</li>
                    </Typography>
                    <Typography variant="h6">
                      <li>Dosage Quantity: {i.dosageQuantity}</li>
                    </Typography>
                    <Typography variant="h6">
                      <li>Drug Price : {i.drugPrice}</li>
                    </Typography>
                  </ul>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <Grid
        item
        container
        rowGap={{ sm: 8, xs: 2 }}
        justifyContent={{ sm: "space-around", xs: "center" }}
        alignItems="center"
        flexWrap="nowrap"
        className={`${classes.gridsWrapper} ${classes.buttonsGridWrapper}`}
      >
        <Grid item md={3} xs={8}>
          <CustomButton
            variant="contained"
            title="Cancel Request"
            type={trasparentButton}
            width="100%"
            textColor={theme.palette.common.black}
            onClick={() => setOpenDisablePatient(true)}
          />
        </Grid>
        <Grid item md={3} xs={8}>
          <CustomButton
            variant="contained"
            title="Process Order"
            width="100%"
            type={darkButton}
            onClick={handleDialogOpen}
          />
        </Grid>
        <DisablePatient
          open={openProcess}
          setOpen={setOpenDisablePatient}
          title="Process Order"
          btnValue="process"
          onConfirm={processOrder}
          confirmationMsg="Process Order"
        />

        <DisablePatient
          open={openDisablePatient}
          setOpen={setOpenDisablePatient}
          title="Cancel Referral"
          btnValue="cancel"
          confirmationMsg="Cancel Referral"
          onConfirm={onConfirm}
        />
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
                  <Grid item container sx={{ flexGrow: 1, marginTop: "5rem" }}>
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

export default PendingOrderProfile;
