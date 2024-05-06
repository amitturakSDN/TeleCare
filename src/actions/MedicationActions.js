import {MedicationController} from '@/controllers';
import { showSuccess, showError } from '@/hooks/message';
export const TYPES = {
  CLEAR_STORE: 'CLEAR_STORE',
  LIST_MEDICATION: 'LIST_MEDICATION',
  LIST_MEDICATION_REQUEST: 'LIST_MEDICATION_REQUEST',
  LIST_MEDICATION_SUCCESS: 'LIST_MEDICATION_SUCCESS',
  LIST_MEDICATION_ERROR: 'LIST_MEDICATION_ERROR',
  UPDATE_MEDICATION: 'UPDATE_MEDICATION',
  UPDATE_MEDICATION_REQUEST: 'UPDATE_MEDICATION_REQUEST',
  UPDATE_MEDICATION_SUCCESS: 'UPDATE_MEDICATION_SUCCESS',
  UPDATE_MEDICATION_ERROR: 'UPDATE_MEDICATION_ERROR',
};

const listMedicationRequest = payload => ({
  type: TYPES.LIST_MEDICATION_REQUEST,
  payload,
});

const listMedicationSuccess = payload => ({
  type: TYPES.LIST_MEDICATION_SUCCESS,
  payload,
});

const listMedicationError = error => ({
  type: TYPES.LIST_MEDICATION_ERROR,
  payload: {error},
});

const updateMedicationRequest = payload => ({
  type: TYPES.UPDATE_MEDICATION_REQUEST,
  payload,
});

const updateMedicationSuccess = payload => ({
  type: TYPES.UPDATE_MEDICATION_SUCCESS,
  payload,
});

const updateMedicationError = error => ({
  type: TYPES.UPDATE_MEDICATION_ERROR,
  payload: {error},
});

export const listMedicationByDate = payload => async dispatch => {
  dispatch(listMedicationRequest(payload));
  try {
    const list = await MedicationController.list(payload);
    dispatch(listMedicationSuccess(list));
  } catch (error) {
    dispatch(listMedicationError(error));
  }
};

export const updateMedication = payload => async dispatch => {
  dispatch(updateMedicationRequest(payload));
  try {
    const add = await MedicationController.update(payload);
    if (add.status) {
      showSuccess(add.message);
      dispatch(updateMedicationSuccess(add));
      dispatch(
        listMedicationByDate({
          date: payload.request.date
        }),
      );
    } else {
      showError('Update Medication Error');
      dispatch(updateMedicationError(add));
    }
  } catch (error) {
    dispatch(updateMedicationError(error));
  }
};
