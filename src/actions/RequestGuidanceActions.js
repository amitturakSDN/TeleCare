import {RequestGuidanceController} from '@/controllers';
import {showSuccess, showError} from '@/hooks/message';
import * as RootNavigation from '@/navigation/RootNavigation';
import {saveCareQuestionList} from './AppointmentAction';
import {NAVIGATION} from '@/constants';
export const TYPES = {
    CLEAR_STORE: 'CLEAR_STORE',
    LIST_PRACTITIONAR: 'LIST_PRACTITIONAR',
    LIST_PRACTITIONAR_REQUEST: 'LIST_PRACTITIONAR_REQUEST',
    LIST_PRACTITIONAR_SUCCESS: 'LIST_PRACTITIONAR_SUCCESS',
    LIST_PRACTITIONAR_ERROR: 'LIST_PRACTITIONAR_ERROR',

    LIST_SCHEDULE: 'LIST_SCHEDULE',
    LIST_SCHEDULE_REQUEST: 'LIST_SCHEDULE_REQUEST',
    LIST_SCHEDULE_SUCCESS: 'LIST_SCHEDULE_SUCCESS',
    LIST_SCHEDULE_ERROR: 'LIST_SCHEDULE_ERROR',

    LIST_SLOTS: 'LIST_SLOTS',
    LIST_SLOTS_REQUEST: 'LIST_SLOTS_REQUEST',
    LIST_SLOTS_SUCCESS: 'LIST_SLOTS_SUCCESS',
    LIST_SLOTS_ERROR: 'LIST_SLOTS_ERROR',

    LIST_ORG_SERVICE: 'LIST_ORG_SERVICE',
    LIST_ORG_SERVICE_REQUEST: 'LIST_ORG_SERVICE_REQUEST',
    LIST_ORG_SERVICE_SUCCESS: 'LIST_ORG_SERVICE_SUCCESS',
    LIST_ORG_SERVICE_ERROR: 'LIST_ORG_SERVICE_ERROR',

    LIST_ORG_SLOTS: 'LIST_ORG_SLOTS',
    LIST__ORG_SLOTS_REQUEST: 'LIST__ORG_SLOTS_REQUEST',
    LIST__ORG_SLOTS_SUCCESS: 'LIST__ORG_SLOTS_SUCCESS',
    LIST__ORG_SLOTS_ERROR: 'LIST__ORG_SLOTS_ERROR',

    APPOINTMENT: 'APPOINTMENT',
    APPOINTMENT_REQUEST: 'APPOINTMENT_REQUEST',
    APPOINTMENT_SUCCESS: 'APPOINTMENT_SUCCESS',
    APPOINTMENT_ERROR: 'APPOINTMENT_ERROR',
};

const listPractitionarRequest = payload => ({
    type: TYPES.LIST_PRACTITIONAR_REQUEST,
    payload,
});

const listPractitionarSuccess = payload => ({
    type: TYPES.LIST_PRACTITIONAR_SUCCESS,
    payload,
});

const listPractitionarError = error => ({
    type: TYPES.LIST_PRACTITIONAR_ERROR,
    payload: {error},
});

const listScheduleRequest = payload => ({
    type: TYPES.LIST_SCHEDULE_REQUEST,
    payload,
});

const listScheduleSuccess = payload => ({
    type: TYPES.LIST_SCHEDULE_SUCCESS,
    payload,
});

const listScheduleError = error => ({
    type: TYPES.LIST_SCHEDULE_ERROR,
    payload: {error},
});

const listSlotsRequest = payload => ({
    type: TYPES.LIST_SLOTS_REQUEST,
    payload,
});

const listSlotsSuccess = payload => ({
    type: TYPES.LIST_SLOTS_SUCCESS,
    payload,
});

const listSlotsError = error => ({
    type: TYPES.LIST_SLOTS_ERROR,
    payload: {error},
});

const listOrgServiceRequest = payload => ({
    type: TYPES.LIST_ORG_SERVICE_REQUEST,
    payload,
});

