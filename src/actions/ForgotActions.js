import { NAVIGATION } from '@/constants';
import { ForgotController } from '@/controllers';
import { showError, showSuccess } from '@/hooks/message';
import * as RootNavigation from '@/navigation/RootNavigation';
export const TYPES = {
  CLEAR_STORE: 'CLEAR_STORE',
  FORGOT: 'FORGOT',
  FORGOT_REQUEST: 'FORGOT_REQUEST',
  FORGOT_ERROR: 'FORGOT_ERROR',
  FORGOT_SUCCESS: 'FORGOT_SUCCESS',

  TEMP: 'TEMP',
  TEMP_REQUEST: 'TEMP_REQUEST',
  TEMP_ERROR: 'TEMP_ERROR',
  TEMP_SUCCESS: 'TEMP_SUCCESS',

  FORGOT_PASS_RESET : 'FORGOT_PASS_RESET',
  FORGOT_PASS_RESET_REQUEST : 'FORGOT_PASS_RESET_REQUEST',
  FORGOT_PASS_RESET_SUCCESS : 'FORGOT_PASS_RESET_SUCCESS',
  FORGOT_PASS_RESET_ERROR : 'FORGOT_PASS_RESET_ERROR',

  FORGOT_CHECK_RESET_TOKEN : 'FORGOT_CHECK_RESET_TOKEN',
  FORGOT_CHECK_RESET_TOKEN_REQUEST : 'FORGOT_CHECK_RESET_TOKEN_REQUEST',
  FORGOT_CHECK_RESET_TOKEN_SUCCESS : 'FORGOT_CHECK_RESET_TOKEN_SUCCESS',
  FORGOT_CHECK_RESET_TOKEN_ERROR : 'FORGOT_CHECK_RESET_TOKEN_ERROR'
};


const forgotPasswordRequest = (payload) => ({
  type: TYPES.FORGOT_REQUEST,
  payload
});


const forgotPasswordSuccess = (payload) => ({
  type: TYPES.FORGOT_SUCCESS,
  payload: payload
})


const forgotPasswordError = (error) => ({
  type : TYPES.FORGOT_ERROR,
  payload : { error }
})

const tempPasswordRequest = (payload) => ({
  type: TYPES.FORGOT_REQUEST,
  payload
});


const tempPasswordSuccess = (payload) => ({
  type: TYPES.FORGOT_SUCCESS,
  payload: payload
})


const tempPasswordError = (error) => ({
  type : TYPES.FORGOT_ERROR,
  payload : { error }
})


const ForgotPassResetRequest = (payload) => ({
  type : TYPES.FORGOT_PASS_RESET_REQUEST,
  payload
})

const ForgotPassResetSuccess = (payload) => ({
  type : TYPES.FORGOT_PASS_RESET_SUCCESS,
  payload
})

const ForgotPassResetError = (error) => ({
  type : TYPES.FORGOT_PASS_RESET_ERROR,
  payload : {error}
})

const forgotCheckResetTokenRequest = (payload) => ({
  type : TYPES.FORGOT_CHECK_RESET_TOKEN_REQUEST,
  payload
});

const forgotCheckResetTokenSuccess = (payload) => ({
  type : TYPES.FORGOT_CHECK_RESET_TOKEN_SUCCESS,
  payload
});

const forgotCheckResetTokenError = (error) => ({
  type : TYPES.FORGOT_CHECK_RESET_TOKEN_ERROR,
  payload : {error}
});

const clearStore = () => ({
  type: TYPES.CLEAR_STORE,
  payload: null,
});

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(forgotPasswordRequest(email));
  try {
    const forgot = await ForgotController.request(email);
    if(forgot.status){
      dispatch(forgotPasswordSuccess(forgot));
      RootNavigation.navigate(NAVIGATION.forgotPasswordSuccess)
    }else{
      showError("Error", forgot.error)
      dispatch(forgotPasswordError(forgot));
    }
    
    // let payload = {
    //   username : email,
    //   session : forgot.code,
    //   type : 'forgot'
    // }
    // RootNavigation.navigate(NAVIGATION.resetPassword,payload)
    
    
  } catch (error) {
    dispatch(forgotPasswordError(error));
  }
};

export const tempPasswordReset = (email) => async (dispatch) => {
  dispatch(tempPasswordRequest(email));
  try {
    const tempPass = await ForgotController.requestTemp(email);
    if(tempPass.status){
      dispatch(tempPasswordSuccess(tempPass ));
      RootNavigation.navigate(NAVIGATION.forgotPasswordSuccess)
    }else{
      showError("Error", tempPass.error)
      dispatch(tempPasswordError(forgot));
    }
    
    // let payload = {
    //   username : email,
    //   session : forgot.code,
    //   type : 'forgot'
    // }
    // RootNavigation.navigate(NAVIGATION.resetPassword,payload)
    
    
  } catch (error) {
    dispatch(forgotPasswordError(error));
  }
};

export const ForgotPassReset = (payload) => async (dispatch) => {
  dispatch(ForgotPassResetRequest(payload));
  try {
    const forgot = await ForgotController.reset(payload);
    if(forgot.status){
      dispatch(ForgotPassResetSuccess(forgot));
      showSuccess("Success", forgot.message)
      RootNavigation.navigate(NAVIGATION.login)
    }else{
      showError("Error", forgot.error)
      dispatch(ForgotPassResetError(forgot));
    }
   
    
  } catch (error) {
    dispatch(ForgotPassResetError(error));
  }

};

export const forgotCheckResetToken = (payload) => async(dispatch) => {
  dispatch(forgotCheckResetTokenRequest(payload))
  try {
    const forgot = await ForgotController.validateToken(payload);
    if(forgot.status){
      dispatch(forgotCheckResetTokenSuccess(forgot));
      // showSuccess("Success", forgot.message)
      // RootNavigation.navigate(NAVIGATION.login)
    }else{
      showError("Error", forgot.error)
      dispatch(forgotCheckResetTokenError(forgot));
      RootNavigation.navigate(NAVIGATION.login)
    }
   
    
  } catch (error) {
    
    dispatch(forgotCheckResetTokenError(error));
    RootNavigation.navigate(NAVIGATION.login)
  }
}