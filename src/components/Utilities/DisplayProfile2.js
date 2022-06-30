import React from "react";
import displayPhoto from "assets/images/avatar.svg";
import PropTypes from "prop-types";
import { Grid, Avatar, Typography } from "@mui/material";
import { dateMoment } from "components/Utilities/Time";
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
    padding: "4rem 5rem",
    height: "14.1rem",
    boxShadow: "0px 0px 5px -1px rgba(0,0,0,0.2)",
  },
  firstContainer: {
    width: "100%",
    height: "100%",
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
const DisplayProfile2 = (props) => {
  const classes = useStyles();

  const { referralId, createdAt, status, type, patientData } = props;

  return (
    <Grid
      item
      flexWrap="nowrap"
      width="100%"
      justifyContent="space-between"
      container
      alignItems="center"
      className={`${classes.cardGrid} ${classes.firstContainer}`}
    >
      <Grid item container justifyContent="left" width="30%">
        <Grid item>
          <Avatar
            src={patientData ? patientData.image : displayPhoto}
            sx={{ minWidth: "150px", minHeight: "150px" }}
          />
        </Grid>
      </Grid>
      <Grid item container direction="column" alignItems="center" gap={3}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          flex={1}
          sx={{ height: "100%" }}
        >
          <Grid item>
            <Grid container direction="column" gap={1}>
              <Grid item>
                <Typography variant="body1" style={{ color: "#000" }}>
                  Patient Name
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h4">
                  {patientData
                    ? `${patientData.firstName} ${patientData.lastName}`
                    : "No Patient"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" gap={1}>
              <Grid item>
                <Typography variant="body1" style={{ color: "#000" }}>
                  Gender:
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h4">
                  {patientData ? patientData.gender : "No Gender "}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" gap={1}>
              <Grid item>
                <Typography variant="body1" style={{ color: "#000" }}>
                  Status:
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h4">
                  {status ? status : "Not Specified"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container width="100%">
          <Grid item sx={{ flexGrow: 1, flexBasis: 0 }}>
            <Grid container justifyContent="left" direction="column" gap={1}>
              <Grid item>
                <Typography variant="body1" style={{ color: "#000" }}>
                  Referral ID:
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h4">
                  {referralId ? referralId : "No Referral"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sx={{ flexGrow: 1, flexBasis: 0 }}>
            <Grid container direction="column" gap={1} width="100%">
              <Grid item>
                <Typography variant="body1">
                  {type === "scheduled" ? "Order Date:" : "Date"}
                </Typography>
              </Grid>
              <Grid item width="100%">
                <Typography variant="h4">
                  {createdAt ? `${dateMoment(createdAt)}` : "No Date "}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

DisplayProfile2.propTypes = {
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

export default DisplayProfile2;
