import {ProfileController} from '@/controllers';
import {showError, showSuccess} from '@/hooks/message';
import {NavigationHelper} from '@/helpers';
import {NAVIGATION} from '@/constants';
import {AuthHelper, Validate} from '@/helpers';

import {loginSuccess} from '@/actions/UserActions';
export const TYPES = {
  CLEAR_STORE: 'CLEAR_STORE',

  PROFILE_DETAIL: 'PROFILE_DETAIL',
  PROFILE_DETAIL_REQUEST: 'PROFILE_DETAIL_REQUEST',
  PROFILE_DETAIL_ERROR: 'PROFILE_DETAIL_ERROR',
  PROFILE_DETAIL_SUCCESS: 'PROFILE_DETAIL_SUCCESS',

  PROFILE_UPDATE: 'PROFILE_UPDATE',
  PROFILE_UPDATE_REQUEST: 'PROFILE_UPDATE_REQUEST',
  PROFILE_UPDATE_SUCCESS: 'PROFILE_UPDATE_SUCCESS',
  PROFILE_UPDATE_ERROR: 'PROFILE_UPDATE_ERROR',

  PROFILE_RELATED_PERSON: 'PROFILE_RELATED_PERSON',
  PROFILE_RELATED_PERSON_REQUEST: 'PROFILE_RELATED_PERSON_REQUEST',
  PROFILE_RELATED_PERSON_ERROR: 'PROFILE_RELATED_PERSON_ERROR',
  PROFILE_RELATED_PERSON_SUCCESS: 'PROFILE_RELATED_PERSON_SUCCESS',

  PROFILE_SELECT: 'PROFILE_SELECT',
  PROFILE_SELECT_REQUEST: 'PROFILE_SELECT_REQUEST',
  PROFILE_SELECT_SUCCESS: 'PROFILE_SELECT_SUCCESS',
  PROFILE_SELECT_ERROR: 'PROFILE_SELECT_ERROR',

  PROFILE_INVITE_RELATIVE: 'PROFILE_INVITE_RELATIVE',
  PROFILE_INVITE_RELATIVE_REQUEST: 'PROFILE_INVITE_RELATIVE_REQUEST',
  PROFILE_INVITE_RELATIVE_SUCCESS: 'PROFILE_INVITE_RELATIVE_SUCCESS',
  PROFILE_INVITE_RELATIVE_ERROR: 'PROFILE_INVITE_RELATIVE_ERROR',

  PROFILE_DELETE_RELATIVE: 'PROFILE_DELETE_RELATIVE',
  PROFILE_DELETE_RELATIVE_REQUEST: 'PROFILE_DELETE_RELATIVE_REQUEST',
  PROFILE_DELETE_RELATIVE_SUCCESS: 'PROFILE_DELETE_RELATIVE_SUCCESS',
  PROFILE_DELETE_RELATIVE_ERROR: 'PROFILE_DELETE_RELATIVE_ERROR',

  PROFILE_UPDATE_INVITATION: 'PROFILE_UPDATE_INVITATION',
  PROFILE_UPDATE_INVITATION_REQUEST: 'PROFILE_UPDATE_INVITATION_REQUEST',
  PROFILE_UPDATE_INVITATION_SUCCESS: 'PROFILE_UPDATE_INVITATION_SUCCESS',
  PROFILE_UPDATE_INVITATION_ERROR: 'PROFILE_UPDATE_INVITATION_ERROR',

  ORGANIZATION_DETAIL: 'ORGANIZATION_DETAIL',
  ORGANIZATION_DETAIL_REQUEST: 'ORGANIZATION_DETAIL_REQUEST',
  ORGANIZATION_DETAIL_ERROR: 'ORGANIZATION_DETAIL_ERROR',
  ORGANIZATION_DETAIL_SUCCESS: 'ORGANIZATION_DETAIL_SUCCESS',
  DISCOVER_ORGANISATION: 'DISCOVER_ORGANISATION',
};

const profileUpdateInvitationRequest = payload => ({
  type: TYPES.PROFILE_UPDATE_INVITATION_REQUEST,
  payload,
});

