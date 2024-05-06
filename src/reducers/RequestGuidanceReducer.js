import {TYPES} from '@/actions/RequestGuidanceActions';
import {Validate} from '@/helpers';
import { Alert } from 'react-native';
const INITIAL_STATE = {
  list: [],
  isLoading: false,
  schedule: [],
  slots: [],
  orgServiceCategories: [],
  orgSlots:[],
  dependentName:''
};
export const requestGuidanceReducer = (
  state = INITIAL_STATE,
  {payload, type},
) => {
  switch (type) {
    case TYPES.LIST_PRACTITIONAR_SUCCESS:
      return {
        ...state,
        list: Validate.decryptInput(payload.result),
      };
    case TYPES.LIST_PRACTITIONAR_ERROR:
      return {
        ...state,
        list: [],
      };
    case TYPES.LIST_SCHEDULE_SUCCESS:
      return {
        ...state,
        schedule: payload.data,
        
      };
      
    case TYPES.LIST_SCHEDULE_ERROR:
      return {
        ...state,
        schedule: [],
      };
    case TYPES.LIST_SLOTS_SUCCESS:
      return {
        ...state,
        slots: payload.data,
      };
    case TYPES.LIST_SLOTS_ERROR:
      return {
        ...state,
        slots: [],
      };
    case TYPES.LIST_ORG_SERVICE_SUCCESS:
      return {
        ...state,
        orgServiceCategories: payload.data,
      };
    case TYPES.LIST_ORG_SERVICE_ERROR:
      return {
        ...state,
        orgServiceCategories: [],
      };
      case TYPES.LIST__ORG_SLOTS_SUCCESS:
      return {
        ...state,
        orgSlots: payload.data,
      };
    case TYPES. LIST__ORG_SLOTS_ERROR:
      return {
        ...state,
        orgSlots: [],
      };
    case "HANDLE_DEPENDENT":
      return {
        ...state,
        dependentName: payload,
      };
    case TYPES.CLEAR_STORE:
      return {};
    default:
      return state;
  }
};
