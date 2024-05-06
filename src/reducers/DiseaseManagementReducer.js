import { TYPES } from '@/actions/DiseaseManagementActions';
import { Validate } from '@/helpers';

const INITIAL_STATE = {
    list: [],
    selected: {},
    isLoading: false
}
export const diseaseManagementReducer = (state = INITIAL_STATE, { payload, type }) => {
    switch (type) {
        case TYPES.LIST_DISEASE_SUCCESS:
            return {
                ...state,
                list: Validate.decryptInput(payload.data) 
            };
        case TYPES.EDIT_DISEASE_SUCCESS:
            return {
                ...state,
                selected: payload
            };
        case TYPES.UPDATE_DISEASE_SUCCESS : 
            return {
                ...state,
                selected: {}
            };
        case TYPES.CLEAR_STORE:
            return {};
        default:
            return state;
    }
};
