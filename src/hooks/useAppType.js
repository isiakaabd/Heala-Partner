import React from "react";
import AppTypeContext from "store/contexts/AppTypeContext";

const useApptype = () => {
  const context = React.useContext(AppTypeContext);

  if (context === undefined) {
    throw new Error("useAppType must be used within AppTypeContext");
  }

  return context;
};

export default useApptype;
