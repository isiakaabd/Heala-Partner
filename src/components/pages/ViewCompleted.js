import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { DisplayProfile, Loader } from "components/Utilities";
import { NoData } from "components/layouts";
import { dateMoment } from "components/Utilities/Time";
import { useParams } from "react-router-dom";
import { Chip, Grid, Typography } from "@mui/material";
import { useQuery } from "@apollo/client";
import { getDrugOrder } from "components/graphQL/useQuery";

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
    border: "1px solid #bdbdbd",
    padding: ".4rem",
    maxWidth: "max-content",
    minHeight: "2rem",
    color: "#2dd39e !important",
  },
  chipLabel: {
    overflowWrap: "break-word",
    whiteSpace: "normal",
    textOverflow: "clip",
  },

  cardContainer: {
    "&.MuiGrid-root": {
      display: "grid",
      gridTemplateColumns: "repeat(2,minmax(15rem,1fr))",
      rowGap: "3rem",
      columnGap: "2rem",
      "& > *": {
        flex: 1,
        boxShadow: "0px 0px 5px -1px rgba(0,0,0,0.2)",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "14.9rem",
        background: "#fff",
      },
      "@media (max-width:600px)": {
        gridTemplateColumns: "1fr",
        "& > *": {
          minHeight: "12rem",
        },
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

const ViewCompleted = () => {
  const classes = useStyles();
  const { orderId } = useParams();

  const { data, loading, error } = useQuery(getDrugOrder, {
    variables: { id: orderId },
  });
  const [state, setState] = useState([]);

  useEffect(() => {
    if (data) return setState(data?.getDrugOrder);
  }, [data]);

  const {
    createdAt,
    affliation,
    prescriptions,
    orderId: idOrder,
    doctorData,
    patientData,
    // eslint-disable-next-line
  } = state;
  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;

  return (
    <>
      <Grid container direction="column" style={{ paddingBottom: "10rem" }}>
        {/* Display photo and profile name grid */}
        <Grid item>
          <DisplayProfile medicalTitle="User ID" patientData={patientData} />
        </Grid>
        {/* PERSONAL INFO SECTION */}
        <Grid
          item
          container
          className={classes.cardContainer}
          sx={{ paddingTop: "5rem" }}
        >
          <Grid item xs={12} md={12} container className={classes.card}>
            <Grid item>
              <Typography variant="h4">Patient Name</Typography>
            </Grid>
            <Grid item>
              <Chip
                variant="outlined"
                label={
                  patientData
                    ? `${patientData.firstName} ${patientData.lastName}`
                    : "no Value"
                }
                classes={{
                  root: classes.chipRoot,
                  label: classes.chipLabel,
                }}
              />
            </Grid>
          </Grid>
          <Grid item container className={classes.card}>
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
          <Grid item container className={classes.card}>
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
          <Grid item container className={classes.card}>
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
          <Grid item container className={classes.card}>
            <Grid item>
              <Typography variant="h4">Diagnostics</Typography>
            </Grid>
            <Grid item>
              <Chip
                variant="outlined"
                label={doctorData.firstName}
                classes={{
                  root: classes.chipRoot,
                  label: classes.chipLabel,
                }}
              />
            </Grid>
          </Grid>
          <Grid item container className={classes.card}>
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
          {prescriptions &&
            prescriptions.map((i, index) => {
              return (
                <Grid item container className={classes.card}>
                  <Grid item>
                    <Typography variant="h4">
                      {index + 1} Prescription
                    </Typography>
                  </Grid>
                  <Grid item container flexWrap="nowrap" gap={3}>
                    {/* {prescriptions && prescriptions.length > 0 ? ( */}
                    <Grid item container flexWrap="nowrap" gap={3}>
                      <ul style={{ padding: "2rem", color: "#606060" }}>
                        <Typography variant="h4" gutterBottom>
                          <li>Drugs : {i.drugName}</li>
                        </Typography>
                        <Typography variant="h4" gutterBottom>
                          <li>Dosage : {i.drugName}</li>
                        </Typography>
                        <Typography variant="h4" gutterBottom>
                          <li>Dosage Quantity: {i.dosageQuantity}</li>
                        </Typography>
                        <Typography variant="h4" gutterBottom>
                          <li>Drug Price : {i.drugPrice}</li>
                        </Typography>
                      </ul>
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}
        </Grid>
      </Grid>
    </>
  );
};

ViewCompleted.propTypes = {
  type: PropTypes.string,
};

export default ViewCompleted;
