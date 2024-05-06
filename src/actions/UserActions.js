import {NAVIGATION} from '@/constants';
import {UserController, SignupRelativeController} from '@/controllers';
import {NavigationHelper, Validate} from '@/helpers';
import {showError, showSuccess} from '@/hooks/message';
import * as RootNavigation from '@/navigation/RootNavigation';
import {getDiscoverOrganisation} from './ProfileActions';

export const TYPES = {
  CLEAR_STORE: 'CLEAR_STORE',
  LOGIN: 'LOGIN',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_OTP_SUCCESS: 'LOGIN_OTP_SUCCESS',

  LOGIN_VERIFY_EMAIL_SUCCESS: 'LOGIN_VERIFY_EMAIL_SUCCESS',
  LOGIN_RESET_TEMP_PASS_SUCCESS: 'LOGIN_RESET_TEMP_PASS_SUCCESS',

  LOGIN_CHANGE_TEMP_PASSWORD: 'LOGIN_CHANGE_TEMP_PASSWORD',
  LOGIN_CHANGE_TEMP_PASSWORD_REQUEST: 'LOGIN_CHANGE_TEMP_PASSWORD_REQUEST',
  LOGIN_CHANGE_TEMP_PASSWORD_SUCCESS: 'LOGIN_CHANGE_TEMP_PASSWORD_SUCCESS',
  LOGIN_CHANGE_TEMP_PASSWORD_ERROR: 'LOGIN_CHANGE_TEMP_PASSWORD_ERROR',

  RELATIVE_SIGNUP: 'RELATIVE_SIGNUP',
  RELATIVE_SIGNUP_REQUEST: 'RELATIVE_SIGNUP_REQUEST',
  RELATIVE_SIGNUP_SUCCESS: 'RELATIVE_SIGNUP_SUCCESS',
  RELATIVE_SIGNUP_ERROR: 'RELATIVE_SIGNUP_ERROR',

  DEVICE_TOKEN_REQUEST: 'DEVICE_TOKEN_REQUEST',
  DEVICE_TOKEN_ERROR: 'DEVICE_TOKEN_ERROR',
  DEVICE_TOKEN_SUCCESS: 'DEVICE_TOKEN_SUCCESS',

  TOGGLE_LOADER: 'TOGGLE_LOADER',
};

const loginRequest = payload => ({
  type: TYPES.LOGIN_REQUEST,
  payload,
});

export const loginSuccess = user => ({
  type: TYPES.LOGIN_SUCCESS,
  payload: {user},
});

const loginError = error => ({
  type: TYPES.LOGIN_ERROR,
  payload: {error},
});

const deviceTokenRequest = payload => ({
  type: TYPES.DEVICE_TOKEN_REQUEST,
  payload,
});

export const deviceTokenSuccess = user => ({
  type: TYPES.DEVICE_TOKEN_SUCCESS,
  payload: {user},
});

const deviceTokenError = error => ({
  type: TYPES.DEVICE_TOKEN_ERROR,
  payload: {error},
});

const loginOtpSuccess = payload => ({
  type: TYPES.LOGIN_OTP_SUCCESS,
  payload,
});

const loginVerifyEmailSuccess = payload => ({
  type: TYPES.LOGIN_VERIFY_EMAIL_SUCCESS,
  payload,
});

const loginResetTempPassSuccess = payload => ({
  type: TYPES.LOGIN_RESET_TEMP_PASS_SUCCESS,
  payload,
});

const loginChangeTempPasswordRequest = payload => ({
  type: TYPES.LOGIN_CHANGE_TEMP_PASSWORD_REQUEST,
  payload,
});

const loginChangeTempPasswordSuccess = payload => ({
  type: TYPES.LOGIN_CHANGE_TEMP_PASSWORD_SUCCESS,
  payload,
});

const loginChangeTempPasswordError = error => ({
  type: TYPES.LOGIN_CHANGE_TEMP_PASSWORD_ERROR,
  payload: {error},
});

const relativeSignUpRequest = payload => ({
  type: TYPES.RELATIVE_SIGNUP_REQUEST,
  payload,
});

const relativeSignUpSuccess = payload => ({
  type: TYPES.RELATIVE_SIGNUP_SUCCESS,
  payload,
});

const relativeSignUpError = error => ({
  type: TYPES.RELATIVE_SIGNUP_ERROR,
  payload: {error},
});

const clearStore = () => ({
  type: TYPES.CLEAR_STORE,
  payload: null,
});

