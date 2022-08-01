import React, { useState } from "react";
import { LoginInput } from "components/validation";
import { Formik, Form } from "formik";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import * as Yup from "yup";
import { Grid, Typography, Checkbox, InputAdornment } from "@mui/material";
import { CustomButton } from "components/Utilities";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  form: theme.mixins.toolbar,
  btn: {
    "&.MuiButton-root": {
      //... theme.typography.btn,
      height: "5rem",
      background:
        "linear-gradient(130deg, rgb(62, 94, 169) 0%, rgb(62, 94, 169) 34%, rgb(126, 237, 186) 100%)",
      width: "100%",
      borderRadius: "3rem",
      fontSize: "1.3rem",
      boxShadow: "none",
      textTransform: "capitalize",
      fontWeight: "400",
    },
  },
  header: {
    "&.MuiGrid-root": {
      fontSize: "2rem",
      lineHeight: "2.6rem",
      color: "#010101",
    },
  },
  checkbox: {
    "&.MuiCheckbox-root": {
      padding: "0 !important",
    },
  },
}));

const LoginForm = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const greenButton = {
    background: theme.palette.common.green,
    hover: theme.palette.common.green,
    active: theme.palette.primary.dark,
  };
  const initialValues = {
    email: "",
    password: "",
    authType: "normal",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string().trim().required("password is required"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validateOnChange={false}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnMount={false}
      validateOnBlur={false}
      enableReinitialize={true}
    >
      {({ isSubmitting, isValid, dirty }) => {
        return (
          <Form>
            <Grid container item gap={2}>
              <Grid item container justifyContent="center" rowSpacing={1}>
                <Grid
                  item
                  container
                  justifyContent="center"
                  md={12}
                  mb={3}
                  sm={10}
                >
                  <Typography variant="h5" className={classes.header}>
                    LOGIN TO PARTNER ACCOUNT
                  </Typography>
                </Grid>

                <Grid item container md={12} sm={10}>
                  <LoginInput
                    label="Email"
                    name="email"
                    type="email"
                    id="email"
                    autoFocus={true}
                    placeholder="Enter your email"
                    hasStartIcon={false}
                  />
                </Grid>
                <Grid item container md={12} sm={10}>
                  <LoginInput
                    id="password"
                    label="Password"
                    name="password"
                    autoFocus={false}
                    placeholder="Enter your password"
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

                <Grid
                  item
                  container
                  md={12}
                  sm={10}
                  alignItems="center"
                  style={{ marginTop: "5%" }}
                >
                  <Grid
                    item
                    container
                    gap={2}
                    sx={{ flex: 1, alignItems: "center" }}
                  >
                    <Grid item>
                      <Checkbox
                        className={classes.checkbox}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 18,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="h6"
                        style={{
                          fontSize: "12px",
                          marginLeft: "-10%",
                          fontWeight: "400",
                        }}
                      >
                        Remember Me
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="h6"
                      color="primary"
                      component={Link}
                      style={{
                        color: theme.palette.common.green,
                        textDecoration: "none",
                        fontSize: "12px",
                        marginLeft: "-10%",
                        fontWeight: "400",
                      }}
                      to="/signup"
                      className={classes.link}
                    >
                      Forget Password
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item container margin="auto" mt={3} md={12} sm={10}>
                <CustomButton
                  variant="contained"
                  title="Login"
                  type={greenButton}
                  role="button"
                  borderRadius={20}
                  className={classes.btn}
                  isSubmitting={isSubmitting}
                  disabled={!(dirty || isValid)}
                />
              </Grid>
              <Grid
                item
                container
                alignItems="center"
                justifyContent="center"
              ></Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default LoginForm;
