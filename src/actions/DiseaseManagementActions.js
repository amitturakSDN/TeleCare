import { NAVIGATION } from '@/constants';
import { DiseaseManagementContoller } from '@/controllers';
import { showError,showSuccess } from '@/hooks/message';
import * as RootNavigation from '@/navigation/RootNavigation';
export const TYPES = {
  CLEAR_STORE: 'CLEAR_STORE',
  
  ADD_DISEASE : 'ADD_DISEASE',
  ADD_DISEASE_REQUEST: 'ADD_DISEASE_REQUEST',
  ADD_DISEASE_ERROR : 'ADD_DISEASE_ERROR',
  ADD_DISEASE_SUCCESS : 'ADD_DISEASE_SUCCESS',
  
  LIST_DISEASE : 'LIST_DISEASE',
  LIST_DISEASE_REQUEST : 'LIST_DISEASE_REQUEST',
  LIST_DISEASE_SUCCESS : 'LIST_DISEASE_SUCCESS',
  LIST_DISEASE_ERROR : 'LIST_DISEASE_ERROR',
  
  EDIT_DISEASE : 'EDIT_DISEASE',
  EDIT_DISEASE_REQUEST : 'EDIT_DISEASE_REQUEST',
  EDIT_DISEASE_ERROR : 'EDIT_DISEASE_ERROR',
  EDIT_DISEASE_SUCCESS : 'EDIT_DISEASE_SUCCESS',
  
  UPDATE_DISEASE : 'UPDATE_DISEASE',
  UPDATE_DISEASE_REQUEST : 'UPDATE_DISEASE_REQUEST',
  UPDATE_DISEASE_SUCCESS : 'UPDATE_DISEASE_SUCCESS',
  UPDATE_DISEASE_ERROR : 'UPDATE_DISEASE_ERROR',

  DELETE_DISEASE : 'DELETE_DISEASE',
  DELETE_DISEASE_REQUEST : 'DELETE_DISEASE_REQUEST',
  DELETE_DISEASE_ERROR : 'DELETE_DISEASE_ERROR',
  DELETE_DISEASE_SUCCESS : 'DELETE_DISEASE_SUCCESS',

  ADD_BLOOD_PRESSURE : 'ADD_BLOOD_PRESSURE',
  ADD_BLOOD_PRESSURE_REQUEST: 'ADD_BLOOD_PRESSURE_REQUEST',
  ADD_BLOOD_PRESSURE_ERROR : 'ADD_BLOOD_PRESSURE_ERROR',
  ADD_BLOOD_PRESSURE_SUCCESS : 'ADD_BLOOD_PRESSURE_SUCCESS',

  ADD_BLOOD_GLUCOSE : 'ADD_BLOOD_GLUCOSE',
  ADD_BLOOD_GLUCOSE_REQUEST: 'ADD_BLOOD_GLUCOSE_REQUEST',
  ADD_BLOOD_GLUCOSE_ERROR : 'ADD_BLOOD_GLUCOSE_ERROR',
  ADD_BLOOD_GLUCOSE_SUCCESS : 'ADD_BLOOD_GLUCOSE_SUCCESS',

  ADD_WEIGHT : 'ADD_WEIGHT',
  ADD_WEIGHT_REQUEST: 'ADD_WEIGHT_REQUEST',
  ADD_WEIGHT_ERROR : 'ADD_WEIGHT_ERROR',
  ADD_WEIGHT_SUCCESS : 'ADD_WEIGHT_SUCCESS',

  ADD_HEART_RATE : 'ADD_HEART_RATE',
  ADD_HEART_RATE_REQUEST: 'ADD_WHEART_RATE_REQUEST',
  ADD_HEART_RATE_ERROR : 'ADD_HEART_RATE_ERROR',
  ADD_HEART_RATE_SUCCESS : 'ADD_HEART_RATE_SUCCESS',

  ADD_TEMPERATURE : 'ADD_TEMPERATURE',
  ADD_TEMPERATURE_REQUEST: 'ADD_TEMPERATURE_REQUEST',
  ADD_TEMPERATURE_ERROR : 'ADD_TEMPERATURE_ERROR',
  ADD_TEMPERATURE_SUCCESS : 'ADD_TEMPERATURE_SUCCESS',


};

