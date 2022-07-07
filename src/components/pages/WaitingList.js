import React from "react";
import { Grid, Typography } from "@mui/material";
import WaitingListTable from "components/layouts/WaitingListTable";

const WaitingList = () => {
  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h2">Waiting List</Typography>
      </Grid>
      <Grid item style={{ marginTop: "5rem" }}>
        <WaitingListTable path="/appointments/waiting-list" />
      </Grid>
    </Grid>
  );
};

export default WaitingList;
