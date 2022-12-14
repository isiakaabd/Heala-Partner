import React from "react";
import { Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";
const NoData = ({ error }) => {
  return (
    <Grid
      container
      alignItems="center"
      flexDirection="column"
      height="30vh"
      justifyContent="center"
    >
      <Grid item>
        {error ? (
          <Typography variant="h3" textAlign="center">
            Something went Wrong...
          </Typography>
        ) : null}
      </Grid>
      {!error && (
        <Grid item>
          <Typography variant="h5">No Data Yet</Typography>
        </Grid>
      )}
      <Grid item>
        <Typography variant="body2">
          {!error
            ? "we have not computed data for this table yet"
            : "pls refresh page"}
        </Typography>
      </Grid>
    </Grid>
  );
};
NoData.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
export default NoData;
