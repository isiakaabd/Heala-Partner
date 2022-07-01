import React from "react";
import Radio from "@mui/material/Radio";

import { makeStyles } from "@mui/styles";
import FormControlLabel from "@mui/material/FormControlLabel";

const useStyles = makeStyles((theme) => ({
  radio: {
    "& .MuiSvgIcon-root": {
      fontSize: 28,
    },
  },
}));

const FormRadio = ({ label, labelPlacement, value, ...rest }) => {
  const classes = useStyles();
  return (
    <div>
      <FormControlLabel
        value={value}
        control={<Radio />}
        label={label}
        className={classes.radio}
        labelPlacement={labelPlacement ? labelPlacement : "end"}
        {...rest}
      />
    </div>
  );
};
FormRadio.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  labelPlacement: PropTypes.element,
};
export default FormRadio;
