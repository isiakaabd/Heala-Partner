import Proptypes from "prop-types";

import { useAlert } from "hooks";

export const useCopy = () => {
  const [displayMessage] = useAlert();

  const copyToClipBoard = (text, name) => {
    try {
      navigator.clipboard.writeText(text);
      displayMessage("success", `${name ? name : "Text"} copied!!!`);
    } catch (error) {
      displayMessage("error", "Something went wrong, try again.");
      console.error(error);
    }
  };

  return {
    copyToClipBoard,
  };
};

useCopy.PropTypes = {
  text: Proptypes.string.isRequired,
  name: Proptypes.string.isRequired,
};