const listOrgServiceSuccess = payload => ({
    type: TYPES.LIST_ORG_SERVICE_SUCCESS,
    payload,
});

const listOrgServiceError = error => ({
    type: TYPES.LIST_ORG_SERVICE_ERROR,
    payload: {error},
});

const listOrgSlotsRequest = payload => ({
    type: TYPES.LIST__ORG_SLOTS_REQUEST,
    payload,
});

const listOrgSlotsSuccess = payload => ({
    type: TYPES.LIST__ORG_SLOTS_SUCCESS,
    payload,
});

const listOrgSlotsError = error => ({
    type: TYPES.LIST__ORG_SLOTS_ERROR,
    payload: {error},
});

const appointmentRequest = payload => ({
    type: TYPES.APPOINTMENT_REQUEST,
    payload,
});

const appointmentSuccess = payload => ({
    type: TYPES.APPOINTMENT_SUCCESS,
    payload,
});

const appointmentError = error => ({
    type: TYPES.APPOINTMENT_ERROR,
    payload: {error},
});

export const listPractitionar = payload => async dispatch => {
    dispatch(listPractitionarRequest(payload));
    try {
        const list = await RequestGuidanceController.listPractitionar(payload);
        dispatch(listPractitionarSuccess(list));
    } catch (error) {
        dispatch(listPractitionarError(error));
    }
};
export const listSchedule = payload => async dispatch => {
    dispatch(listScheduleRequest(payload));
    try {
        const list = await RequestGuidanceController.listSchedule(payload);
        dispatch(listScheduleSuccess(list));
        if (list && list.data && list.data.length <= 0) {
            showError('No Service Category Available');
        }
    } catch (error) {
        dispatch(listScheduleError(error));
    }
};

export const listSlots = (payload, cb) => async dispatch => {
    dispatch(listSlotsRequest(payload));
    try {
        const list = await RequestGuidanceController.listSlots(payload);
        dispatch(listSlotsSuccess(list));
        if (cb) {
            cb(list);
        }
        if (list && list.data && list.data.availableSlots.length <= 0) {
            showError('No Slots Available');
        }
    } catch (error) {
        dispatch(listSlotsError(error));
    }
};

export const listServiceOrg = payload => async dispatch => {
    dispatch(listOrgServiceRequest(payload));
    try {
        const list = await RequestGuidanceController.listService(payload);
        dispatch(listOrgServiceSuccess(list));
    } catch (error) {
        dispatch(listOrgServiceError(error));
    }
};

export const listOrgSlots = (payload, cb) => async dispatch => {
    dispatch(listOrgSlotsRequest(payload));
    try {
        const list = await RequestGuidanceController.listOrgSlots(payload);
        dispatch(listOrgSlotsSuccess(list));
        if (cb) {
            cb(list);
        }
        if (list && list.data && list.data.availableSlots.length <= 0) {
            showError('No Slots Available');
        }
    } catch (error) {
        dispatch(listOrgSlotsError(error));
    }
};

export const requestAppointment = (payload, cb) => async dispatch => {
    dispatch(appointmentRequest(payload));
    try {
        const list = await RequestGuidanceController.createAppointment(payload);
        dispatch(appointmentSuccess(list));
        if (list.status == true && cb) {
            cb(true);
        }
        showSuccess(list.message);
        RootNavigation.navigate(NAVIGATION.session);
    } catch (error) {
        dispatch(appointmentError(error));
    }
};
export const requestAppointmentGetCare = (payload, cb) => async dispatch => {
    dispatch(appointmentRequest(payload));
    try {
        const list = await RequestGuidanceController.createAppointment(payload);
        dispatch(appointmentSuccess(list));
        if (list.status == true && cb) {
            cb(true);
            dispatch(saveCareQuestionList(list.result));
        }
        showSuccess(list.message);
        RootNavigation.navigate(NAVIGATION.appointmentSent);
    } catch (error) {
        dispatch(appointmentError(error));
        RootNavigation.navigate(NAVIGATION.session, {
            screen: NAVIGATION.session,
            params: {selectedTab: 'Requested'},
        });
    }
};
