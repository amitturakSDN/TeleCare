import {AppointmentController} from '@/controllers';
import {showSuccess, showError} from '@/hooks/message';
import * as RootNavigation from '@/navigation/RootNavigation';
import {NAVIGATION} from '@/constants';
export const TYPES = {
    CLEAR_STORE: 'CLEAR_STORE',
    LIST_UPCOMING_APPOINTMENT: 'LIST_UPCOMING_APPOINTMENT',
    LIST_UPCOMING_APPOINTMENT_REQUEST: 'LIST_UPCOMING_APPOINTMENT_REQUEST',
    LIST_UPCOMING_APPOINTMENT_SUCCESS: 'LIST_UPCOMING_APPOINTMENT_SUCCESS',
    LIST_UPCOMING_APPOINTMENT_ERROR: 'LIST_UPCOMING_APPOINTMENT_ERROR',

    LIST_REQUESTED_APPOINTMENT: 'LIST_REQUESTED_APPOINTMENT',
    LIST_REQUESTED_APPOINTMENT_REQUEST: 'LIST_REQUESTED_APPOINTMENT_REQUEST',
    LIST_REQUESTED_APPOINTMENT_SUCCESS: 'LIST_REQUESTED_APPOINTMENT_SUCCESS',
    LIST_REQUESTED_APPOINTMENT_ERROR: 'LIST_REQUESTED_APPOINTMENT_ERROR',

    LIST_COMPLETED_APPOINTMENT: 'LIST_COMPLETED_APPOINTMENT',
    LIST_COMPLETED_APPOINTMENT_REQUEST: 'LIST_COMPLETED_APPOINTMENT_REQUEST',
    LIST_COMPLETED_APPOINTMENT_SUCCESS: 'LIST_COMPLETED_APPOINTMENT_SUCCESS',
    LIST_COMPLETED_APPOINTMENT_ERROR: 'LIST_COMPLETED_APPOINTMENT_ERROR',

    APPOINTMENT_NOTE: 'APPOINTMENT_NOTE',
    APPOINTMENT_NOTE_REQUEST: 'APPOINTMENT_NOTE_REQUEST',
    APPOINTMENT_NOTE_SUCCESS: 'APPOINTMENT_NOTE_SUCCESS',
    APPOINTMENT_NOTE_ERROR: 'APPOINTMENT_NOTE_ERROR',

    CANCEL_APPOINTMENT: 'CANCEL_APPOINTMENT',
    CANCEL_APPOINTMENT_REQUEST: 'CANCEL_APPOINTMENT_REQUEST',
    CANCEL_APPOINTMENT_SUCCESS: 'CANCEL_APPOINTMENT_SUCCESS',
    CANCEL_APPOINTMENT_ERROR: 'CANCEL_APPOINTMENT_ERROR',

    RESCHEDULE_APPOINTMENT: 'RESCHEDULE_APPOINTMENT',
    RESCHEDULE_APPOINTMENT_REQUEST: 'RESCHEDULE_APPOINTMENT_REQUEST',
    RESCHEDULE_APPOINTMENT_SUCCESS: 'RESCHEDULE_APPOINTMENT_SUCCESS',
    RESCHEDULE_APPOINTMENT_ERROR: 'RESCHEDULE_APPOINTMENT_ERROR',

    CANCEL_UPDATE_REQUESTED_APPOINTMENT: ' CANCEL_UPDATE_REQUESTED_APPOINTMENT',
    CANCEL_UPDATE_REQUESTED_APPOINTMENT_REQUEST: ' CANCEL_UPDATE_REQUESTED_APPOINTMENT_REQUEST',
    CANCEL_UPDATE_REQUESTED_APPOINTMENT_SUCCESS: ' CANCEL_UPDATE_REQUESTED_APPOINTMENT_SUCCESS',
    CANCEL_UPDATE_REQUESTED_APPOINTMENT_ERROR: ' CANCEL_UPDATE_REQUESTED_APPOINTMENT_ERROR',

    // feedback get
    LIST_FEEDBACK_QUESTIONS: 'LIST_FEEDBACK_QUESTIONS',
    LIST_FEEDBACK_QUESTIONS_REQUEST: 'LIST_FEEDBACK_QUESTIONS_REQUEST',
    LIST_FEEDBACK_QUESTIONS_SUCCESS: 'LIST_FEEDBACK_QUESTIONS_SUCCESS',
    LIST_FEEDBACK_QUESTIONS_ERROR: 'LIST_FEEDBACK_QUESTIONS_ERROR',

    // feedback POST
    FEEDBACK_SUBMIT: 'FEEDBACK_SUBMIT',
    FEEDBACK_SUBMIT_REQUEST: 'FEEDBACK_SUBMIT_REQUEST',
    FEEDBACK_SUBMIT_SUCCESS: 'FEEDBACK_SUBMIT_SUCCESS',
    FEEDBACK_SUBMIT_ERROR: 'FEEDBACK_SUBMIT_ERROR',
    TOGGLE_LOADER: 'TOGGLE_LOADER',
    SET_QUESTION_LIST: 'SET_QUESTION_LIST',
    SET_QUESTION_LIST_WR: 'SET_QUESTION_LIST_WR',
};