export const login = payload => async dispatch => {
  dispatch(loginRequest(payload));
  try {
    const user = await UserController.login(payload);
    const request = payload;
    const {authType, status, message} = user;
    if (status) {
      if (authType == 'mfa') {
        dispatch(loginSuccess({}));
        dispatch(loginOtpSuccess(user));
        showSuccess('Success', message);
        RootNavigation.navigate(NAVIGATION.otpVerification, {
          ...Validate.decryptInput(payload),
          authType,
        });
      } else if (authType == 'verify') {
        dispatch(loginVerifyEmailSuccess(user));
        dispatch(loginSuccess({}));
        showSuccess(message);
        RootNavigation.navigate(NAVIGATION.otpVerification, {
          ...Validate.decryptInput(payload),
          authType,
        });
      } else if (authType == 'reset') {
        dispatch(loginResetTempPassSuccess(user));
        dispatch(loginSuccess({}));
        let payload = {
          username: Validate.decryptInput(request.username),
          session: user.session,
          type: 'reset',
        };
        RootNavigation.navigate(NAVIGATION.resetPassword, payload);
      } else if (authType == 'expire') {
        dispatch(loginSuccess({}));
        showSuccess('Success', message);
        let payload = {
          email: Validate.decryptInput(request.email),
        };
        RootNavigation.navigate(NAVIGATION.resetTempPassword, payload);
      } else if (authType == 'success') {
        let orgId = user?.user?.orgId;
        dispatch(loginSuccess(user));
        dispatch(getDiscoverOrganisation(orgId));
      } else {
        dispatch(loginError('Login Error Exception'));
      }
      return;
    }
    showError('Login Error', 'Something wrong');
    dispatch(loginError('Login Error'));
  } catch (error) {
    dispatch(loginError(error));
    if (error?.error) showError('Error', error.error);
    if (error?.message) showError('Error', error.message);
  }
};

export const loginChangeTempPassword = payload => async dispatch => {
  dispatch(loginChangeTempPasswordRequest(payload));
  try {
    const changePass = await UserController.changeTempPassword(payload);
    if (changePass.status) {
      showSuccess('Success', changePass.message);
      dispatch(loginChangeTempPasswordSuccess(changePass));
      dispatch(loginSuccess(changePass));
    } else {
      showError('Error', changePass.message);
      dispatch(
        loginChangeTempPasswordError('Exception error changing password.'),
      );
    }
  } catch (error) {
    if (error?.error) showError('Error', error.error);
    if (error?.message) showError('Error', error.message);
    dispatch(loginChangeTempPasswordError(error));
  }
};

export const relativeSignUp = payload => async dispatch => {
  dispatch(relativeSignUpRequest(payload));
  try {
    const signup = await SignupRelativeController.signup(payload);
    if (signup.status) {
      dispatch(relativeSignUpSuccess(signup));
      showSuccess('Success', signup.message);
      NavigationHelper.navigate(NAVIGATION.login);
    } else {
      dispatch(relativeSignUpError(signup));
      // NavigationHelper.navigate()
    }
  } catch (error) {
    dispatch(relativeSignUpError(error));
  }
};

export const getDeviceToken = payload => async dispatch => {
  dispatch(deviceTokenRequest(payload));
  try {
    const data = await UserController.postToken(payload);
    if (data.status) {
      dispatch(deviceTokenSuccess(data));
    } else {
      dispatch(deviceTokenError(data));
    }
  } catch (error) {
    dispatch(deviceTokenError(data));
  }
};

export const logout = () => async dispatch => {
  try {
    await UserController.logout();
  } finally {
    dispatch(clearStore());
  }
};

export const checkRelativeStatus = (payload, cb) => async dispatch => {
  try {
    const relatedResponse = await UserController.checkRelatedPerson(payload);
    if (relatedResponse.status) {
      cb(true);
    } else {
      cb(false);
    }
    console.log(relatedResponse, 'relatedResponse.......');
  } catch (error) {
    cb(false);
    if (error?.error) showError('Error', error.error);
    if (error?.message) showError('Error', error.message);
  }
};

export const setUserData = (payload, cb) => async dispatch => {
  // dispatch(loginRequest(payload));
  try {
    const user = await UserController.login(payload);
    const request = payload;
    const {authType, status, message} = user;
    console.log(user, 'user......');
    if (authType == 'reset') {
      cb({status: true, session: user.session});
    } else if (authType == 'success') {
      showError(
        'Error',
        'User has already reset the temporary Password. Kindly login',
      );
      cb({status: false});
      // NavigationHelper.navigate(NAVIGATION.login);
    }
  } catch (error) {
    dispatch(loginError(error));
    if (error?.error) showError('Error', error.error);
    if (error?.message) showError('Error', error.message);
  }
};
