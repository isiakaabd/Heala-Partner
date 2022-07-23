import { useContext } from "react";
import AppTypeContext from "store/contexts/AppTypeContext";
import { useAlert } from "components/hooks";
const useApptype = () => {
  const context = useContext(AppTypeContext);
  const { displayMessage } = useAlert();

  if (context === undefined) {
    displayMessage("error", "useAppType must be used within AppTypeContext");
  }

  return context;
};

export default useApptype;
