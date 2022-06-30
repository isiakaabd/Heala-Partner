import React from "react";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
const useStyles = makeStyles((theme) => ({
  color: {
    color: theme.palette.error.main,
    fontSize: "1.2rem",
  },
}));

const TextError = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.color}>{children}</div>;
};
export default TextError;
TextError.propTypes = {
  children: PropTypes.node,
};
