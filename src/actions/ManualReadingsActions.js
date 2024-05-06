import {NAVIGATION} from '@/constants';
import {ManualReadingsController} from '@/controllers';
import {showError, showSuccess} from '@/hooks/message';
import * as RootNavigation from '@/navigation/RootNavigation';

export const TYPES = {
  CLEAR_STORE: 'CLEAR_STORE',

  LIST_DEVICES: 'LIST_DEVICES',
  LIST_DEVICES_REQUEST: 'LIST_DEVICES_REQUEST',
  LIST_DEVICES_SUCCESS: 'LIST_DEVICES_SUCCESS',
  LIST_DEVICES_ERROR: 'LIST_DEVICES_ERROR',

  ADD_MANUAL_READINGS: 'ADD_MANUAL_READINGS',
  ADD_MANUAL_READINGS_REQUEST: 'ADD_MANUAL_READINGS_REQUEST',
  ADD_MANUAL_READINGS_ERROR: 'ADD_MANUAL_READINGS_ERROR',
  ADD_MANUAL_READINGS_SUCCESS: 'ADD_MANUAL_READINGS_SUCCESS',

  LIST_READINGS: 'LIST_READINGS',
  LIST_READINGS_REQUEST: 'LIST_READINGS_REQUEST',
  LIST_READINGS_SUCCESS: 'LIST_READINGS_SUCCESS',
  LIST_READINGS_ERROR: 'LIST_READINGS_ERROR',

  PREVIOUS_READINGS: 'PREVIOUS_READINGS',
  PREVIOUS_READINGS_REQUEST: 'PREVIOUS_READINGS_REQUEST',
  PREVIOUS_READINGS_SUCCESS: 'PREVIOUS_READINGS_SUCCESS',
  PREVIOUS_READINGS_ERROR: 'PREVIOUS_READINGS_ERROR',

  ALL_READINGS: 'ALL_READINGS',
  ALL_READINGS_REQUEST: 'ALL_READINGS_REQUEST',
  ALL_READINGS_SUCCESS: 'ALL_READINGS_SUCCESS',
  ALL_READINGS_ERROR: 'ALL_READINGS_ERROR',
};

const listDevicesRequest = payload => ({
  type: TYPES.LIST_DEVICES_REQUEST,
  payload,
});

const listDevicesSuccess = payload => ({
  type: TYPES.LIST_DEVICES_SUCCESS,
  payload,
});

const listDevicesError = error => ({
  type: TYPES.LIST_DEVICES_ERROR,
  payload: {error},
});

const addManualReadingsRequest = payload => ({
  type: TYPES.ADD_MANUAL_READINGS_REQUEST,
  payload,
});

const addManualReadingsSuccess = payload => ({
  type: TYPES.ADD_MANUAL_READINGS_SUCCESS,
  payload,
});

const addManualReadingsError = error => ({
  type: TYPES.ADD_MANUAL_READINGS_ERROR,
  payload: {error},
});

const listManualReadingsRequest = payload => ({
  type: TYPES.LIST_READINGS_REQUEST,
  payload,
});

const listManualReadingsSuccess = payload => ({
  type: TYPES.LIST_READINGS_SUCCESS,
  payload,
});

const listManualReadingsError = error => ({
  type: TYPES.LIST_READINGS_ERROR,
  payload: {error},
});

const listPreviousReadingsRequest = payload => ({
  type: TYPES.PREVIOUS_READINGS_REQUEST,
  payload,
});

const listPreviousReadingsSuccess = payload => ({
  type: TYPES.PREVIOUS_READINGS_SUCCESS,
  payload,
});

const listPreviousReadingsError = error => ({
  type: TYPES.PREVIOUS_READINGS_ERROR,
  payload: {error},
});

const listAllReadingsRequest = payload => ({
  type: TYPES.ALL_READINGS_REQUEST,
  payload,
});

const listAllReadingsSuccess = payload => ({
  type: TYPES.ALL_READINGS_SUCCESS,
  payload,
});

const listAllReadingsError = error => ({
  type: TYPES.ALL_READINGS_ERROR,
  payload: {error},
});

export const listDevices = payload => async dispatch => {
  dispatch(listDevicesRequest(payload));
  try {
    const list = await ManualReadingsController.listDevices(payload);
    dispatch(listDevicesSuccess(list));
  } catch (error) {
    dispatch(listDevicesError(error));
  }
};

export const addManualReadings = payload => async dispatch => {
  dispatch(addManualReadingsRequest(payload));
  try {
    const add = await ManualReadingsController.add(payload);
    if (add.status) {
      showSuccess(add.message);
      dispatch(addManualReadingsSuccess(add));
      RootNavigation.navigate(NAVIGATION.vitalMonitoring, {
        device: false,
        manual: true,
      });
    } else {
      showError('Add Reading Error');
      dispatch(addManualReadingsError(add));
    }
  } catch (error) {
    dispatch(addManualReadingsError(error));
  }
};

export const listManualReadings = payload => async dispatch => {
  dispatch(listManualReadingsRequest(payload));
  try {
    // const list = await ManualReadingsController.list(payload);
    const list = await ManualReadingsController.getReadings(payload);
    dispatch(listManualReadingsSuccess(list));
  } catch (error) {
    dispatch(listManualReadingsError(error));
  }
};

export const listPreviousReadings = payload => async dispatch => {
  dispatch(listPreviousReadingsRequest(payload));
  try {
    const list = await ManualReadingsController.listPrevious(payload);
    dispatch(listPreviousReadingsSuccess(list));
  } catch (error) {
    dispatch(listPreviousReadingsError(error));
  }
};
export const listAllReadings = payload => async dispatch => {
  dispatch(listAllReadingsRequest(payload));
  try {
    const list = await ManualReadingsController.listAll(payload);
    dispatch(listAllReadingsSuccess(list));
  } catch (error) {
    dispatch(listAllReadingsError(error));
  }
};
