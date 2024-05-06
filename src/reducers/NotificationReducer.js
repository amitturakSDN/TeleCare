import {TYPES} from '@/actions/NotificationActions';
const INITIAL_STATE = {
  list: [],
  fcmDeviceToken: null,
};

export const notificationReducer = (state = INITIAL_STATE, {payload, type}) => {
  switch (type) {
    case TYPES.NOTIFICATION_LISTING_SUCCESS:
      return {...state, list: payload.data};
    case TYPES.CLEAR_STORE:
      return {...state,  list: []};
    case TYPES.SET_FCM_DEVICE_TOKEN_SUCCESS:
      return {...state, fcmDeviceToken: payload};
    default:
      return state;
  }
};
