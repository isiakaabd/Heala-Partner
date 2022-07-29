import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useAlert } from "components/hooks";
import { ReactComponent as HealaIconW } from "assets/images/logo-white1.svg";
import { useHistory } from "react-router-dom";
import { Grid, Avatar } from "@mui/material";
import vec from "assets/images/vec.png";
import { makeStyles } from "@mui/styles";

// import { useSelector } from 'react-redux'
import { Login_USER } from "components/graphQL/Mutation";
import { useMutation } from "@apollo/client";
import { setAccessToken } from "../../accessToken";
import { useActions } from "components/hooks/useActions";
import { LoginForm } from "components/pages/forms";
const useStyles = makeStyles((theme) => ({
  // form: theme.mixins.toolbar,
  background: {
    width: "100%",
    minHeight: "100vh !important",
    background:
      "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),linear-gradient(98.44deg, #3e5ea9 1.92%, #7eedba 122.04%) !important",
  },
  secV: {
    backgroundImage: `url(${vec})`,
    opacity: " 0.05",
    width: "100%",
    height: "100.1%",
    position: "absolute",
    backgroundRepeat: "round",
  },
}));

const Login = () => {
  const classes = useStyles();

  const { displayMessage } = useAlert();
  const history = useHistory();
  const [loginInfo] = useMutation(Login_USER);
  const { loginUser, loginFailue } = useActions();

  const onSubmit = useCallback(async (values, onSubmitProps) => {
    try {
      const { email, password, authType } = values;
      const { data } = await loginInfo({
        variables: {
          data: { email, password, authType },
        },
      });
      if (data?.login?.account?.role === "partner") {
        const { email, _id, access_token, providerId } = data?.login?.account;
        setAccessToken(access_token);
        localStorage.setItem("AppId", _id);
        localStorage.setItem("partnerProviderId", providerId);
        localStorage.setItem("AppEmail", email);
        loginUser({
          data,
          messages: {
            message: "Login successful",
            type: "success",
          },
        });
        displayMessage("success", "Login successful");
        history.push("/dashboard");
      } else {
        displayMessage("error", "Please login using a Partner account");
      }
      onSubmitProps.resetForm({
        values: {
          ...values,
          password: "",
        },
      });
    } catch (error) {
      console.error(error);
      displayMessage("error", "Failed to login");
      loginFailue({
        message: error.message,
        type: "error",
      });
    }
    //eslint-disable-next-line
  }, []);
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className={classes.background}
    >
      <div className={classes.secV}></div>
      <Grid container justifyContent="center" margin="auto">
        <Grid
          container
          style={{
            marginTop: "-10%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              background: "transparent",
              color: "white",
              width: 150,
              height: 150,
            }}
          >
            <HealaIconW />
          </Avatar>
        </Grid>
        <Grid
          item
          container
          md={5}
          lg={3}
          xs={11}
          direction="column"
          sx={{
            padding: "4rem 3rem 3rem",
            background: "white",
            borderRadius: "5px",
            margin: "auto",
          }}
        >
          <Grid item>
            <LoginForm onSubmit={onSubmit} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

Login.propTypes = {
  history: PropTypes.object,
};

export default Login;
