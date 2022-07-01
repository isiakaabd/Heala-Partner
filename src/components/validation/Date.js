import React from "react";
import { Field, ErrorMessage } from "formik";
import { TextError } from "components/Utilities";
import PropTypes from "prop-types";
import { Grid, FormLabel, TextField } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { makeStyles } from "@mui/styles";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

const useStyles = makeStyles((theme) => ({
  FormLabel: {
    "&.MuiFormLabel-root": {
      ...theme.typography.FormLabel,
    },
  },
}));

const Dates = ({ name, value, setFieldValue, onBlur, type }) => {
  const today = new Date();
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        name={name}
        minDate={type !== "hospital" ? today : null}
        onChange={(value) => setFieldValue(name, value)}
        value={value}
        onBlur={onBlur}
        onError={(err) => console.log(err)}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};

Dates.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  setFieldValue: PropTypes.func,
  children: PropTypes.node,
  name: PropTypes.string,
  onBlur: PropTypes.func,
};

const DateComponent = (props) => {
  const { name, label, type, ...rest } = props;
  const classes = useStyles();
  return (
    <Grid container direction="column" gap={1}>
      <FormLabel className={classes.FormLabel}>{label}</FormLabel>
      <Field
        name={name}
        as={Dates}
        label={label}
        {...rest}
        type={type}
        style={{ maxHeight: "2rem" }}
      />
      <ErrorMessage name={name} component={TextError} />
    </Grid>
  );
};

DateComponent.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.array,
  placeholder: PropTypes.string,
};

export default DateComponent;