export const toggleLoader = payload => ({
    type: TYPES.TOGGLE_LOADER,
    payload: payload,
});

const listUpcomingAppointmentRequest = payload => ({
    type: TYPES.LIST_UPCOMING_APPOINTMENT_REQUEST,
    payload,
});

const listUpcomingAppointmentSuccess = payload => ({
    type: TYPES.LIST_UPCOMING_APPOINTMENT_SUCCESS,
    payload,
});

const listUpcomingAppointmentError = error => ({
    type: TYPES.LIST_UPCOMING_APPOINTMENT_ERROR,
    payload: {error},
});

const listRequestedAppointmentRequest = payload => ({
    type: TYPES.LIST_REQUESTED_APPOINTMENT_REQUEST,
    payload,
});

const listRequestedAppointmentSuccess = payload => ({
    type: TYPES.LIST_REQUESTED_APPOINTMENT_SUCCESS,
    payload,
});

const listRequestedAppointmentError = error => ({
    type: TYPES.LIST_REQUESTED_APPOINTMENT_ERROR,
    payload: {error},
});

const listCompletedAppointmentRequest = payload => ({
    type: TYPES.LIST_COMPLETED_APPOINTMENT_REQUEST,
    payload,
});

const listCompletedAppointmentSuccess = payload => ({
    type: TYPES.LIST_COMPLETED_APPOINTMENT_SUCCESS,
    payload,
});

const listCompletedAppointmentError = error => ({
    type: TYPES.LIST_COMPLETED_APPOINTMENT_ERROR,
    payload: {error},
});

const listAppointmentNoteRequest = payload => ({
    type: TYPES.APPOINTMENT_NOTE_REQUEST,
    payload,
});

const listAppointmentNoteSuccess = payload => ({
    type: TYPES.APPOINTMENT_NOTE_SUCCESS,
    payload,
});

const listAppointmentNoteError = error => ({
    type: TYPES.APPOINTMENT_NOTE_ERROR,
    payload: {error},
});

const cancelAppointmentRequest = payload => ({
    type: TYPES.CANCEL_APPOINTMENT_REQUEST,
    payload,
});

const cancelAppointmentSuccess = payload => ({
    type: TYPES.CANCEL_APPOINTMENT_SUCCESS,
    payload,
});

const cancelAppointmentError = error => ({
    type: TYPES.CANCEL_APPOINTMENT_ERROR,
    payload: {error},
});

const rescheduleAppointmentRequest = payload => ({
    type: TYPES.RESCHEDULE_APPOINTMENT_REQUEST,
    payload,
});

const rescheduleAppointmentSuccess = payload => ({
    type: TYPES.RESCHEDULE_APPOINTMENT_SUCCESS,
    payload,
});

export const rescheduleAppointmentError = error => ({
    type: TYPES.RESCHEDULE_APPOINTMENT_ERROR,
    payload: {error},
});

const cancelUpdateAppointmentRequest = payload => ({
    type: TYPES.CANCEL_UPDATE_REQUESTED_APPOINTMENT_REQUEST,
    payload,
});

