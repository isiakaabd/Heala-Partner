import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { NoData } from "components/layouts";
import { useLazyQuery } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import { CustomButton } from "components/Utilities";
import MainModal from "components/modals/MainModal";
import { getHmoPlans } from "components/graphQL/useQuery";
import HMOPlansTable from "components/tables/HMOPlansTable";
import CreateEditHMOPlans from "components/Forms/CreateEditHMOPlans";

const HmoPlans = () => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const providerId = localStorage.getItem("partnerProviderId");
  const [fetchHmoPlans, { loading, data, error, refetch, variables }] =
    useLazyQuery(getHmoPlans, {
      notifyOnNetworkStatusChange: true,
      variables: { id: providerId },
    });

  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
  };

  const initialValues = {
    name: "",
    planId: "",
  };

  useEffect(() => {
    fetchHmoPlans({ notifyOnNetworkStatusChange: true });
  }, [fetchHmoPlans]);

  if (error) return <NoData error={error} />;
  return (
    <>
      <Grid
        container
        direction="column"
        flexWrap="nowrap"
        gap={2}
        height="100%"
      >
        <Grid
          item
          direction={{ sm: "row", xs: "column" }}
          container
          justifyContent="flex-end"
          gap={{ md: 4, sm: 4, xs: 2 }}
        >
          <Grid item>
            <CustomButton
              endIcon={<AddIcon />}
              title="Create new plan"
              type={buttonType}
              onClick={() => setIsOpen(true)}
            />
          </Grid>
        </Grid>
        <HMOPlansTable
          PlansQuery={{
            fetchHmoPlans,
            loading,
            data,
            refetch,
            variables,
            newVariables: {},
          }}
        />
      </Grid>

      {/* CREATE PLAN MODAL */}
      <MainModal
        isOpen={isOpen}
        headerText="Create new plan"
        rowSpacing={5}
        setIsOpen={() => setIsOpen(false)}
      >
        <CreateEditHMOPlans
          initialValues={initialValues}
          type="add"
          onSuccess={() => {
            setIsOpen(false);
            refetch();
          }}
        />
      </MainModal>
    </>
  );
};

export default HmoPlans;
