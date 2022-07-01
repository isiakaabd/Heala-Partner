import React from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Typography, Grid } from "@mui/material";
import { CustomButton } from "components/Utilities";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const PageNotFound = () => {
  const theme = useTheme();
  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
  };
  return (
    <Grid
      container
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="calc(100vh - 150px)"
      rowGap={3}
      flexWrap="nowrap"
    >
      <Grid item>
        <ErrorOutlineIcon
          sx={{ fontSize: "10rem", color: "#3e5ea9" }}
          color={theme.palette.warning.main}
        />
      </Grid>
      <Grid item>
        <Typography textAlign="center" variant="h1" gutterBottom>
          Lost your way?
        </Typography>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Sorry, we can't find the page you are looking for.
        </Typography>
      </Grid>
      <Grid
        item
        container
        alignItems="center"
        justifyContent="center"
        xs={6}
        sm={5}
      >
        <CustomButton
          variant="contained"
          color="primary"
          width="100%"
          component={Link}
          type={buttonType}
          title="Go to Home"
          to="/"
        />
      </Grid>
    </Grid>
  );
};

export default PageNotFound;
