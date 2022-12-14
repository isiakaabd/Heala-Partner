import React from "react";
import t from "prop-types";
import { Formik, Form } from "formik";
import { useTheme } from "@mui/material/styles";
import { Grid } from "@mui/material";
import { useMutation } from "@apollo/client";
import { CustomButton } from "components/Utilities";
import { uploadTests } from "../../components/graphQL/Mutation";
import { uploadTestFileValidation } from "../../helpers/validationSchemas";
import DragAndDrop from "./DragAndDrop";

export const UploadTestForm = ({ onSuccess }) => {
  const theme = useTheme();
  const [uploadTestFile] = useMutation(uploadTests);

  const addTestIntialValues = {
    testFile: null,
  };

  const onSubmit = async (values) => {
    try {
      const uploadRes = await uploadTestFile({
        variables: {
          fileUrl: values?.testFile,
        },
      });
      console.log("res", uploadRes);
      onSuccess();
    } catch (error) {
      console.log("couldn't upload file", error);
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
      validationSchema={uploadTestFileValidation}
      validateOnChange={false}
      validateOnMount={false}
      validateOnBlur={false}
    >
      {({ isSubmitting, dirty, isValid, setFieldValue, setValues }) => {
        return (
          <Form style={{ marginTop: "1rem" }}>
            <Grid container direction="column" space={2}>
              <Grid item>
                <DragAndDrop
                  name="testFile"
                  setFieldValue={setFieldValue}
                  maxFiles={1}
                />
              </Grid>
              <Grid item>
                <CustomButton
                  title="Upload file"
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

UploadTestForm.propTypes = {
  onSuccess: t.func,
};
