import {ProgramsController} from '@/controllers';
import {showSuccess} from '@/hooks/message';

export const TYPES = {
  CLEAR_STORE: 'CLEAR_STORE',

  PROGRAMS_LISTING: 'PROGRAMS_LISTING',
  PROGRAMS_LISTING_REQUEST: 'PROGRAMS_LISTING_REQUEST',
  PROGRAMS_LISTING_SUCCESS: 'PROGRAMS_LISTING_SUCCESS',
  PROGRAMS_LISTING_ERROR: 'PROGRAMS_LISTING_ERROR',
};

const programsListingRequest = payload => ({
  type: TYPES.PROGRAMS_LISTING_REQUEST,
  payload,
});

const programsListingSuccess = payload => ({
  type: TYPES.PROGRAMS_LISTING_SUCCESS,
  payload,
});

const programsListingError = error => ({
  type: TYPES.PROGRAMS_LISTING_ERROR,
  payload: {error},
});

export const getHistoryProgram = payload => async dispatch => {
  dispatch(programsListingRequest(payload));
  try {
    const list = await ProgramsController.list(payload);

    dispatch(programsListingSuccess(list));
    showSuccess(list.message);
  } catch (error) {
    dispatch(programsListingError(error));
  }
};
