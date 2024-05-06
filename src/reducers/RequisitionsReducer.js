import { TYPES } from '@/actions/AppointmentAction';
import { Validate } from '@/helpers';

const INITIAL_STATE = {
    isLoading: false,
    listReqisition: [],
    requisitionDetails: [],

}
export const reqisitionReducer = (state = INITIAL_STATE, { payload, type }) => {
    switch (type) {
        case TYPES.LIST_REQUISITION_SUCCESS:
            return {
                ...state,
                listReqisition: payload.data
            };
        case TYPES.LIST_REQUISITION_ERROR:
            return {
                ...state,
                listReqisition: []
            };
        case TYPES.REQUISITION_DETAILS_SUCCESS:
            return {
                ...state,
                requisitionDetails: payload.data
            };
        case TYPES.REQUISITION_DETAILS_ERROR:
            return {
                ...state,
                requisitionDetails: []
            };

        case TYPES.CLEAR_STORE:
            return {};
        default:
            return state;
    }
};
