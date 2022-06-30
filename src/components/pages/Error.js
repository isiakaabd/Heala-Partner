import React from "react";
import { Typography, Grid } from "@mui/material";
import logo from "assets/images/logo.svg";
const Error = ({ error }) => {
  console.log(error);
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      flexDirection={"column"}
      flexWrap="nowrap"
      sx={{ height: "100vh" }}
      padding={{ sm: 6, xs: 3 }}
    >
      <Grid item>
        <img
          src={logo}
          alt="logo"
          sx={{
            marginBottom: "auto",
            display: "inline-block",
            height: "5rem",
          }}
        />
      </Grid>
      <Grid
        item
        container
        flex={1}
        justifyContent={"center"}
        alignItems="center"
        flexDirection={"column"}
      >
        <Typography variant="h1" color="#3e5ea9" gutterBottom>
          Oops..!!!
        </Typography>
        <Typography variant="h4">Something Went Wrong...</Typography>
      </Grid>
    </Grid>
  );
};

export default Error;
