import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    // <Router>
    <Route
      path={path}
      {...rest}
      render={(props) => {
        if (!isAuthenticated) return <Redirect to="/login" />;
        else if (isAuthenticated) {
          return <Component {...props} {...rest} path={path} />;
        }
      }}
    />
    // </Router>
  );
};

export default PrivateRoute;
