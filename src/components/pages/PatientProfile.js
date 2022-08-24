import React, { useState, useEffect } from "react";
import { dateMoment } from "components/Utilities/Time";
import { NoData } from "components/layouts";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  Loader,
  DisplayProfileHospital,
  ProfileCard,
} from "components/Utilities";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { getProfile, verifiedEmail } from "components/graphQL/useQuery";

const useStyles = makeStyles((theme) => ({
  gridsWrapper: {
    background: "#fff",
    borderRadius: "1rem",
    padding: "1rem",
    boxShadow: "0px 0px 5px -1px rgba(0,0,0,0.2)",
  },

  badge: {
    "&.MuiChip-root": {
      fontSize: "1.3rem !important",
      //   height: "2.7rem",
      background: theme.palette.common.lightGreen,
      color: theme.palette.common.green,
      borderRadius: "1.5rem",
    },
  },

  cardGrid: {
    background: "#fff",
    borderRadius: "1rem",
    padding: "4rem 5rem",
    height: "16.1rem",
    boxShadow: "0px 0px 5px -1px rgba(0,0,0,0.2)",
  },

  linkIcon: {
    "&.MuiSvgIcon-root": {
      fontSize: "1.25rem",
      color: theme.palette.common.green,
      marginLeft: "1.2rem",
    },
  },
  link: {
    textDecoration: "none",
    color: theme.palette.common.green,
    cursor: "pointer",
  },

  buttonsGridWrapper: {
    height: "16.1rem",
  },
}));

const PatientProfile = () => {
  const { patientId } = useParams();
  const doci = localStorage.getItem("userDociId");
  const { loading, data, error } = useQuery(getProfile, {
    variables: {
      profileId: patientId,
    },
  });

  const { data: emailStatus, loading: emailLoading } = useQuery(verifiedEmail, {
    variables: {
      dociId: doci,
    },
  });

  const classes = useStyles();

  const [patientProfile, setPatientProfile] = useState("");
  const [emailStat, setEmailStat] = useState(false);

  useEffect(() => {
    if (emailStatus) {
      setEmailStat(emailStatus?.accounts?.data[0]?.isEmailVerified);
    }
  }, [emailStatus]);
  useEffect(() => {
    if (data) {
      setPatientProfile(data?.profile);
    }
  }, [data, patientId]);

  if (loading || emailLoading) return <Loader />;
  if (error) return <NoData error={error} />;
  const {
    firstName,
    lastName,
    dociId,
    status,
    gender,
    createdAt,
    provider,
    phoneNumber,
    email,
  } = patientProfile;
  return (
    <Grid container direction="column" gap={2}>
      {/* Display photo and profile name grid */}
      <Grid item>
        <DisplayProfileHospital
          fullName={`${firstName} ${lastName}`}
          medicalTitle="User ID"
          statusId={dociId?.split("-")[1]}
          status={status ? status : "No Value"}
        />
      </Grid>
      {/* PERSONAL INFO SECTION */}
      <Grid item container spacing={4} justifyContent="space-between">
        <Grid item container md={6} sm={6} xs={12}>
          <ProfileCard text="Gender" value={gender} />
        </Grid>
        <Grid item container md={6} sm={6} xs={12}>
          <ProfileCard text="Created At" value={dateMoment(createdAt)} />
        </Grid>
        <Grid item container md={6} sm={6} xs={12}>
          <ProfileCard
            text="Provider"
            value={provider ? provider : "No Provider"}
          />
        </Grid>
        <Grid item container md={6} sm={6} xs={12}>
          <ProfileCard
            text="Verified"
            value={emailStat === "false" ? "Not Verified" : "Verified"}
          />
        </Grid>
        <Grid item container md={6} sm={6} xs={12} mx="auto">
          <ProfileCard
            text="Email Address"
            value={
              email ? (
                <a href={`mailto:${email}`} className={classes.link}>
                  {email}
                </a>
              ) : (
                "No Email Provided"
              )
            }
          />
        </Grid>
        <Grid item container md={6} sm={6} xs={12}>
          <ProfileCard
            text="Phone Number"
            value={
              phoneNumber ? (
                <a href={`tel:+234${phoneNumber}`} className={classes.link}>
                  {phoneNumber}
                </a>
              ) : (
                "No Phone Number"
              )
            }
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PatientProfile;