const cancelUpdateAppointmentSuccess = payload => ({
    type: TYPES.CANCEL_UPDATE_REQUESTED_APPOINTMENT_SUCCESS,
    payload,
});

const cancelUpdateAppointmentError = error => ({
    type: TYPES.CANCEL_UPDATE_REQUESTED_APPOINTMENT_ERROR,
    payload: {error},
});

// feedback get
const listFeedbackQuestionsRequest = payload => ({
    type: TYPES.LIST_FEEDBACK_QUESTIONS_REQUEST,
    payload,
});

const listFeedbackQuestionsSuccess = payload => ({
    type: TYPES.LIST_FEEDBACK_QUESTIONS_SUCCESS,
    payload,
});

const listFeedbackQuestionsError = error => ({
    type: TYPES.LIST_FEEDBACK_QUESTIONS_ERROR,
    payload: {error},
});

// feedback post
const feedbackSubmitRequest = payload => ({
    type: TYPES.FEEDBACK_SUBMIT_REQUEST,
    payload,
});

const feedbackSubmitSuccess = payload => ({
    type: TYPES.FEEDBACK_SUBMIT_SUCCESS,
    payload,
});

const feedbackSubmitError = error => ({
    type: TYPES.FEEDBACK_SUBMIT_ERROR,
    payload: {error},
});

export const saveSelectedAppt = item => ({
    type: TYPES.RESCHEDULE_APPOINTMENT_SUCCESS,
    payload: {data: item},
});
const resetSelectedAppt = item => ({
    type: TYPES.RESCHEDULE_APPOINTMENT_ERROR,
    payload: {},
});

export const setQuestionnaireList = data => ({
    type: TYPES.SET_QUESTION_LIST,
    payload: data,
});
export const setQuestionnaireListWR = data => ({
    type: TYPES.SET_QUESTION_LIST_WR,
    payload: data,
});
export const listUpcomingAppointment = payload => async dispatch => {
    dispatch(listUpcomingAppointmentRequest(payload));
    try {
        const list = await AppointmentController.listPatientAppointment(payload);
        dispatch(listUpcomingAppointmentSuccess(list));
    } catch (error) {
        dispatch(listUpcomingAppointmentError(error));
    }
};
export const listRequestedAppointment = payload => async dispatch => {
    dispatch(listRequestedAppointmentRequest(payload));
    try {
        const list = await AppointmentController.listPatientAppointment(payload);
        dispatch(listRequestedAppointmentSuccess(list));
    } catch (error) {
        dispatch(listRequestedAppointmentError(error));
    }
};
export const listCompletedAppointment = payload => async dispatch => {
    dispatch(listCompletedAppointmentRequest(payload));
    try {
        const list = await AppointmentController.listPatientAppointment(payload);
        dispatch(listCompletedAppointmentSuccess(list));
    } catch (error) {
        dispatch(listCompletedAppointmentError(error));
    }
};
export const appointmentNote = payload => async dispatch => {
    dispatch(listAppointmentNoteRequest(payload));
    try {
        const list = await AppointmentController.getAppointmentNote(payload);
        dispatch(listAppointmentNoteSuccess(list));
    } catch (error) {
        dispatch(listAppointmentNoteError(error));
    }
};

export const cancelAppointment = payload => async dispatch => {
    dispatch(cancelAppointmentRequest(payload));
    try {
        const list = await AppointmentController.getCancelAppointment(payload);
        dispatch(cancelAppointmentSuccess(list));
        if (list.status == true) {
            showSuccess(list.message);
            let params = {
                status: 'booked',
            };
            dispatch(listUpcomingAppointment(params));
        } else {
            showError(list.message);
        }
    } catch (error) {
        dispatch(cancelAppointmentError(error));
    }
};
export const rescheduleAppointment = payload => async dispatch => {
    dispatch(rescheduleAppointmentRequest(payload));
    try {
        const list = await AppointmentController.getRescheduleAppointment(payload);
        // dispatch(rescheduleAppointmentSuccess(list));
        if (list.status == true) {
            // RootNavigation.navigate(NAVIGATION.requestGuidance,{
            //   isReschedule:true,
            //   id :payload.appointmentId
            // })
        } else {
            showError(list.message);
        }
    } catch (error) {
        dispatch(rescheduleAppointmentError(error));
    }
};

