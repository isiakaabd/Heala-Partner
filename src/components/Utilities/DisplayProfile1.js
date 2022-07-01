import React from "react";
import displayPhoto from "assets/images/avatar.svg";
import PropTypes from "prop-types";
import { Grid, Avatar, Typography } from "@mui/material";
import { dateMoment, timeMoment } from "components/Utilities/Time";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  parentGridWrapper: {
    background: "#fff",
    borderRadius: "1rem",
    boxShadow: "0px 0px 5px -1px rgba(0,0,0,0.1)",
    "&:not(:last-of-type)": {
      marginBottom: "5rem",
    },
  },
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
    boxShadow: "0px 0px 5px -1px rgba(0,0,0,0.2)",
  },

  infoBadge: {
    "&.MuiChip-root": {
      fontSize: "1.25rem",
      borderRadius: "1.5rem",
      color: theme.palette.common.green,
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

  linkIcon: {
    "&.MuiSvgIcon-root": {
      fontSize: "1.25rem",
      color: theme.palette.common.green,
      marginLeft: "1.2rem",
    },
  },

  buttonsGridWrapper: {
    marginTop: "5rem !important",
    height: "16.1rem",
  },

  title: {
    "&.MuiTypography-root": {
      color: theme.palette.common.grey,
    },
  },
}));
const DisplayProfile1 = (props) => {
  const classes = useStyles();

  const { referralId, createdAt, status, type, patientData, partnerData } =
    props;
  console.log(partnerData);
  return (
    <Grid
      item
      display="grid"
      gridTemplateColumns={{ sm: "1fr 4fr", xs: "1fr" }}
      container
      alignItems="center"
      padding={{ sm: "4rem", xs: "2rem" }}
      gap={{ sm: 3, xs: 2 }}
      className={classes.cardGrid}
    >
      <Grid item container justifyContent="center" alignItems="center">
        <Avatar
          src={patientData ? patientData.image : displayPhoto}
          sx={{ minWidth: "150px", minHeight: "150px" }}
        />
      </Grid>
      <Grid
        item
        container
        alignItems="center"
        display="grid"
        gap={{ sm: 3, xs: 2 }}
        gridTemplateColumns={{ sm: "repeat(3,1fr)", xs: "repeat(2,1fr)" }}
      >
        <Grid item container direction="column" gap={1}>
          <Grid item>
            <Typography variant="body1" style={{ color: "#3e5ea9" }}>
              Patient Name
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" style={{ fontWeight: "400" }}>
              {patientData
                ? `${patientData.firstName} ${patientData.lastName}`
                : "No Patient"}
            </Typography>
          </Grid>
        </Grid>

        <Grid item container direction="column" gap={1}>
          <Grid item>
            <Typography variant="body1" style={{ color: "#3e5ea9" }}>
              Gender:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" style={{ fontWeight: "400" }}>
              {patientData ? patientData.gender : "No Gender "}
            </Typography>
          </Grid>
        </Grid>

        <Grid item container direction="column" gap={1}>
          <Grid item>
            <Typography variant="body1" style={{ color: "#3e5ea9" }}>
              Status:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" style={{ fontWeight: "400" }}>
              {status ? status : "Not Specified"}
            </Typography>
          </Grid>
        </Grid>

        <Grid item container direction="column" gap={1}>
          <Grid item>
            <Typography variant="body1" style={{ color: "#3e5ea9" }}>
              Referral ID:
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" style={{ fontWeight: "400" }}>
              {referralId ? referralId.slice(0, 10) : "No Referral"}
            </Typography>
          </Grid>
        </Grid>

        <Grid item container direction="column" gap={1}>
          <Grid item>
            <Typography variant="body1" style={{ color: "#3e5ea9" }}>
              {type === "scheduled" ? "Order Date:" : "Date"}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" style={{ fontWeight: "400" }}>
              {createdAt ? `${dateMoment(createdAt)}` : "No Date "}
            </Typography>
          </Grid>
        </Grid>

        {type !== "pending" && (
          <Grid item container direction="column" gap={1}>
            <Grid item>
              <Typography variant="body1" style={{ color: "#3e5ea9" }}>
                Scheduled Time:
              </Typography>
            </Grid>
            <Grid item width="100%">
              <Typography variant="h4" style={{ fontWeight: "400" }}>
                {createdAt ? ` ${timeMoment(createdAt)}` : "No Date "}
              </Typography>
            </Grid>
          </Grid>
        )}
        <Grid item container direction="column" gap={1}>
          <Grid item>
            <Typography variant="body1" style={{ color: "#3e5ea9" }}>
              Provider
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" style={{ fontWeight: "400" }}>
              {partnerData ? partnerData.name : "No Provider"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

DisplayProfile1.propTypes = {
  fullName: PropTypes.string,
  type: PropTypes.string,
  displayPhoto: PropTypes.string,
  medicalTitle: PropTypes.string,
  statusId: PropTypes.number,
  specialization: PropTypes.string,
  status: PropTypes.string,
  chatPath: PropTypes.string,
  callPath: PropTypes.string,
  videoPath: PropTypes.string,
  setChatMediaActive: PropTypes.func,
};

export default DisplayProfile1;
