import { NotificationController } from "@/controllers"
import {showSuccess, showError} from '@/hooks/message';

export const TYPES = {
    CLEAR_STORE: 'CLEAR_STORE',

    NOTIFICATION_LISTING : 'NOTIFICATION_LISTING',
    NOTIFICATION_LISTING_REQUEST : 'NOTIFICATION_LISTING_REQUEST',
    NOTIFICATION_LISTING_SUCCESS : 'NOTIFICATION_LISTING_SUCCESS',
    NOTIFICATION_LISTING_ERROR : 'NOTIFICATION_LISTING_ERROR',

    NOTIFICATION_REPLY : 'NOTIFICATION_REPLY',
    NOTIFICATION_REPLY_REQUEST : 'NOTIFICATION_REPLY_REQUEST',
    NOTIFICATION_REPLY_SUCCESS : 'NOTIFICATION_REPLY_SUCCESS',
    NOTIFICATION_REPLY_ERROR : 'NOTIFICATION_REPLY_ERROR',

    SET_FCM_DEVICE_TOKEN_SUCCESS : " SET_FCM_DEVICE_TOKEN_SUCCESS"
}

export const setFcmDeviceToken = payload => {
    return {
      type: TYPES.SET_FCM_DEVICE_TOKEN_SUCCESS,
      payload,
    };
  };

const notificationListingRequest = (payload) => ({
    type : TYPES.NOTIFICATION_LISTING_REQUEST,
    payload
})

const notificationListingSuccess = (payload) => ({
    type : TYPES.NOTIFICATION_LISTING_SUCCESS,
    payload
})

const notificationListingError = (error) => ({
    type : TYPES.NOTIFICATION_LISTING_ERROR,
    payload : {error}


})

const notificationReplyRequest = (payload) => ({
    type : TYPES.NOTIFICATION_REPLY_REQUEST,
    payload
})

const notificationReplySuccess = (payload) => ({
    type : TYPES.NOTIFICATION_REPLY_SUCCESS,
    payload
})

const notificationReplyError = (error) => ({
    type : TYPES.NOTIFICATION_REPLY_ERROR,
    payload : {error}
})

export const notificationListing = (payload) => async (dispatch) => {
    dispatch(notificationListingRequest(payload))
    try{
        const list  = await NotificationController.list(payload)
        if(list.status){
            dispatch(notificationListingSuccess(list))
        }else{
            dispatch(notificationListingError(list))
        }
    }catch(error){
        dispatch(notificationListingError(error))
    }
}

export const fcmToken = (payload) => async (dispatch) => {
    dispatch(setFcmDeviceToken(payload))
}

export const notificationReply = (payload) => async(dispatch) => {
    dispatch(notificationReplyRequest(payload))
    try{
        const update = await NotificationController.update(payload)
        if(update.status){
            dispatch(notificationReplySuccess(update))
            if(!payload.markAsRead) // if it's only being marked as read, and successful, no alert is necessary
                showSuccess("Success",update.message)
            dispatch(notificationListing(payload.patientId))
            
        }else{
            dispatch(notificationReplyError(update))
        }
        
    }catch(error){
        dispatch(notificationReplyError(error))
    }
}