export const updateAppointment =
    (payload, showMsg = true, cb) =>
    async dispatch => {
        dispatch(cancelUpdateAppointmentRequest(payload));
        try {
            const list = await AppointmentController.cancelAcceptRequestedAppointment(payload);
            if (cb) {
                cb(list);
            }
            dispatch(cancelUpdateAppointmentSuccess(list));
            if (showMsg) {
                showSuccess(list.message);
            }
            let params = {
                status: 'booked',
            };
            dispatch(listUpcomingAppointment(params));
            let req = {
                status: 'proposed',
            };
            dispatch(listRequestedAppointment(req));
        } catch (error) {
            dispatch(cancelUpdateAppointmentError(error));
        }
    };

// feedback get
export const listFeedbackQuestions = (payload, cb) => async dispatch => {
    dispatch(listFeedbackQuestionsRequest(payload));
    dispatch(toggleLoader(true));
    try {
        const list = await AppointmentController.listFeedbackQuetions(payload);
        dispatch(listFeedbackQuestionsSuccess(list));
        if (cb) {
            cb(list);
        }
        dispatch(toggleLoader(false));
    } catch (error) {
        dispatch(toggleLoader(false));
        dispatch(listFeedbackQuestionsError(error));
    }
};

// feedback post
export const feedBackSubmit = payload => async dispatch => {
    dispatch({
        type: TYPES.TOGGLE_LOADER,
        payload: true,
    });
    dispatch(feedbackSubmitRequest(payload));
    try {
        const feedbackSubmit = await AppointmentController.feedbackSubmit(payload);
        if (feedbackSubmit.status) {
            dispatch(feedbackSubmitSuccess(feedbackSubmit));
            dispatch(resetSelectedAppt({}));

            dispatch({
                type: TYPES.TOGGLE_LOADER,
                payload: false,
            });
            RootNavigation.navigate(NAVIGATION.feedbackThanks);
        } else {
            dispatch(feedbackSubmitError(feedbackSubmit));
        }
    } catch (error) {
        dispatch(feedbackSubmitError(error));
    }
};

export const finishEncounter = (id, payload) => async dispatch => {
    dispatch(cancelUpdateAppointmentRequest(payload));
    try {
        const list = await AppointmentController.sessionEncounter(id, payload);
    } catch (error) {}
};

export const createEncounter = payload => async dispatch => {
    try {
        const list = await AppointmentController.createEncounter(payload);
        return list.data;
    } catch (error) {}
};

export const cancelEncounter = payload => async dispatch => {
    try {
        const list = await AppointmentController.cancelEncounter(payload);
        return list.data;
    } catch (error) {}
};

export const getCareQuestionList = type => async dispatch => {
    try {
        dispatch(toggleLoader(true));
        const list = await AppointmentController.getQuestionaireList(type);
        console.log(list, 'List.....');
        dispatch(
            setQuestionnaireList({
                getCareQuestionnaire: [list.data],
            }),
        );
        dispatch(toggleLoader(false));
    } catch (error) {
        dispatch(toggleLoader(false));
    }
};
export const getCareQuestionListWR = type => async dispatch => {
    try {
        dispatch(toggleLoader(true));
        const list = await AppointmentController.getQuestionaireList(type);
        console.log(list, 'List.....');
        dispatch(
            setQuestionnaireListWR({
                getCareQuestionnaireWR: [list.data],
            }),
        );
        dispatch(toggleLoader(false));
    } catch (error) {
        dispatch(toggleLoader(false));
    }
};
export const saveCareQuestionList = param => async (dispatch, getState) => {
    try {
        const questionResponse = getState().appointment?.questionnaireData?.filled_questionnaire;
        console.log(questionResponse, 'questionResponse....', param);
        if (questionResponse) {
            let payload = {
                ...questionResponse,
                appointmentId: param.id,
                serviceRequestId: '',
            };

            const list = await AppointmentController.saveQuestionaireList(payload);
            console.log(list, 'List save reponse.....');
        }
    } catch (error) {}
};
