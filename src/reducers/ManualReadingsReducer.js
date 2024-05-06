import {TYPES} from '@/actions/ManualReadingsActions';
import { Validate } from '@/helpers';

const INITIAL_STATE = {
  list: [],
  previousReadings: [],
  allReadings: [],
  deviceList:[]
};
export const manualReadingsReducer = (
  state = INITIAL_STATE,
  {payload, type},
) => {
  switch (type) {
    case TYPES.LIST_DEVICES_SUCCESS:
      return {
        ...state,
        deviceList: payload.result[0],
      };
    case TYPES.LIST_READINGS_SUCCESS:
      return {
        ...state,
        list: payload.data,
      };
    case TYPES.PREVIOUS_READINGS_SUCCESS:
      return {
        ...state,
        previousReadings: payload.data,
      };
      case TYPES.ALL_READINGS_SUCCESS:
      return {
        ...state,
        allReadings:payload.data,
      };
      case TYPES.CLEAR_STORE:
      return INITIAL_STATE;
    default:
      return state;
  }
};
