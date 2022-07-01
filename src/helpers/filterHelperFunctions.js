import axios from "axios";
import patterns from "mocks/patterns";
import { Typography } from "@mui/material";
import t from "prop-types";
import React from "react";
import { removeEmptyStringValues } from "./func";
import { useSnackbar } from "notistack";

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

export const showErrorMsg = (enqueueSnackbar, errorMsg) => {
  enqueueSnackbar(
    <Typography style={{ fontSize: "1.2rem" }}>{errorMsg}</Typography>,
    {
      variant: "error",
      preventDuplicate: true,
      anchorOrigin: {
        horizontal: "center",
        vertical: "top",
      },
      autoHideDuration: 10000,
    }
  );
};

export const showSuccessMsg = (enqueueSnackbar, successMsg) => {
  enqueueSnackbar(
    <Typography style={{ fontSize: "1.2rem" }}>{successMsg}</Typography>,
    {
      variant: "success",
      preventDuplicate: true,
      anchorOrigin: {
        horizontal: "right",
        vertical: "top",
      },
      autoHideDuration: 5000,
    }
  );
};

export const handleError = (error, enqueueSnackbar) => {
  if (error?.graphQLErrors && error?.graphQLErrors?.length > 0) {
    (error?.graphQLErrors || []).map((err) =>
      showErrorMsg(enqueueSnackbar, err.message)
    );
  } else if (error?.networkError) {
    error.networkError?.result?.errors?.map((err) =>
      showErrorMsg(
        enqueueSnackbar,
        err.message || "Something went wrong, try again."
      )
    );
  } else if (error?.message) {
    showErrorMsg(enqueueSnackbar, error.message);
  }
};

export const onFilterValueChange = async (
  e,
  name,
  filterValues,
  setFilterValues,
  fetchData,
  variables,
  refetchData
) => {
  const value = e?.target?.value;
  const newFilterData = { ...filterValues, [name]: value };
  setFilterValues(newFilterData);
  const newData = removeEmptyStringValues(newFilterData);
  if (value !== "") {
    fetchData({
      variables: newData,
    });
  } else {
    delete variables?.[name];
    refetchData();
  }
};

export const resetFilters = (
  setFilterValues,
  values,
  variables,
  refetchData
) => {
  setFilterValues(values);
  for (const key in variables) {
    delete variables[key];
  }
  refetchData();
};

export const changeTableLimit = async (limit, fetchFunc, value, partnerId) => {
  try {
    fetchFunc({
      variables: {
        first: limit,
        status: value,
        partnerProviderId: partnerId,
      },
    });
  } catch (error) {
    console.log("couldn't change table limit", error);
  }
};

export const changeHospitalTableLimit = async (fetchFunc, variables) => {
  try {
    fetchFunc({
      variables: variables,
    });
  } catch (error) {
    console.log("couldn't change table limit", error);
  }
};

export const handlePageChange = (
  fetchDataFN,
  type,
  pageInfo,
  value,
  partnerId
) => {
  const getData = (pageNumber) => {
    fetchDataFN({
      variables: {
        page: pageNumber,
        first: pageInfo.limit,
        status: value,
        partnerProviderId: partnerId,
      },
    });
  };

  switch (type) {
    case "FIRSTPAGE":
      getData(1);
      break;

    case "NEXTPAGE":
      getData(pageInfo?.nextPage || 1);
      break;

    case "PREVPAGE":
      getData(pageInfo?.prevPage || 1);
      break;

    case "LASTPAGE":
      getData(pageInfo?.totalPages || 1);
      break;

    default:
      break;
  }
};

export const handleHospitalPageChange = (
  fetchDataFN,
  type,
  pageInfo,
  variables
) => {
  const getData = (pageNumber) => {
    fetchDataFN({
      variables: {
        page: pageNumber,
        first: pageInfo.limit,
        ...variables,
      },
    });
  };

  switch (type) {
    case "FIRSTPAGE":
      getData(1);
      break;

    case "NEXTPAGE":
      getData(pageInfo?.nextPage || 1);
      break;

    case "PREVPAGE":
      getData(pageInfo?.prevPage || 1);
      break;

    case "LASTPAGE":
      getData(pageInfo?.totalPages || 1);
      break;

    default:
      break;
  }
};

export const fetchMoreData = async (newPage, fetchData, value) => {
  fetchData({
    variables: {
      page: newPage,
      status: value,
    },
  });
};

export const trucateString = (word, length) => {
  try {
    const wordArr = word.split("");
    const newWord = `${wordArr.slice(0, length).join("")}...`;
    return newWord;
  } catch (error) {
    console.error("Error from trucateString FN", error);
    return word;
  }
};

trucateString.PropTypes = {
  word: t.string,
  length: t.number,
};

export const getAppPattern = (appType) => {
  switch (appType) {
    case "diagnostics":
      return patterns?.diagnosticsPatterns;
    case "pharmacy":
      return patterns?.pharmacyPatterns;
    case "hospital":
      return patterns?.hospitalPatterns;
    default:
      return {};
  }
};

export const compressAndUploadImage = async (
  img,
  uploadFunc,
  setPreview,
  name,
  setFieldValue,
  setProgress,
  isCompressing,
  setIsCompleted
) => {
  try {
    if (!img) throw new Error("No file passed to upload function");
    const uploadRes = await uploadFunc(img, setProgress);
    if (uploadRes === undefined) {
      throw new Error("couldn't upload image");
    }
    if (uploadRes) {
      setFieldValue(name, uploadRes);
      setIsCompleted("passed");
      setTimeout(() => {
        setIsCompleted(null);
      }, 1500);
    }
  } catch (error) {
    console.log("Error while trying to upload image", error);
    setProgress(100);
    setIsCompleted("failed");
    setTimeout(() => {
      setPreview(undefined);
      setIsCompleted(null);
    }, 1500);
  }
};

export const uploadImage = async (file, setProgress) => {
  try {
    const form = new FormData();
    form.append("file", file);
    const data = await axios({
      method: "post",
      url: "https://api.heala.io/rest/media/upload/",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${form._boundary}`,
      },
      data: form,
      onUploadProgress: (data) => {
        //Set the progress value to show the progress bar
        setProgress(Math.round((100 * data.loaded) / data.total));
      },
    });
    return data.data.data.mediaUrl; //data.data.mediaUrl
  } catch (error) {
    console.error(error);
    setProgress(100);
  }
};
