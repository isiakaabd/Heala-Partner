import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
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

const Dates = ({ name, value, onBlur, disabled, type, ...rest }) => {
  const today = new Date();
  const { setFieldValue } = useFormikContext();
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        name={name}
        minDate={type !== "hospital" ? today : null}
        onChange={(value) => setFieldValue(name, value)}
        value={value}
        disabled={disabled}
        onBlur={onBlur}
        style={{ height: "5rem !important" }}
        renderInput={(params) => (
          <TextField
            {...params}
            disabled={disabled}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "1.2rem !important",
                height: "5rem !important",
              },
            }}
          />
        )}
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
  const { name, label, type, disabled, ...rest } = props;
  const classes = useStyles();

  return (
    <Grid container direction="column" gap={1}>
      <FormLabel className={classes.FormLabel}>{label}</FormLabel>
      <Field
        name={name}
        as={Dates}
        label={label}
        {...rest}
        disabled={disabled}
        type={type}
        className={classes.input}
        style={{
          maxHeight: "2rem",
          background: disabled ? "#fafafa" : "inherit",
          borderRadius: "1.4rem !important",
        }}
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
