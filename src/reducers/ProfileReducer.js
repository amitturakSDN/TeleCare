import {TYPES} from '@/actions/ProfileActions';
import {Validate} from '@/helpers';

const INITIAL_STATE = {
  relatedPerson: [],
  allRelatedPerson: [],
  selectedProfile: null,
  profileImg: '',
};

export const profileReducer = (state = INITIAL_STATE, {payload, type}) => {
  switch (type) {
    case TYPES.PROFILE_DETAIL_SUCCESS: {
      let response = {...payload.data};
      let id = response.id;
      let photo = response.photo;
      delete response[id];
      return {
        ...state,
        id,
        profileImg: photo,
        ...Validate.decryptInput(response),
      };
    }

    case TYPES.PROFILE_RELATED_PERSON_SUCCESS:
      const data = Validate.decryptInput(payload.data);

      let filterArray = [];
      if (data.length) filterArray = data.filter(item => item.active);
      return {...state, relatedPerson: filterArray, allRelatedPerson: data};
    case TYPES.PROFILE_SELECT_SUCCESS:
      return {...state, selectedProfile: payload};
    case TYPES.DISCOVER_ORGANISATION:
      return {...state, ...payload};
    case TYPES.CLEAR_STORE:
      return INITIAL_STATE;
    default:
      return state;
  }
};
