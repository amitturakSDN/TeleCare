import {TYPES} from '@/actions/AppointmentAction';
import {Validate} from '@/helpers';

const INITIAL_STATE = {
  listUpcoming: [],
  listRequested: [],
  listCompleted: [],
  note: {},
  isLoading: false,
  selected: [],
  listFeedbackQuetions: [],
  feedbacksubmitData: [],
  questionnaireList: {},
};
export const AppointmentReducer = (state = INITIAL_STATE, {payload, type}) => {
  switch (type) {
    case TYPES.LIST_UPCOMING_APPOINTMENT_SUCCESS:
      return {
        ...state,
        listUpcoming: payload.data,
      };
    case TYPES.LIST_UPCOMING_APPOINTMENT_ERROR:
      return {
        ...state,
        listUpcoming: [],
      };
    case TYPES.LIST_REQUESTED_APPOINTMENT_SUCCESS:
      return {
        ...state,
        listRequested: payload.data,
      };
    case TYPES.LIST_REQUESTED_APPOINTMENT_ERROR:
      return {
        ...state,
        listRequested: [],
      };
    case TYPES.LIST_COMPLETED_APPOINTMENT_SUCCESS:
      return {
        ...state,
        listCompleted: payload.data,
      };
    case TYPES.LIST_COMPLETED_APPOINTMENT_ERROR:
      return {
        ...state,
        listCompleted: [],
      };
    case TYPES.APPOINTMENT_NOTE_SUCCESS:
      return {
        ...state,
        note: Validate.decryptInput(payload.data),
      };
    case TYPES.APPOINTMENT_NOTE_ERROR:
      return {
        ...state,
        note: payload,
      };
    case TYPES.RESCHEDULE_APPOINTMENT_SUCCESS:
      return {
        ...state,
        selected: payload.data,
      };
    case TYPES.RESCHEDULE_APPOINTMENT_ERROR:
      return {
        ...state,
        selected: [],
      };
    case TYPES.LIST_FEEDBACK_QUESTIONS_SUCCESS:
      return {
        ...state,
        listFeedbackQuetions: payload.data,
      };
    case TYPES.LIST_FEEDBACK_QUESTIONS_ERROR:
      return {
        ...state,
        listFeedbackQuetions: [],
      };
    case TYPES.FEEDBACK_SUBMIT_SUCCESS:
      return {
        ...state,
        feedbacksubmitData: payload.data,
      };
    case TYPES.FEEDBACK_SUBMIT_ERROR:
      return {
        ...state,
        feedbacksubmitData: [],
      };
    case TYPES.CLEAR_STORE:
      return {};
    case TYPES.SET_QUESTION_LIST:
      return {
        ...state,
        questionnaireData: payload,
      };
      case TYPES.SET_QUESTION_LIST_WR:
        return {
          ...state,
          questionnaireDataWR: payload,
        }
    default:
      return state;
  }
};
