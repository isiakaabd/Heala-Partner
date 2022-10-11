import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useAlert } from "components/hooks";
import { useMutation } from "@apollo/client";
import { useTheme } from "@mui/material/styles";
import { Grid, InputAdornment } from "@mui/material";

import { CustomButton } from "components/Utilities";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FormikControl, LoginInput } from "components/validation";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { updateEmail, updateProfileEmail } from "components/graphQL/Mutation";
// import { addEditPlansValidationSchema } from "helpers/validationSchemas";

export const changeEmailValidationSchema = Yup.object({
  email: Yup.string("Enter Email").trim().required("Email is required"),
  password: Yup.string("Enter password")
    .trim()
    .required("Password is required"),
});

const EmailChangeForm = () => {
  const theme = useTheme();
  const [changeEmail] = useMutation(updateEmail);
  const { _id: profileId } = JSON.parse(localStorage.getItem("partnerData"));
  const { displayAlert, getErrorMsg } = useAlert();
  const [showPassword, setShowPassword] = useState(false);
  const [changeProfileEmail] = useMutation(updateProfileEmail);

  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
  };

  const onSubmit = async (values) => {
    try {
      const { password, email, id } = values;
      const data = { email: email, currentPassword: password };
      const res = await Promise.all([
        changeEmail({ variables: { data } }),
        changeProfileEmail({ variables: { email, id } }),
      ]);
      console.log(res);
    } catch (error) {
      console.error(error);
      const errMsg = getErrorMsg(error);
      displayAlert("error", errMsg);
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={(values) => onSubmit({ id: profileId, ...values })}
      validationSchema={changeEmailValidationSchema}
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
                    name="email"
                    label="New email"
                    placeholder="Enter new email"
                  />
                </Grid>

                <Grid item container>
                  <LoginInput
                    id="password"
                    label="Enter password"
                    name="password"
                    autoFocus={false}
                    placeholder="Enter your current password"
                    type={showPassword ? "text" : "password"}
                    hasStartIcon={false}
                    endAdornment={
                      <InputAdornment
                        position="end"
                        onClick={() => setShowPassword((prev) => !prev)}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </InputAdornment>
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomButton
                    title="Save"
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

EmailChangeForm.propTypes = {};

export default EmailChangeForm;
