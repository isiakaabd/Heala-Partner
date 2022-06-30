export const initialState = "";

const appTypeReducer = (state, action) => {
  const { type, payLoad } = action;

  switch (type) {
    case "CHANGE_APP_TYPE":
      return payLoad.appType;

    default:
      return state;
  }
};

export default appTypeReducer;
