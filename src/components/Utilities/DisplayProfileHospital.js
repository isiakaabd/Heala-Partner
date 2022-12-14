import React from "react";
import PropTypes from "prop-types";
import { Typography, Chip, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";

const useStyles = makeStyles((theme) => ({
  gridsWrapper: {
    background: "#fff",
    borderRadius: "1rem",
    padding: "2rem",
    boxShadow: "0px 0px 5px -1px rgba(0,0,0,0.2)",
  },

  badge: {
    "&.MuiChip-root": {
      fontSize: "1.3rem !important",
      borderRadius: "1.5rem",
    },
  },
}));

const DisplayProfileHospital = ({
  fullName,
  displayPhoto,
  medicalTitle,
  statusId,
  specialization,
  status,
}) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      direction="row"
      className={classes.gridsWrapper}
      rowGap={2}
    >
      <Grid item>
        <Grid container gap={2} alignItems="center">
          <Typography variant="h3">{fullName}</Typography>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container alignItems="center" justifyContent="space-between">
          {specialization ? (
            <Grid item>
              <Typography variant="h4" style={{ fontWeight: 400 }}>
                <span style={{ color: theme.palette.common.lightGrey }}>
                  Specialization:
                </span>{" "}
                <Chip
                  label={specialization}
                  color="success"
                  className={classes.badge}
                />
              </Typography>
            </Grid>
          ) : status ? (
            <Grid item>
              <Typography variant="h4">
                <span style={{ color: theme.palette.common.lightGrey }}>
                  Status:
                </span>{" "}
                <Chip
                  label={status}
                  color={status === "Active" ? "success" : "error"}
                  className={classes.badge}
                  style={{
                    background:
                      status === "Active"
                        ? theme.palette.common.lightGreen
                        : theme.palette.common.lightRed,
                    color:
                      status === "Active"
                        ? theme.palette.common.green
                        : theme.palette.common.red,
                  }}
                />
              </Typography>
            </Grid>
          ) : null}
        </Grid>
      </Grid>
      <Grid item>
        <Typography variant="h4" color="error" style={{ fontWeight: 400 }}>
          <span style={{ color: theme.palette.common.lightGrey }}>
            {medicalTitle}:
          </span>{" "}
          {statusId}
        </Typography>
      </Grid>
    </Grid>
  );
};

DisplayProfileHospital.propTypes = {
  fullName: PropTypes.string,
  displayPhoto: PropTypes.string,
  medicalTitle: PropTypes.string,
  statusId: PropTypes.string,
  specialization: PropTypes.string,
  status: PropTypes.string,
  chatPath: PropTypes.string,
  type: PropTypes.string,
};

export default DisplayProfileHospital;
