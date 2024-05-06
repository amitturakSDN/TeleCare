import {TYPES} from '@/actions/SettingActions';
import {strings} from '@/localization';
const INITIAL_STATE = {
  list: [
    {
      title: strings.settings.email,
      enabled: true,
      key: 'isNewNotification',
    },
    {
      title: strings.settings.message,
      enabled: true,
      key: 'isNewMessage',
    },
    {
      title: strings.settings.request,
      enabled: true,
      key: 'isRequestAccepted',
    },
    {
      title: strings.settings.denied,
      enabled: true,
      key: 'isRequestDenied',
    },
    {
      title: strings.settings.session,
      enabled: true,
      key: 'isSessionStarted',
    },
    {
      title: strings.settings.mfa,
      enabled: true,
      key: 'isMFAenabled',
    },
  ],
};
export const settingsReducer = (state = INITIAL_STATE, {payload, type}) => {
  switch (type) {
    case TYPES.SETTING_LIST_SUCCESS: {
      let {data} = payload;
      let newState = [...state.list];
      newState.map((item, key) => {
        newState[key].enabled = data[item.key];
      });

      return {
        ...state,
        list: newState,
      };
    }

    case TYPES.CLEAR_STORE:
      return state;
    default:
      return state;
  }
};
