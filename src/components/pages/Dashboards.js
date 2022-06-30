import React from "react";
import { Grid } from "@mui/material";
import { DashCharts } from "components/layouts";

const Dashboards = () => {
  return (
    <Grid container direction="column">
      <DashCharts />
    </Grid>
  );
};

export default Dashboards;