const profileUpdateInvitationSuccess = payload => ({
  type: TYPES.PROFILE_UPDATE_INVITATION_SUCCESS,
  payload,
});

const profileUpdateInvitationError = error => ({
  type: TYPES.PROFILE_UPDATE_INVITATION_ERROR,
  payload: {error},
});

const profileDetailRequest = payload => ({
  type: TYPES.PROFILE_DETAIL_REQUEST,
  payload,
});

const profileDetailSuccess = payload => ({
  type: TYPES.PROFILE_DETAIL_SUCCESS,
  payload,
});

const profileDetailError = error => ({
  type: TYPES.PROFILE_DETAIL_ERROR,
  payload: {error},
});

const profileUpdateRequest = payload => ({
  type: TYPES.PROFILE_UPDATE_REQUEST,
  payload,
});

const profileUpdateSuccess = payload => ({
  type: TYPES.PROFILE_UPDATE_SUCCESS,
  payload,
});

const profileUpdatError = error => ({
  type: TYPES.PROFILE_UPDATE_ERROR,
  payload: {error},
});

const profileRelatedPersonRequest = payload => ({
  type: TYPES.PROFILE_RELATED_PERSON_REQUEST,
  payload,
});

const profileRelatedPersonSuccess = payload => ({
  type: TYPES.PROFILE_RELATED_PERSON_SUCCESS,
  payload,
});

const profileRelatedPersonError = error => ({
  type: TYPES.PROFILE_RELATED_PERSON_ERROR,
  payload: {error},
});

const profileSelectRequest = payload => ({
  type: TYPES.PROFILE_SELECT,
  payload,
});

const profileSelectSuccess = payload => ({
  type: TYPES.PROFILE_SELECT_SUCCESS,
  payload,
});

const profileSelectError = error => ({
  type: TYPES.PROFILE_SELECT_ERROR,
  payload: {error},
});

const profileInviteRelativeRequest = payload => ({
  type: TYPES.PROFILE_INVITE_RELATIVE_REQUEST,
  payload,
});

const profileInviteRelativeSuccess = payload => ({
  type: TYPES.PROFILE_INVITE_RELATIVE_SUCCESS,
  payload,
});

const profileInviteRelativeError = error => ({
  type: TYPES.PROFILE_INVITE_RELATIVE_ERROR,
  payload: {error},
});

const profileDeleteRelativeRequest = payload => ({
  type: TYPES.PROFILE_DELETE_RELATIVE_REQUEST,
  payload,
});

const profileDeleteRelativeSuccess = payload => ({
  type: TYPES.PROFILE_DELETE_RELATIVE_SUCCESS,
  payload,
});

const profileDeleteRelativeError = error => ({
  type: TYPES.PROFILE_DELETE_RELATIVE_ERROR,
  payload: {error},
});

const organizationDetailRequest = payload => ({
  type: TYPES.ORGANIZATION_DETAIL_REQUEST,
  payload,
});

const organizationDetailSuccess = payload => ({
  type: TYPES.ORGANIZATION_DETAIL_SUCCESS,
  payload,
});

const organizationDetailError = error => ({
  type: TYPES.ORGANIZATION_DETAIL_ERROR,
  payload: {error},
});

const clearStore = () => ({
  type: TYPES.CLEAR_STORE,
  payload: null,
});

const setOrganisationDiscover = payload => ({
  type: TYPES.DISCOVER_ORGANISATION,
  payload,
});

export const profileDetail = id => async dispatch => {
  dispatch(profileDetailRequest(id));
  try {
    const detail = await ProfileController.detail(id);
    if (detail.status) dispatch(profileDetailSuccess(detail));
    else {
      showError('Profile Detail Error', detail.error);
      dispatch(profileDetailError(detail));
    }
  } catch (error) {
    dispatch(profileDetailError(error));
  }
};

export const profileUpdate = payload => async dispatch => {
  dispatch(profileUpdateRequest(payload));
  try {
    let id = payload.id;
    const update = await ProfileController.update(payload);
    if (update.status)
      dispatch(profileUpdateSuccess(update)) &&
        dispatch(profileDetail(id)) &&
        showSuccess('Success', update.message);
    else {
      showError('Profile Detail Error', update.error);
      dispatch(profileUpdatError(update));
    }
  } catch (error) {
    dispatch(profileUpdatError(error));
  }
};

