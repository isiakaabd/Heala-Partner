import * as actionTypes from "store/action-types";
const initialState = {
  loading: true,
  authError: {},
  // isAuthenticated: false,
  healaID: null,
  id: localStorage.getItem("user_id"),
  userDetail: null,
  isAuthenticated: localStorage.getItem("auth") ? true : false,
  role: localStorage.getItem("role"),
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      localStorage.setItem("auth", true);
      localStorage.setItem("App_Token", action.payload.access_token);
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        authError: action.payload.messages,
      };
    case actionTypes.REFRESH_USER:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
      };
    case actionTypes.USER_DETAIL:
      // localStorage.setItem("role", action.payload);
      return {
        ...state,
        userDetail: action.payload,
        isAuthenticated: true,
        role: action.payload,
      };
    case actionTypes.LOGIN_FAILURE:
      localStorage.clear();
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        authError: action.payload,
      };
    case actionTypes.LOGOUT:
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        App_Token: null,
        userId: null,
        authError: {},
        dociId: null,
        role: null,
        healaID: null,
        id: null,
      };
    default:
      return state;
  }
};

export default authReducer;
