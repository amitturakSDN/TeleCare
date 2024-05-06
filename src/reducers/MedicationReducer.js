import {TYPES} from '@/actions/MedicationActions';

const INITIAL_STATE = {
  list: [],
};
export const medicationReducer = (state = INITIAL_STATE, {payload, type}) => {
  switch (type) {
    case TYPES.LIST_MEDICATION_SUCCESS:
      const list = payload.data
      const response = list.length ? list[0] :  list ;
      var temp = new Map();
      let arr = []
      if (response !== undefined && JSON.stringify(response) !== '{}') {
        Object.entries(response.medication).forEach(([id, medication]) => {
          medication.repeats.forEach(({ time,status }) => {
            temp.set(time, [...(temp.get(time) || []), {...medication, status,id }]);
          });
        });
        
        arr = Array.from(temp, ([key, value]) => ({
          key,
          value,
        }));
        arr.forEach(e => (e.checkStatus = 1));
      
      }
      return {
        ...state,
        list: arr,
      };
  
      case TYPES.CLEAR_STORE:
        return INITIAL_STATE;
    default:
      return state;
  }
};