export const profileRelatedPerson = patientRefId => async dispatch => {
  dispatch(profileRelatedPersonRequest(patientRefId));
  try {
    const related = await ProfileController.related(patientRefId);
    if (related.status) dispatch(profileRelatedPersonSuccess(related));
    // dispatch(profileDetail(payload.id)) && showSuccess("Success", related.message)
    else {
      showError('Profile Related Error', related.error);
      dispatch(profileRelatedPersonError(related));
    }
  } catch (error) {
    dispatch(profileRelatedPersonError(error));
  }
};

export const profileSelect = payload => async dispatch => {
  dispatch(profileSelectRequest(payload));
  try {
    dispatch(profileSelectSuccess(payload));
  } catch (error) {
    dispatch(profileSelectError(error));
  }
};

export const profileInviteRelative = payload => async dispatch => {
  dispatch(profileInviteRelativeRequest(payload));
  try {
    const related = await ProfileController.inviteRelated(payload);
    if (related.status) {
      dispatch(profileInviteRelativeSuccess(related));
      showSuccess('Success', related.message);
      dispatch(profileRelatedPerson(payload.id));
      NavigationHelper.navigate(NAVIGATION.relatedPersonList);
    } else {
      showError('Invite Error', related.message);
      dispatch(profileInviteRelativeError(related));
    }
  } catch (error) {
    dispatch(profileInviteRelativeError(error));
  }
};

export const profileDeleteRelative = payload => async dispatch => {
  dispatch(profileDeleteRelativeRequest(payload));
  try {
    const related = await ProfileController.deleteRelatedPerson(payload);
    if (related.status) {
      dispatch(profileDeleteRelativeSuccess(related));
      showSuccess('Success', related.message);
      dispatch(profileRelatedPerson(payload.userId));
      // NavigationHelper.navigate(NAVIGATION.relatedPersonList)
    } else {
      showError('Invite Error', related.message);
      dispatch(profileDeleteRelativeError(related));
    }
  } catch (error) {
    dispatch(profileDeleteRelativeError(error));
  }
};

export const profileUpdateInvitation = payload => async dispatch => {
  dispatch(profileUpdateInvitationRequest(payload));
  try {
    const update = await ProfileController.updateInvitation(payload);
    if (update.status) {
      showSuccess('Success', update.message);
      dispatch(profileUpdateInvitationSuccess(update));
      dispatch(profileRelatedPerson(AuthHelper.getPatientId()));
      //  dispatch(profileRelatedPerson(payload.patientRefId));
    } else {
      dispatch(profileUpdateInvitationError(update));
    }
  } catch (error) {
    dispatch(profileUpdateInvitationError(error));
  }
};

// fetch organization
export const organizationDetails = (id, cb) => async (dispatch, getState) => {
  dispatch(organizationDetailRequest(id));
  try {
    const detail = await ProfileController.organizationDetail(id);
    if (detail.status) {
      dispatch(organizationDetailSuccess(detail));
      if (getState().user?.user) {
        let user_data = getState().user.user;
        user_data = Object.assign({}, user_data, {
          organizationUnit: detail?.data?.deviceUnit,
        });
        let final_data = Object.assign({}, getState().user, {
          user: user_data,
        });
        dispatch(loginSuccess(final_data));
      }

      if (cb) {
        cb(detail);
      }
    } else {
      showError('Organization Detail Error', detail.error);
      dispatch(organizationDetailError(detail));
    }
  } catch (error) {
    dispatch(organizationDetailError(error));
  }
};

// fetch organization
export const getDiscoverOrganisation =
  (id, cb) => async (dispatch, getState) => {
    try {
      const detail = await ProfileController.discoverOrganisation(id);
      if (detail.status) {
        dispatch(
          setOrganisationDiscover({
            licensedProduct: detail.data?.licensedProduct,
          }),
        );
      } else {
        dispatch(setOrganisationDiscover({licensedProduct: {}}));
      }
    } catch (error) {
      // dispatch(organizationDetailError(error));
    }
  };
