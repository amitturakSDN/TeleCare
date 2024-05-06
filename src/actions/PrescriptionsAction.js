import {PrescriptionsController} from '@/controllers';
import {showSuccess, showError} from '@/hooks/message';
import * as RootNavigation from '@/navigation/RootNavigation';
import {NAVIGATION} from '@/constants';
export const TYPES = {
  CLEAR_STORE: 'CLEAR_STORE',

  // Prescriptions list get
  LIST_PRESCRIPTION: 'LIST_PRESCRIPTION',
  LIST_PRESCRIPTION_REQUEST: 'LIST_PRESCRIPTION_REQUEST',
  LIST_PRESCRIPTION_SUCCESS: 'LIST_PRESCRIPTION_SUCCESS',
  LIST_PRESCRIPTION_ERROR: 'LIST_PRESCRIPTION_ERROR',

  // Prescriptions list get
  PRESCRIPTION_DETAILS: 'PRESCRIPTION_DETAILS',
  PRESCRIPTION_DETAILS_REQUEST: 'PRESCRIPTION_DETAILS_REQUEST',
  PRESCRIPTION_DETAILS_SUCCESS: 'PRESCRIPTION_DETAILS_SUCCESS',
  PRESCRIPTION_DETAILS_ERROR: 'PRESCRIPTION_DETAILS_ERROR',
};

export const toggleLoader = payload => ({
  type: TYPES.TOGGLE_LOADER,
  payload: payload,
});

// Prescriptions
const listPrescriptionsRequest = payload => ({
  type: TYPES.LIST_PRESCRIPTION_REQUEST,
  payload,
});

const listPrescriptionsSuccess = payload => ({
  type: TYPES.LIST_PRESCRIPTION_SUCCESS,
  payload,
});

const listPrescriptionsError = error => ({
  type: TYPES.LIST_PRESCRIPTION_ERROR,
  payload: {error},
});

// prescriptionsDetails
const prescriptionsDetailsRequest = payload => ({
  type: TYPES.PRESCRIPTION_DETAILS_REQUEST,
  payload,
});

const prescriptionsDetailsSuccess = payload => ({
  type: TYPES.PRESCRIPTION_DETAILS_SUCCESS,
  payload,
});

const prescriptionsDetailsError = error => ({
  type: TYPES.PRESCRIPTION_DETAILS_ERROR,
  payload: {error},
});

// Prescriptions
export const listPrescriptionsList = cb => async dispatch => {
  dispatch(listPrescriptionsRequest());
  try {
    const list = await PrescriptionsController.listPrescriptions();
    dispatch(listPrescriptionsSuccess(list));
    if (cb) {
      cb(list);
    }
  } catch (error) {
    dispatch(listPrescriptionsError(error));
  }
};
// prescriptionsDetails
export const prescriptionsDetails = (payload, cb) => async dispatch => {
  dispatch(prescriptionsDetailsRequest());
  try {
    const list = await PrescriptionsController.prescriptionsDetails(payload);
    dispatch(prescriptionsDetailsSuccess(list));
    if (cb) {
      cb(list);
    }
  } catch (error) {
    dispatch(prescriptionsDetailsError(error));
  }
};
