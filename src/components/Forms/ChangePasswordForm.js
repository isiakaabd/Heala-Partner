import React, { useState } from "react";
import * as Yup from "yup";
//import t from "prop-types";
import { Formik, Form } from "formik";
import { useTheme } from "@mui/material/styles";
import { Grid, InputAdornment } from "@mui/material";

import { useAlert } from "components/hooks";
import { useMutation } from "@apollo/client";
import { LoginInput } from "components/validation";
import { CustomButton } from "components/Utilities";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { updatePassword } from "components/graphQL/Mutation";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import { addEditPlansValidationSchema } from "helpers/validationSchemas";

export const changePasswordValidationSchema = Yup.object({
  currentPassword: Yup.string("Enter your current password")
    .trim()
    .required("Current password is required"),
  newPassword: Yup.string("Enter new password").required(
    "New password is required"
  ),
  confirmPassword: Yup.string("Re-enter new password")
    .trim()
    .required("This field is required"),
});

const ChangePasswordForm = () => {
  const theme = useTheme();
  const [changePassword] = useMutation(updatePassword);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { getErrorMsg, displayAlert, watchFunction } = useAlert();
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const buttonType = {
    background: theme.palette.common.black,
    hover: theme.palette.primary.main,
    active: theme.palette.primary.dark,
  };

  const onSubmit = async (values) => {
    try {
      const { currentPassword, newPassword, confirmPassword } = values;
      const res = changePassword({
        variables: { currentPassword, newPassword, confirmPassword },
      });
      return watchFunction(
        "Password changed successfully.",
        "Unable to change password, try again.",
        res
      )
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
      const errMsg = getErrorMsg(error);
      displayAlert("error", errMsg);
    }
  };

  return (
    <Formik
      initialValues={{}}
      onSubmit={(values) => onSubmit(values)}
      validationSchema={changePasswordValidationSchema}
      validateOnChange={true}
      validateOnMount={false}
      validateOnBlur={true}
    >
      {({ isSubmitting }) => {
        return (
          <Form style={{ marginTop: "1rem" }}>
            <Grid item container direction="column" gap={1}>
              <Grid item container rowSpacing={2}>
                <Grid item container>
                  <LoginInput
                    id="password"
                    label="Enter old password"
                    name="currentPassword"
                    autoFocus={false}
                    placeholder="Enter your current password"
                    type={showOldPassword ? "text" : "password"}
                    hasStartIcon={false}
                    endAdornment={
                      <InputAdornment
                        position="end"
                        onClick={() => setShowOldPassword((prev) => !prev)}
                        style={{ cursor: "pointer" }}
                      >
                        {showOldPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </InputAdornment>
                    }
                  />
                </Grid>
                <Grid item container>
                  <LoginInput
                    id="password"
                    label="Enter new password"
                    name="newPassword"
                    autoFocus={false}
                    placeholder="Enter new password"
                    type={showNewPassword ? "text" : "password"}
                    hasStartIcon={false}
                    endAdornment={
                      <InputAdornment
                        position="end"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        style={{ cursor: "pointer" }}
                      >
                        {showNewPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </InputAdornment>
                    }
                  />
                </Grid>
                <Grid item container>
                  <LoginInput
                    id="password"
                    label="Confirm new password"
                    name="confirmPassword"
                    autoFocus={false}
                    placeholder="Re-enter new password"
                    type={showConfirmNewPassword ? "text" : "password"}
                    hasStartIcon={false}
                    endAdornment={
                      <InputAdornment
                        position="end"
                        onClick={() =>
                          setShowConfirmNewPassword((prev) => !prev)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        {showConfirmNewPassword ? (
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

ChangePasswordForm.propTypes = {};

export default ChangePasswordForm;
