import React from "react";
import appTypeReducer, { initialState } from "./appTypeReducer";

const AppTypeContext = React.createContext();

export const AppTypeProvider = ({ children }) => {
  const [type, dispatch] = React.useReducer(appTypeReducer, initialState);

  const changeAppType = (type) => {
    dispatch({
      type: "CHANGE_APP_TYPE",
      payLoad: {
        appType: type,
      },
    });
  };
  return (
    <AppTypeContext.Provider value={{ type, changeAppType }}>
      {children}
    </AppTypeContext.Provider>
  );
};

export default AppTypeContext;
