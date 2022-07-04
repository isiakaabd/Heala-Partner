import { useSnackbar } from "notistack";
import { Typography } from "@mui/material";
import React from "react";

const useAlert = () => {
  const { enqueueSnackbar } = useSnackbar();
  const displayMessage = (type, message) => {
    const networkError = message?.networkError?.result?.errors[0].message;
    const graphQlError = message?.graphQLErrors?.map((err) => err.message);

    return enqueueSnackbar(
      <Typography style={{ fontSize: "1.2rem" }}>
        {networkError ? networkError : graphQlError ? graphQlError : message}
      </Typography>,
      {
        variant: type,
        preventDuplicate: true,
        anchorOrigin: {
          horizontal: "right",
          vertical: "top",
        },
        autoHideDuration: 5000,
      }
    );
  };

  return [displayMessage];
};
export default useAlert;
