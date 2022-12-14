import React, { useState } from "react";
import t from "prop-types";
import { Formik, Form } from "formik";
import { useAlert } from "components/hooks";
import { useTheme } from "@mui/material/styles";
import { Grid } from "@mui/material";
import { useMutation } from "@apollo/client";
import { CustomButton } from "components/Utilities";
import { FormikControl } from "components/validation";
import { UPDATE_TEST } from "components/graphQL/Mutation";
import * as Yup from "yup";
import { CustomSelect } from "components/validation/Select";

export const EditTestForm = ({ onSuccess, data }) => {
  const theme = useTheme();
  const { displayMessage } = useAlert();
  const [updateTest] = useMutation(UPDATE_TEST);
  const [value, setValue] = useState("Hours");
  const tatArr = data.tat.split(" ");
  const initialValues = {
    id: data?._id,
    name: data?.name,
    price: data.price,
    tatNumber: tatArr[0],
    tatDuration: tatArr[1],
  };

  const onSubmit = async (values) => {
    try {
      const { id, name, price, tatNumber, tatDuration } = values;
      const variables = {
        id: id,
        name: name,
        price: Number(price),
        tat: `${tatNumber} ${tatDuration}`,
      };

      const { data } = await updateTest({
        variables: variables,
      });
      if (data) {
        displayMessage("success", "Test Updated.");
        onSuccess();
      }
    } catch (err) {
      displayMessage("error", err);
      console.error(err);
    }
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

  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnMount={false}
      validateOnBlur={false}
    >
      {({ isSubmitting }) => {
        return (
          <Form style={{ marginTop: "1rem" }}>
            <Grid container direction="column" gap={2}>
              <Grid item container direction="column" gap={1}>
                <FormikControl control="input" id="id" name="id" hidden />
              </Grid>
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
                <Grid container spacing={2}>
                  <Grid item flexGrow={1}>
                    <FormikControl
                      control="input"
                      label="Turnaround time (TAT)"
                      id="tat"
                      name="tatNumber"
                      placeholder="48"
                    />
                  </Grid>
                  <Grid item sx={{ display: "flex", alignItems: "flex-end" }}>
                    <CustomSelect
                      Control
                      name="tatDuration"
                      disable={false}
                      value={value}
                      options={[
                        { key: "Minutes", value: "Minutes" },
                        { key: "Hours", value: "Hours" },
                        { key: "Days", value: "Days" },
                      ]}
                      onChange={(e) => {
                        setValue(e?.target?.value);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item container>
                <CustomButton
                  title="Update Test"
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

EditTestForm.propTypes = {
  onSuccess: t.func.isRequired,
  data: t.object,
};
