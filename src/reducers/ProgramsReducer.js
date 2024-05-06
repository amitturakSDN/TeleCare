import { TYPES } from "@/actions/ProgramsAction"
import { Validate } from '@/helpers';
const INITIAL_STATE = {
    list : []
};

export const programsReducer = ( state = INITIAL_STATE, {payload, type} ) => {
    switch (type) {
        case TYPES.PROGRAMS_LISTING_SUCCESS : 
            return { ...state, list : payload.data}
            case TYPES.PROGRAMS_LISTING_ERROR : 
            return { ...state, list : []}
        case TYPES.CLEAR_STORE : 
            return INITIAL_STATE
        default : 
            return state
    }
}