import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import t from "prop-types";
import { Formik, Form } from "formik";
import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useLazyQuery, useMutation } from "@apollo/client";

import { useAlert } from "components/hooks";
import { CustomButton } from "components/Utilities";
import { FormikControl } from "components/validation";
import { getPlans } from "components/graphQL/useQuery";
import { addHMOEnrolleInitialValues } from "helpers/mockData";
import { dateMoment, removeEmptyStringValues } from "helpers/func";
//import { addHMOEnrolleeValidationSchema } from "helpers/validationSchemas";
import { createEnrollee, updateEnrollee } from "components/graphQL/Mutation";

const addHMOEnrolleeValidationSchema = Yup.object({
  id: Yup.string("enter id").trim(),
  firstName: Yup.string("Enter first name")
    .trim()
    .required("First name is required"),
  lastName: Yup.string("Enter last name")
    .trim()
    .required("Last name is required"),
  email: Yup.string("Enter email address")
    .email("Enter a valid email")
    .trim()
    .required("Email is required"),
  phone: Yup.number("Enter your Phone Number")
    .typeError(" Enter a valid phone number")
    .min(11, "min value is  11 digits")
    .required("Phone number is required"),
  hmoId: Yup.string("Enter HMO ID").trim().required("HMO ID is required"),
  noc: Yup.string("Enter NOC").trim(),
  plan: Yup.string("Enter HMO plan").trim().required("HMO Plan is required"),
  planId: Yup.string("Select Heala plan")
    .trim()
    .required("Heala Plan is required"),
  expiryDate: Yup.date("Enter HMO plan expiry date")
    .typeError("Please select a valid date")
    .required("Expiry date is Required"),
});

const AddEditHMOEnrolleeForm = ({ type, editInitialValues, onSuccess }) => {
  const theme = useTheme();
  const { hmoId } = useParams();
  const [date, setDate] = useState("");
  const [fetchPlans] = useLazyQuery(getPlans);
  const { displayAlert, getErrorMsg } = useAlert();
  const [planOptions, setPlanOptions] = useState([]);
  const [addHMOEnrollee] = useMutation(createEnrollee);
  const [updateHMOEnrollee] = useMutation(updateEnrollee);

  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
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
    setDate(Date.now());
  }, []);

  const onAddSubmit = async (values) => {
    const formatedDate = dateMoment(values.expiryDate);
    const variables = removeEmptyStringValues(values);
    try {
      if (!variables.providerId) {
        throw Error("Provider ID not found!");
      }
      const { data } = await addHMOEnrollee({
        variables: { expiryDate: formatedDate, ...variables },
      });
      if (data) {
        displayAlert("success", "Enrollee added successfully");
        onSuccess();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      const errMsg = getErrorMsg(error);
      displayAlert("error", errMsg);
    }
  };

  const onUpdateSubmit = async (values) => {
    const formatedDate = dateMoment(values.expiryDate);
    const variables = removeEmptyStringValues(values);
    try {
      if (!variables?.providerId && !variables?.id) {
        throw Error("Provider ID or Enrollee ID found!");
      }
      const { data } = await updateHMOEnrollee({
        variables: { expiryDate: formatedDate, ...variables },
      });
      if (data) {
        displayAlert("success", "Enrollee updated successfully");
        onSuccess();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      const errMsg = getErrorMsg(error);
      displayAlert("error", errMsg);
    }
  };

  return (
    <Formik
      initialValues={
        type === "edit" ? editInitialValues : addHMOEnrolleInitialValues
      }
      onSubmit={(values) =>
        type === "edit"
          ? onUpdateSubmit({
              id: editInitialValues._id,
              providerId: hmoId,
              ...values,
            })
          : onAddSubmit({ providerId: hmoId, ...values })
      }
      validationSchema={addHMOEnrolleeValidationSchema}
      validateOnChange={true}
      validateOnMount={false}
      validateOnBlur={true}
    >
      {({ isSubmitting, setFieldValue, setValues }) => {
        return (
          <Form style={{ marginTop: "1rem" }}>
            <Grid container direction="column" gap={2}>
              <Grid item container direction="column" gap={1}>
                <FormikControl
                  control="input"
                  label="First Name"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter first name"
                />
              </Grid>
              <Grid item container direction="column" gap={1}>
                <FormikControl
                  control="input"
                  label="Last Name"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter last name"
                />
              </Grid>
              <Grid item container direction="column" gap={1}>
                <FormikControl
                  control="input"
                  label="HMO ID"
                  id="hmoID"
                  name="hmoId"
                  placeholder="Enter HMO ID"
                />
              </Grid>

              <Grid item container direction="column" gap={1}>
                <FormikControl
                  control="input"
                  label="Email"
                  id="email"
                  name="email"
                  placeholder="Enter email address"
                />
              </Grid>
              <Grid item container direction="column" gap={1}>
                <FormikControl
                  control="input"
                  label="Phone number"
                  id="phone_number"
                  name="phone"
                  placeholder="Enter phone number"
                />
              </Grid>
              <Grid item container direction="column" gap={1}>
                <FormikControl
                  control="input"
                  label="HMO Plan"
                  id="plan"
                  name="plan"
                  placeholder="Enter HMO Plan"
                />
              </Grid>
              <Grid item container direction="column" gap={1}>
                <FormikControl
                  control="date"
                  label="Expiry date (for HMO plan)"
                  id="expiry"
                  name="expiryDate"
                  setFieldValue={setFieldValue}
                  setValues={setValues}
                  startDate={date}
                />
              </Grid>
              <Grid item container direction="column" gap={1}>
                <FormikControl
                  control="select"
                  options={[{ key: "Plan", value: "" }, ...planOptions]}
                  placeholder="Select Plan"
                  name="planId"
                  label="Heala Access Plan"
                />
              </Grid>

              <Grid item container>
                <CustomButton
                  title={type === "edit" ? "Update Enrollee" : "Add Enrollee"}
                  width="100%"
                  type={buttonType}
                  isSubmitting={isSubmitting}
                  disabled={isSubmitting}
                />
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

AddEditHMOEnrolleeForm.propTypes = {
  onSuccess: t.func.isRequired,
  editInitialValues: t.object,
  type: t.string.isRequired,
};

export default AddEditHMOEnrolleeForm;
