import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const NotistackAlert = ({ variant, message, error }) => {
  const [state, setState] = useState(null);
  useEffect(() => {
    setState(message);
  }, [message, variant, error]);
  const newMessage = error?.networkError?.result?.errors[0].message;
  const { enqueueSnackbar } = useSnackbar();
  return enqueueSnackbar(error ? newMessage : state, {
    variant,
  });
};
NotistackAlert.propTypes = {
  variant: PropTypes.string,
  message: PropTypes.string,
  error: PropTypes.string,
};

export default NotistackAlert;
