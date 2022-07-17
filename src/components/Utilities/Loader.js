import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { Grid } from "@mui/material";
import PropTypes from "prop-types";
const Loader = ({ color, size, ...rest }) => {
  return (
    <Grid
      item
      sx={{
        height: "80vh",
        overflow: "hidden",
      }}
      container
      justifyContent="center"
      alignItems="center"
    >
      <Player
        loop
        autoplay
        style={{ height: "100%", width: "100%" }}
        src="https://assets5.lottiefiles.com/private_files/lf30_f4qcnthw.json"
      />
    </Grid>
  );
};
Loader.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
};
export default Loader;
