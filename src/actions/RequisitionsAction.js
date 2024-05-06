import {RequisitionsController} from '@/controllers';
import {showSuccess, showError} from '@/hooks/message';
import * as RootNavigation from '@/navigation/RootNavigation';
import {NAVIGATION} from '@/constants';
export const TYPES = {
  CLEAR_STORE: 'CLEAR_STORE',

  // Requisitions list get
  LIST_REQUISITION: 'LIST_REQUISITION',
  LIST_REQUISITION_REQUEST: 'LIST_REQUISITION_REQUEST',
  LIST_REQUISITION_SUCCESS: 'LIST_REQUISITION_SUCCESS',
  LIST_REQUISITION_ERROR: 'LIST_REQUISITION_ERROR',

  // Requisitions list get
  REQUISITION_DETAILS: 'REQUISITION_DETAILS',
  REQUISITION_DETAILS_REQUEST: 'REQUISITION_DETAILS_REQUEST',
  REQUISITION_DETAILS_SUCCESS: 'REQUISITION_DETAILS_SUCCESS',
  REQUISITION_DETAILS_ERROR: 'REQUISITION_DETAILS_ERROR',
};

export const toggleLoader = payload => ({
  type: TYPES.TOGGLE_LOADER,
  payload: payload,
});

// Requisitions
const listRequisitionsRequest = payload => ({
  type: TYPES.LIST_REQUISITION_REQUEST,
  payload,
});

const listRequisitionsSuccess = payload => ({
  type: TYPES.LIST_REQUISITION_SUCCESS,
  payload,
});

const listRequisitionsError = error => ({
  type: TYPES.LIST_REQUISITION_ERROR,
  payload: {error},
});

// requisitionDetails
const requisitionDetailsRequest = payload => ({
  type: TYPES.REQUISITION_DETAILS_REQUEST,
  payload,
});

const requisitionDetailsSuccess = payload => ({
  type: TYPES.REQUISITION_DETAILS_SUCCESS,
  payload,
});

const requisitionDetailsError = error => ({
  type: TYPES.REQUISITION_DETAILS_ERROR,
  payload: {error},
});

// Requisitions
export const listRequisitionList = cb => async dispatch => {
  dispatch(listRequisitionsRequest());
  try {
    const list = await RequisitionsController.listRequisitions();

    dispatch(listRequisitionsSuccess(list));
    if (cb) {
      cb(list);
    }
  } catch (error) {
    dispatch(listRequisitionsError(error));
  }
};
// requisitionDetails
export const requisitionDetails = (payload,cb) => async dispatch => {

  dispatch(requisitionDetailsRequest());
  try {
    const list = await RequisitionsController.requisitionDetails(payload);
    dispatch(requisitionDetailsSuccess(list));
    if (cb) {
      cb(list);
    }
  } catch (error) {
    dispatch(requisitionDetailsError(error));
  }
};
