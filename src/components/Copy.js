import React from "react";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import { useCopy } from "./hooks/useCopy";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const Copy = ({ text, name, ...props }) => {
  const { copyToClipBoard } = useCopy();

  return (
    <IconButton
      onClick={() => copyToClipBoard(text, name)}
      sx={{ color: "inherit" }}
      {...props}
    >
      <ContentCopyIcon />
    </IconButton>
  );
};

Copy.propTypes = {
  text: PropTypes.string,
  name: PropTypes.string,
};

export default Copy;
