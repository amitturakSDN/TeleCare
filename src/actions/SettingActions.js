import { SettingsController } from "@/controllers/SettingsController";
import { showError, showSuccess } from "@/hooks/message";

export const TYPES = {
  CLEAR_STORE: 'CLEAR_STORE',
  SETTING_UPDATE : 'SETTING_UPDATE',
  SETTING_UPDATE_REQUEST : 'SETTING_UPDATE_REQUEST',
  SETTING_UPDATE_SUCCESS : 'SETTING_UPDATE_SUCCESS',
  SETTING_UPDATE_ERROR : 'SETTING_UPDATE_ERROR',

  SETTING_LIST : 'SETTING_LIST',
  SETTING_LIST_REQUEST : 'SETTING_LIST_REQUEST',
  SETTING_LIST_ERROR : 'SETTING_LIST_ERROR',
  SETTING_LIST_SUCCESS : 'SETTING_LIST_SUCCESS'
};


const settingUpdateRequest = (payload) => ({
    type : TYPES.SETTING_UPDATE_REQUEST,
    payload
})

const settingUpdateSuccess = (payload) => ({
    type : TYPES.SETTING_UPDATE_SUCCESS,
    payload
})

const settingUpdateError = (error) => ({
    type : TYPES.SETTING_UPDATE_ERROR,
    payload : error
})

const settingListRequest = () =>({
    type : TYPES.SETTING_LIST_REQUEST,
    payload : null
})

const settingListSuccess = (payload) =>({
    type : TYPES.SETTING_LIST_SUCCESS,
    payload 
})

const settingListError = (error) =>({
    type : TYPES.SETTING_LIST_ERROR,
    payload : {error}
})


export const settingUpdate = (payload) => async (dispatch) => {
    dispatch(settingUpdateRequest(payload))
    try{
        const update = await SettingsController.update(payload)
        if(update.status){
            dispatch(settingUpdateSuccess(update))
            showSuccess(update.message)
            dispatch(settingList())
        }else{
            showError("Update error",update.error)
            dispatch(settingUpdateError(update))
        }

    }catch(error){
        showError("Update error")
        dispatch(settingUpdateError(error))
    }
}

export const settingList = () => async (dispatch) => {
    dispatch(settingListRequest())
    try{
        const update = await SettingsController.list()
        if(update.status){
            dispatch(settingListSuccess(update))
           // showSuccess(update.message)
        }else{
            showError("List error")
            dispatch(settingListError(update))
        }

    }catch(error){
        showError("List exception error")
        dispatch(settingListError(error))
    }
}