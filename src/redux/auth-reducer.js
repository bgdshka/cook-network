import { authAPI, securityAPI } from "../api/api";
import { stopSubmit } from "redux-form";

const SET_USER_DATA = "SET_USER_DATA";
const GET_CAPTCHA_URL_SUCCESS = "GET_CAPTCHA_URL_SUCCESS";

let initialState = {
  userId: null,
  email: null,
  login: null,
  isAuth: false,
  captchaUrl: null, //if null, then captcha is not required
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CAPTCHA_URL_SUCCESS:
    case SET_USER_DATA:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export const setAuthUserData = (userId, email, login, isAuth) => ({
  type: SET_USER_DATA,
  payload: { userId, email, login, isAuth },
});

export const getCaptchaUrlSuccess = (captchaUrl) => ({
  type: GET_CAPTCHA_URL_SUCCESS,
  payload: { captchaUrl },
});

export const getAuthUserData = () => async (dispatch) => {
  let data = await authAPI.me();
  if (data.resultCode === 0) {
    let { id, login, email } = data.data;
    dispatch(setAuthUserData(id, email, login, true));
  }
};

export const login = (email, password, rememberMe, captcha) => async (dispatch) => {
  let data = await authAPI.login(email, password, rememberMe, captcha);
  if (data.resultCode === 0) {
    // success, get auth data
    dispatch(getAuthUserData());
  } else {
    if (data.resultCode === 10) {
      dispatch(getCaptchaUrl());
    }
    let message = data.messages.length > 0 ? data.messages : "Some error";
    dispatch(stopSubmit("login", { _error: message }));
  }
};

export const getCaptchaUrl = () => async (dispatch) => {
  const response = await securityAPI.getCaptchaUrl();
  const captchaUrl = response.data.url;
  dispatch(getCaptchaUrlSuccess(captchaUrl));
};

export const logout = () => async (dispatch) => {
  let data = await authAPI.logout();
  if (data.resultCode === 0) {
    dispatch(setAuthUserData(null, null, null, false));
  }
};

export default authReducer;
