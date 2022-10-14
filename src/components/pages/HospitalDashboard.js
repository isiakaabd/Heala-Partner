import React from "react";
import { Grid } from "@mui/material";
import {
  HospitalDashboardChart,
  NoData,
  AvailabilityTable,
} from "components/layouts";

import { useQuery } from "@apollo/client";
import { dashboard } from "components/graphQL/useQuery";
import { Loader } from "components/Utilities";

const HospitalDashboard = () => {
  const { data, error, loading } = useQuery(dashboard, {
    variables: {
      providerId: localStorage.getItem("partnerProviderId"),
    },
  });

  console.log(data);

  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;

  return (
    <Grid container direction="column" rowGap={3}>
      <HospitalDashboardChart data={data?.getStats} />
      <AvailabilityTable />
    </Grid>
  );
};

export default HospitalDashboard;
