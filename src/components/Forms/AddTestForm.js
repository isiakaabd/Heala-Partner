import React from "react";
import t from "prop-types";
import { Formik, Form } from "formik";
import { useAlert } from "components/hooks";
import { useTheme } from "@mui/material/styles";
import { Grid } from "@mui/material";
import { useMutation } from "@apollo/client";
import { CustomButton } from "components/Utilities";
import { FormikControl } from "components/validation";
import { addTest } from "components/graphQL/Mutation";
import * as Yup from "yup";

export const AddTestForm = ({ onSuccess }) => {
  const theme = useTheme();
  const { displayMessage } = useAlert();
  const [addSingleTest] = useMutation(addTest);

  const addTestIntialValues = {
    name: "",
    price: null,
    tat: "",
  };
  const validationSchema = Yup.object({
    name: Yup.string("Enter your Test name")
      .trim()
      .required("Test Name is required"),
    price: Yup.number("Enter your Test price")
      .trim()
      .required("Test Price is required"),
    tat: Yup.string("Enter your Test price").trim().required("TAT is required"),
  });
  const onSubmit = async (values) => {
    try {
      const { name, price, tat } = values;
      const variables = {
        name: name,
        price: Number(price),
        tat: parseInt(tat) > 1 ? `${tat} Hours` : `${tat} Hour`,
      };
      const { data } = await addSingleTest({
        variables: variables,
      });
      if (data) {
        displayMessage("success", "Test added.");
        onSuccess();
      }
    } catch (err) {
      displayMessage("error", err);
      console.error(err);
    }
  };

  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
  };

  return (
    <Formik
      initialValues={addTestIntialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnMount={false}
      validateOnBlur={false}
    >
      {({ isSubmitting, dirty, isValid }) => {
        return (
          <Form style={{ marginTop: "1rem" }}>
            <Grid container direction="column" gap={2}>
              <Grid item container direction="column" gap={1}>
                <FormikControl
                  control="input"
                  label="Test Name"
                  id="name"
                  name="name"
                  placeholder="Enter Test name"
                />
              </Grid>
              <Grid item container direction="column" gap={1}>
                <FormikControl
                  control="input"
                  label="Test price"
                  id="price"
                  name="price"
                  placeholder="Enter Test price"
                />
              </Grid>
              <Grid item>
                <FormikControl
                  control="input"
                  label="Turnaround time (TAT) - (hours)"
                  id="tat"
                  name="tat"
                  placeholder="48"
                />
              </Grid>
              <Grid item container>
                <CustomButton
                  title="Add Test"
                  width="100%"
                  type={buttonType}
                  isSubmitting={isSubmitting}
                  disabled={!dirty || !isValid || isSubmitting}
                />
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

AddTestForm.propTypes = {
  onSuccess: t.func,
};
