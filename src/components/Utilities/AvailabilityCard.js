import React from "react";
import t from "prop-types";
import { Grid, Typography, Divider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { hours } from "./Time";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    background: "#fff",
    borderRadius: "2rem",
    boxShadow: "0px 0px 5px -1px rgba(0,0,0,0.1)",
  },
}));

const AvailabilityCard = ({ availability }) => {
  const classes = useStyles();
  return (
    <Grid container direction="column" className={classes.cardGrid}>
      <Grid item style={{ padding: "3rem 10rem" }}>
        <Grid container>
          <Grid item style={{ marginRight: "4rem" }}>
            <Typography variant="body1">Day: </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">{availability.day}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      <Grid item style={{ padding: "3rem 10rem" }}>
        <Grid container>
          <Grid item style={{ marginRight: "4rem" }}>
            <Typography variant="body1">Time: </Typography>
          </Grid>
          <Grid item>
            {(availability?.times || []).map((time, index) => {
              return (
                <Grid
                  container
                  direction="column"
                  gap={2}
                  key={index}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item>
                    <Grid item container gap={2}>
                      <Grid item>
                        <Typography variant="body1">{`${hours(
                          time?.start
                        )}`}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1">-</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1">
                          {`${hours(time?.stop)}`}{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider />
                </Grid>
              );
            })}
            {/* <Typography variant="body1">{time}</Typography> */}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
AvailabilityCard.propTypes = {
  availability: t.array.isRequired,
};

export default AvailabilityCard;
