import Proptypes from "prop-types";
import useAlert from "components/hooks/useAlert";
import { useCallback } from "react";

const useCopy = () => {
  const { displayMessage } = useAlert();

  const copyToClipBoard = useCallback((text, name) => {
    try {
      navigator.clipboard.writeText(text);
      return displayMessage("success", `${name ? name : "Text"} copied!!!`);
    } catch (error) {
      displayMessage("error", "Something went wrong, try again.");
      console.error(error);
    }
    // eslint-disable-next-line
  }, []);

  return {
    copyToClipBoard,
  };
};
export default useCopy;
useCopy.PropTypes = {
  text: Proptypes.string.isRequired,
  name: Proptypes.string.isRequired,
};
