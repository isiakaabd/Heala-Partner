import React, { useRef, useEffect, useState } from "react";
import { useAlert } from "hooks";
import { makeStyles } from "@mui/styles";
import { Field, ErrorMessage } from "formik";
import {
  FormControl,
  FormLabel,
  Grid,
  Avatar,
  Button,
  Typography,
} from "@mui/material";

import { Loader, TextError } from "components/Utilities";
import { RequiredIcon } from "components/Typography";
import {
  compressAndUploadImage,
  uploadImage,
} from "helpers/filterHelperFunctions";

const useStyles = makeStyles((theme) => ({
  FormLabel: {
    "&.MuiFormLabel-root": {
      ...theme.typography.FormLabel,
    },
  },

  uploadBtn: {
    "&.MuiButton-root": {
      ...theme.typography.btn,
      background: "#f2f2f2",
      boxShadow: "none",
      borderRadius: "5px",
      fontSize: "1.4rem",
      color: theme.palette.common.black,

      "&:hover": {
        background: "#f2f3f3",
        boxShadow: "none",
      },

      "&:active": {
        boxShadow: "none",
      },
    },
  },
}));

export const Formiks = ({ name, setFieldValue, onBlur }) => {
  const fileRef = useRef(null);
  const classes = useStyles();
  const [displayMessage] = useAlert();
  const [preview, setPreview] = useState("");
  const [isCompleted, setIsCompleted] = useState(null);
  const [progress, setProgress] = useState();
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    isCompleted === "passed" &&
      displayMessage("success", "Image upload complete.");
    if (isCompleted === "failed") {
      displayMessage("error", "Image upload failed, Try again.");
    }
  }, [isCompleted, displayMessage]);

  const onChange = async (e) => {
    const file = e.target.files[0];
    setProgress(1);
    compressAndUploadImage(
      file,
      uploadImage,
      setPreview,
      name,
      setFieldValue,
      setProgress,
      setIsCompressing,
      setIsCompleted
    );

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (e) => setPreview(reader.result);
  };

  return (
    <Grid container spacing={2} alignItems="center">
      {progress < 100 || isCompressing ? (
        <Grid
          container
          item
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Typography display={"inline"}>
            {isCompressing ? "Compressing image" : "Uploading image"}
          </Typography>
          <Loader />
        </Grid>
      ) : (
        <>
          <Grid item>
            <FormControl fullWidth>
              <Grid item container>
                <input
                  accept="image/*"
                  onChange={onChange}
                  type="file"
                  name={name}
                  onBlur={onBlur}
                  hidden
                  ref={fileRef}
                />
                <Button
                  variant="contained"
                  onClick={() => fileRef.current.click()}
                  component="span"
                  className={classes.uploadBtn}
                >
                  Upload Photo
                </Button>
              </Grid>
            </FormControl>
          </Grid>
          <Grid item>
            {preview && isCompleted !== "failed" ? (
              <Avatar sx={{ backgroundColor: "#eaeaea" }} src={preview} />
            ) : (
              ""
            )}
          </Grid>
        </>
      )}
    </Grid>
  );
};

const Files = (props) => {
  const { name, label, isRequired, ...rest } = props;
  const classes = useStyles();
  return (
    <Grid container direction="column" gap={1}>
      <FormLabel className={classes.FormLabel}>
        {label} {isRequired && <RequiredIcon />}
      </FormLabel>
      <Field name={name} as={Formiks} label={label} {...rest} />
      <ErrorMessage name={name} component={TextError} />
    </Grid>
  );
};

export default Files;
