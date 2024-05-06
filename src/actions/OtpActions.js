import {OtpController} from '@/controllers';
import {loginSuccess} from '@/actions/UserActions';
import {showError, showSuccess} from '@/hooks/message';
import * as RootNavigation from '@/navigation/RootNavigation';
import {NAVIGATION} from '@/constants';
import {login} from '@/actions/UserActions';
import {Validate} from '@/helpers';

export const TYPES = {
  CLEAR_STORE: 'CLEAR_STORE',
  OTP_VERIFICATION: 'OTP_VERIFICATION',
  OTP_VERIFICATION_REQUEST: 'OTP_VERIFICATION_REQUEST',
  OTP_VERIFICATION_ERROR: 'OTP_VERIFICATION_ERROR',
  OTP_VERIFICATION_SUCCESS: 'OTP_VERIFICATION_SUCCESS',

  OTP_VERIFICATION_MFA: 'OTP_VERIFICATION_MFA',
  OTP_VERIFICATION_MFA_REQUEST: 'OTP_VERIFICATION_MFA_REQUEST',
  OTP_VERIFICATION_MFA_SUCCESS: 'OTP_VERIFICATION_MFA_SUCCESS',
  OTP_VERIFICATION_MFA_ERROR: 'OTP_VERIFICATION_MFA_ERROR',
};

const OtpVerificationRequest = payload => ({
  type: TYPES.OTP_VERIFICATION_REQUEST,
  payload,
});

const OtpVerificationSuccess = payload => ({
  type: TYPES.OTP_VERIFICATION_SUCCESS,
  payload: payload,
});

const OtpVerificationError = error => ({
  type: TYPES.OTP_VERIFICATION_ERROR,
  payload: {error},
});

const otpVerificationMfaRequest = payload => ({
  type: TYPES.OTP_VERIFICATION_MFA_REQUEST,
  payload,
});

const otpVerificationMfaSuccess = payload => ({
  type: TYPES.OTP_VERIFICATION_MFA_SUCCESS,
  payload,
});

const otpVerificationMfaError = error => ({
  type: TYPES.OTP_VERIFICATION_MFA_ERROR,
  payload: {error},
});

const clearStore = () => ({
  type: TYPES.CLEAR_STORE,
  payload: null,
});

export const OtpVerification = (username, code, password) => async dispatch => {
  dispatch(OtpVerificationRequest({username, code}));
  try {
    const forgot = await OtpController.request(username, code);
    if (forgot.status) {
      dispatch(OtpVerificationSuccess(forgot));
      showSuccess(forgot.message);
      if (password != '') {
        let request = {
          username: username,
          password,
        };
        dispatch(login(request));
      } else {
        RootNavigation.navigate(NAVIGATION.resetPassword, {
          username: Validate.decryptInput(username),
          session: '',
          type: 'link_reset',
        });
      }

      //
    } else {
      showError('Error Otp', 'Error verify otp.');
    }
  } catch (error) {
    dispatch(OtpVerificationError(error));
  }
};

export const otpVerificationMfa = payload => async dispatch => {
  dispatch(otpVerificationMfaRequest(payload));
  try {
    const mfa = await OtpController.mfa(payload);
    if (mfa.status) {
      dispatch(otpVerificationMfaSuccess(mfa));
      dispatch(loginSuccess(mfa));
      showSuccess('Success', mfa.message);
    } else {
      dispatch(otpVerificationMfaError(mfa));
      showError('Error Otp', 'Error verify otp.');
    }
  } catch (error) {
    dispatch(otpVerificationMfaError(error));
  }
};
