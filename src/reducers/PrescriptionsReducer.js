import { TYPES } from '@/actions/AppointmentAction';
import { Validate } from '@/helpers';

const INITIAL_STATE = {
    isLoading: false,
    listPrescriptions: [],
    prescriptionsDetails: [],

}
export const prescriptionsReducer = (state = INITIAL_STATE, { payload, type }) => {
    switch (type) {
        case TYPES.LIST_PRESCRIPTION_SUCCESS:
            return {
                ...state,
                listPrescriptions: payload.data
            };
        case TYPES.LIST_PRESCRIPTION_ERROR:
            return {
                ...state,
                listPrescriptions: []
            };
        case TYPES.PRESCRIPTION_DETAILS_SUCCESS:
            return {
                ...state,
                prescriptionsDetails: payload.data
            };
        case TYPES.PRESCRIPTION_DETAILS_ERROR:
            return {
                ...state,
                prescriptionsDetails: []
            };

        case TYPES.CLEAR_STORE:
            return {};
        default:
            return state;
    }
};
