import React from "react";
import PropTypes from "prop-types";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const FormSelect = ({
  startAdornment,
  value,
  onChange,
  placeholder,
  options,
  ...rest
}) => {
  return (
    <FormControl sx={{ width: "100%" }}>
      <Select
        value={value}
        onChange={onChange}
        displayEmpty
        startAdornment={startAdornment}
        style={{ minHeight: 50, minWidth: 90 }}
        inputProps={{ "aria-label": "Select Referral Type" }}
        IconComponent={KeyboardArrowDownIcon}
        {...rest}
      >
        <MenuItem value="">
          <Typography>{placeholder}</Typography>
        </MenuItem>
        {options.map((option, index) => (
          <MenuItem
            key={option.value}
            value={option.value}
            style={{ fontSize: "1.25rem" }}
          >
            {option.key}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

FormSelect.propTypes = {
  options: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  startAdornment: PropTypes.element,
};

export default FormSelect;