const addDiseaseRequest = (payload) => ({
    type : TYPES.ADD_DISEASE_REQUEST,
    payload
})

const addDiseaseSuccess = (payload) => ({
    type : TYPES.ADD_DISEASE_SUCCESS,
    payload
})

const addDiseaseError = (error) => ({
    type : TYPES.ADD_DISEASE_ERROR,
    payload : {error}
})

const listDiseaseRequest = () => ({
    type : TYPES.LIST_DISEASE_REQUEST,
    payload : ''
})

const listDiseaseError = (error) => ({
    type : TYPES.LIST_DISEASE_ERROR,
    payload : { error }
})


const listDiseaseSuccess = (payload) => ({
    type : TYPES.LIST_DISEASE_SUCCESS,
    payload 
})

const editDiseaseRequest = (payload) => ({
    type : TYPES.EDIT_DISEASE_REQUEST,
    payload 
})

const editDiseaseError = (error) => ({
    type : TYPES.EDIT_DISEASE_ERROR,
    payload : { error }
})

const editDiseaseSuccess = (payload) => ({
    type : TYPES.EDIT_DISEASE_SUCCESS,
    payload
})

const updateDiseaseRequest = (payload) => ({
    type : TYPES.UPDATE_DISEASE_REQUEST,
    payload
})

const updateDiseaseError = (error) => ({
    type : TYPES.UPDATE_DISEASE_ERROR,
    payload : { error}
})

const updateDiseaseSuccess = (payload) => ({
    type : TYPES.UPDATE_DISEASE_SUCCESS,
    payload
})

const deleteDiseaseRequest = (payload) => ({
    type : TYPES.DELETE_DISEASE_REQUEST,
    payload
})


const deleteDiseaseError = (error) => ({
    type :  TYPES.DELETE_DISEASE_ERROR,
    payload : {error}
})

const deleteDiseaseSuccess = (payload) => ({
    type : TYPES.DELETE_DISEASE_SUCCESS,
    payload
})

const clearStore = () => ({
  type: TYPES.CLEAR_STORE,
  payload: null,
});


export const addDisease = (payload) => async(dispatch) => {
    dispatch(addDiseaseRequest(payload))
    try{
        const add = await DiseaseManagementContoller.add(payload);
        if(add.status){
            showSuccess(add.message)
            dispatch(addDiseaseSuccess(add));
            dispatch(listDisease(payload.patientId))
            RootNavigation.navigate(NAVIGATION.diseaseListing)
        
        }else{
            showError('Add disease Error')
            dispatch(addDiseaseError(add))
        }

        
    }catch(error){
        dispatch(addDiseaseError(error))
    }

}


export const listDisease = (id) => async(dispatch) => {
    dispatch(listDiseaseRequest())
    try {
        const list = await DiseaseManagementContoller.list(id)
        dispatch(listDiseaseSuccess(list))
    }catch(error){
        dispatch(listDiseaseError(error))
    }

}

export const editDisease = (payload) => async(dispatch) => {
    dispatch(editDiseaseRequest(payload))
    dispatch(editDiseaseSuccess(payload))
}


export const updateDisease = (payload) => async(dispatch) => {
    dispatch(updateDiseaseRequest(payload))
    try{
        const update = await DiseaseManagementContoller.update(payload);
        if(update.status){
            showSuccess(update.message)
            dispatch(updateDiseaseSuccess(update));
            dispatch(listDisease(payload.patientId))
            RootNavigation.navigate(NAVIGATION.diseaseListing)
        
        }else{
            showError('Update disease Error')
            dispatch(updateDiseaseError(add))
        }

        
    }catch(error){
        dispatch(updateDiseaseError(error))
    }
}

export const deleteDisease = (request) => async (dispatch) => {
    dispatch(deleteDiseaseRequest(request))
    try{
        const del = await DiseaseManagementContoller.delete(request);
        if(del.status){
            showSuccess(del.message)
            dispatch(deleteDiseaseSuccess(del))
            dispatch(listDisease(request.patientId))
        }else{
            dispatch(deleteDiseaseError('Delete disease error'))
        }

    }catch(error){
        dispatch(deleteDiseaseError(error))
    }
}

 