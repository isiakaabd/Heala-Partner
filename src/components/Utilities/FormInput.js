import React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormLabel from "@mui/material/FormLabel";
import EditIcon from "@mui/icons-material/Edit";

const useStyles = makeStyles((theme) => ({
  input: {
    "& .MuiOutlinedInput-input": {
      background: "transparent",
    },
    ...theme.typography.input,
  },
  label: {
    fontSize: "1.6rem",
    color: theme.palette.common.dark,
  },
}));

const FormInput = ({ label, labelId, id, position, iconButton, ...rest }) => {
  const classes = useStyles();
  return (
    <Grid container direction="column">
      <Grid item>
        <FormLabel component="legend" className={classes.label}>
          {label}
        </FormLabel>
      </Grid>

      <Grid item>
        <OutlinedInput
          id={id}
          className={classes.input}
          sx={{ background: "transparent" }}
          endAdornment={
            <InputAdornment position="end">
              <EditIcon />
            </InputAdornment>
          }
          {...rest}
        />
      </Grid>
    </Grid>
  );
};

FormInput.propTypes = {
  label: PropTypes.string,
  labelId: PropTypes.string,
  id: PropTypes.string,
  position: PropTypes.string,
  iconButton: PropTypes.node,
};

export default FormInput;
