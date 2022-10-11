import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { NoData } from "components/layouts";
import { Loader } from "components/Utilities";
import { defaultPageInfo } from "helpers/mockData";
import { getEnrolles } from "components/graphQL/useQuery";
import { hmoDashboard } from "components/graphQL/useQuery";
import HmoEnrolleesTable from "components/tables/HmoEnrolleesTable";
import HmoDashboardChart from "components/layouts/HmoDashboardChart";
import { useLazyQuery, /* useMutation, */ useQuery } from "@apollo/client";

const HmoDashboard = () => {
  const [hmoEnrollees, setHmoEnrollees] = useState([]);
  const providerId = localStorage.getItem("partnerProviderId");
  const [pageInfo, setPageInfo] = useState(defaultPageInfo);
  const { data, error, loading } = useQuery(hmoDashboard, {
    variables: {
      providerId: providerId,
    },
  });

  const [
    fetchEnrollees,
    {
      error: enrolleeError,
      loading: enrolleeLoading,
      refetch,
      variables,
      networkStatus,
    },
  ] = useLazyQuery(getEnrolles, {
    notifyOnNetworkStatusChange: true,
  });

  const enrolleesParams = {
    hmoEnrollees,
    setHmoEnrollees,
    pageInfo,
    setPageInfo,
    fetchEnrollees,
    error: enrolleeError,
    loading: enrolleeLoading,
    refetch,
    variables,
    networkStatus,
  };

  const fetchData = (fetch) => {
    fetch({
      variables: {
        providerId: providerId,
        first: 10,
      },
    })
      .then(({ data }) => {
        setHmoEnrollees(data?.getEnrollees?.data || []);
        setPageInfo(data?.getEnrollees?.pageInfo || {});
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  };

  useEffect(() => {
    fetchData(fetchEnrollees);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchEnrollees, providerId]);

  if (loading) return <Loader />;
  if (error) return <NoData error={error} />;

  return (
    <Grid container direction="column" rowGap={3}>
      <HmoDashboardChart data={data?.getStats} />
      <HmoEnrolleesTable showHeader={true} enrolleesParams={enrolleesParams} />
    </Grid>
  );
};

export default HmoDashboard;
