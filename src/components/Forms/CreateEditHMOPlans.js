import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import t from "prop-types";
import { Formik, Form } from "formik";
import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { pickHmoPlans } from "helpers/func";
import { useAlert } from "components/hooks";
import { CustomButton } from "components/Utilities";
import { FormikControl } from "components/validation";
import { useLazyQuery, useMutation } from "@apollo/client";
import { addEditDelHMOPlans } from "components/graphQL/Mutation";
import { getHmoPlans, getPlans } from "components/graphQL/useQuery";

const addEditPlansValidationSchema = Yup.object({
  name: Yup.string("Enter your Name").trim().required("Name is required"),
  planId: Yup.string("Select access plan")
    .trim()
    .required("Access plan is required"),
});

const CreateEditHMOPlans = ({ type, initialValues, onSuccess }) => {
  const theme = useTheme();
  const { displayAlert, getErrorMsg } = useAlert();
  const [fetchPlans] = useLazyQuery(getPlans);
  const [hmoPlans, setHmoPlans] = useState([]);
  const [fetchHmoPlans] = useLazyQuery(getHmoPlans);
  const [planOptions, setPlanOptions] = useState([]);
  const providerId = localStorage.getItem("partnerProviderId");
  const [createEditHmoPlans] = useMutation(addEditDelHMOPlans);

  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
  };

  const onAddSubmit = async (values) => {
    try {
      const { id, name, planId } = values;
      const newPlan = { name, planId };
      const pickedOldPlans = pickHmoPlans(hmoPlans, ["name", "planId"]);
      const variables = {
        id,
        plans: [newPlan, ...pickedOldPlans],
      };
      const { data } = await createEditHmoPlans({ variables: variables });
      if (data) {
        displayAlert("success", "Plan added succesfully.");
        return onSuccess();
      }
    } catch (error) {
      console.error(error);
      const errMsg = getErrorMsg(error);
      displayAlert("error", errMsg);
    }
  };

  const onUpdateSubmit = async (values) => {
    try {
      const { id, index, name, planId } = values;
      const pickedOldPlans = pickHmoPlans(hmoPlans, ["name", "planId"]);
      const editedPlans = pickedOldPlans.map((plan, idx) => {
        if (idx === index) {
          const newPlan = { name: name, planId: planId };
          return newPlan;
        } else {
          return plan;
        }
      });

      const variables = {
        id,
        plans: editedPlans,
      };
      const { data } = await createEditHmoPlans({ variables: variables });
      if (data) {
        displayAlert("success", "Plan edited succesfully.");
        return onSuccess();
      }
    } catch (error) {
      console.error(error);
      const errMsg = getErrorMsg(error);
      displayAlert("error", errMsg);
    }
  };

  useEffect(() => {
    fetchPlans({
      variables: { type: "hmo" },
    })
      .then(({ data }) => {
        const options = (data?.getPlans?.plan || []).map((option) => {
          return { key: option?.name, value: option?._id };
        });
        setPlanOptions(options);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  }, [fetchPlans]);

  useEffect(() => {
    fetchHmoPlans({
      variables: { id: providerId },
    })
      .then(({ data }) => {
        setHmoPlans(data?.getProvider?.hmoPlans);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  }, [fetchHmoPlans, providerId]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) =>
        type === "edit"
          ? onUpdateSubmit({
              id: providerId,
              ...values,
            })
          : onAddSubmit({ id: providerId, ...values })
      }
      validationSchema={addEditPlansValidationSchema}
      validateOnChange={true}
      validateOnMount={false}
      validateOnBlur={true}
    >
      {({ isSubmitting, setFieldValue }) => {
        return (
          <Form style={{ marginTop: "1rem" }}>
            <Grid item container direction="column" gap={1}>
              <Grid item container rowSpacing={2}>
                <Grid item container>
                  <FormikControl
                    control="input"
                    name="name"
                    label="Name of plan"
                    placeholder="Enter Plan Name"
                  />
                </Grid>
                <Grid item container>
                  <FormikControl
                    disable={true}
                    control="select"
                    options={[
                      { key: "Access plan", value: "" },
                      ...planOptions,
                    ]}
                    name="planId"
                    label="Access type"
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomButton
                    title={type === "edit" ? "Save Plan" : "Add Plan"}
                    width="100%"
                    type={buttonType}
                    isSubmitting={isSubmitting}
                    disabled={isSubmitting}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

CreateEditHMOPlans.propTypes = {
  onSuccess: t.func.isRequired,
  initialValues: t.object.isRequired,
  type: t.string.isRequired,
};

export default CreateEditHMOPlans;
