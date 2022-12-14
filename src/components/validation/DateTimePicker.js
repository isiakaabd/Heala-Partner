import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { TextError } from "components/Utilities";
import { TextField, FormLabel, Grid } from "@mui/material";
import PropTypes from "prop-types";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { makeStyles } from "@mui/styles";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDateTimePicker from "@mui/lab/DesktopDateTimePicker";
const useStyles = makeStyles((theme) => ({
  input: {
    ...theme.typography.input,
  },
  FormLabel: {
    "&.MuiFormLabel-root": {
      ...theme.typography.FormLabel,
    },
  },
}));

const Dates = ({ name, value, onBlur }) => {
  const today = new Date();
  const classes = useStyles();
  const { setFieldValue } = useFormikContext();
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDateTimePicker
        minDate={today}
        name={name}
        onChange={(value) => setFieldValue(name, value)}
        value={value}
        onBlur={onBlur}
        className={classes.input}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              padding: "-12px",
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

Dates.propTypes = {
  value: PropTypes.string,
  // label: PropTypes.string,
  onChange: PropTypes.func,
  setFieldValue: PropTypes.func,
  children: PropTypes.node,
  name: PropTypes.string,
  onBlur: PropTypes.func,
};

const DateTimePicker = (props) => {
  const { name, label, ...rest } = props;
  const classes = useStyles();
  return (
    <Grid container direction="column" gap={1}>
      <FormLabel className={classes.FormLabel}>{label}</FormLabel>
      <Field name={name} as={Dates} {...rest} className={classes.input} />
      <ErrorMessage name={name} component={TextError} />
    </Grid>
  );
};

DateTimePicker.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.array,
  placeholder: PropTypes.string,
};

export default DateTimePicker;
