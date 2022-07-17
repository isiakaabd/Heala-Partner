import React, { useEffect } from "react";
import { CustomButton } from "components/Utilities";
import { useAlert } from "hooks";
import { Formik, Form } from "formik";
import FormikControl from "components/validation/FormikControl";
import { formatNumber } from "components/Utilities/Time";
import { Grid } from "@mui/material";
import PropTypes from "prop-types";
import { CREATE_PLAN, UPDATE_PLAN } from "components/graphQL/Mutation";
import { getSinglePlan, getPlans } from "components/graphQL/useQuery";
import { useLazyQuery, useMutation } from "@apollo/client";
import * as Yup from "yup";
import { useTheme } from "@mui/material/styles";

export const SubscriptionModal = ({
  handleDialogClose,
  type,
  editId,
  setSingleData,
  initialValues,
  singleData,
}) => {
  const theme = useTheme();
  const [displayMessage] = useAlert();
  const [createPlan] = useMutation(CREATE_PLAN, {
    refetchQueries: [
      {
        query: getPlans,
        variables: {
          provider: localStorage.getItem("partnerProviderId"),
        },
      },
    ],
  });
  const [updatePlan] = useMutation(UPDATE_PLAN, {
    refetchQueries: [
      {
        query: getPlans,
        variables: {
          provider: localStorage.getItem("partnerProviderId"),
        },
      },
    ],
  });

  const [single, { data }] = useLazyQuery(getSinglePlan, {
    variables: {
      id: editId,
    },
  });
  const validationSchema = Yup.object({
    name: Yup.string("Enter your Name").trim().required("Name is required"),
    amount: Yup.number("Enter your Amount")
      .typeError(" Enter a valid amount")
      .min(0, "Min value is  1")
      .required("Amount is required"),
    description: Yup.string("Enter Description")
      .trim()
      .required("Description is required"),
    duration: Yup.string("Enter Duration").required("Duration is required"),
  });

  useEffect(() => {
    if (type === "edit") {
      single();
    }

    if (data?.getPlan) {
      setSingleData({
        description: data.getPlan.description,
        name: data.getPlan.name,
        amount: formatNumber(Number(data.getPlan.amount)),
        duration: data.getPlan.duration,
        provider: data.getPlan.provider,
      });
    }
  }, [data, type, single, setSingleData]);

  const onSubmit = async (values, onSubmitProps) => {
    const { name, amount, description, duration } = values;
    let provider = localStorage.getItem("partnerProviderId");

    if (type === "edit") {
      try {
        await updatePlan({
          variables: {
            id: editId,
            name,
            amount: Number(amount),
            description,
            duration,
            provider,
          },
        });
        displayMessage("success", "Subscription Changed.");
      } catch (error) {
        displayMessage("error", error);
      }
    } else if (type === "add") {
      try {
        await createPlan({
          variables: {
            name,
            amount: Number(amount),
            description: description.trim(),
            duration,
            provider,
          },
        });
        displayMessage("success", "Subscription Created.");
      } catch (error) {
        displayMessage("error", error);
        console.error(error);
      }
    }
    handleDialogClose();
    onSubmitProps.resetForm();
  };

  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
    disabled: theme.palette.common.black,
  };
  return (
    <Formik
      onSubmit={onSubmit}
      validateOnBlur={false}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnMount={false}
      initialValues={type === "edit" ? singleData : initialValues}
      enableReinitialize
    >
      {({ isSubmitting, dirty, isValid }) => {
        return (
          <Form style={{ marginTop: "3rem" }}>
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
                    control="input"
                    name="amount"
                    placeholder="Enter Amount"
                    label="Amount"
                  />
                </Grid>
                <Grid item container>
                  <FormikControl
                    control="input"
                    placeholder="Enter Duration"
                    name="duration"
                    label="Duration"
                  />
                </Grid>

                <Grid item container>
                  <FormikControl
                    control="input"
                    placeholder="Enter your Description"
                    name="description"
                    label="Description"
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomButton
                    title={type === "edit" ? "Save Plan" : "Add Plan"}
                    width="100%"
                    isSubmitting={isSubmitting}
                    disabled={!(dirty || isValid)}
                    type={buttonType}
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

SubscriptionModal.propTypes = {
  handleDialogClose: PropTypes.func,
  setAlert: PropTypes.func,
  editId: PropTypes.string,
  type: PropTypes.string,
  edit: PropTypes.bool,
  initialValues: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  validationSchema: PropTypes.object,
  singleData: PropTypes.object,
  setSingleData: PropTypes.func,
};
