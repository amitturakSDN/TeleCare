import { VideoCallController } from "@/controllers"
export const TYPES = {
    CLEAR_STORE: 'CLEAR_STORE',
    TOKEN_GENERATE : 'TOKEN_GENERATE',
    TOKEN_GENERATE_REQUEST : 'TOKEN_GENERATE_REQUEST',
    TOKEN_GENERATE_SUCCESS : 'TOKEN_GENERATE_SUCCESS',
    TOKEN_GENERATE_ERROR : 'TOKEN_GENERATE_ERROR'
}

const tokenGenerateRequest = (payload) => ({
    type : TYPES.TOKEN_GENERATE_REQUEST,
    payload
})


const tokenGenerateSuccess = (payload) => ({
    type : TYPES.TOKEN_GENERATE_SUCCESS,
    payload
})

const tokenGenerateError = (error) => ({
    type : TYPES.TOKEN_GENERATE_ERROR,
    payload : { error }
})

const clearStore = () => ({
    type: TYPES.CLEAR_STORE,
    payload: null,
});


export const tokenGenerate = (payload) => async (dispatch) => {
    dispatch(tokenGenerateRequest(payload))
    try{
      const tokenGenerate = await VideoCallController.generateToken(payload)
      if(tokenGenerate.status){
        dispatch(tokenGenerateSuccess(tokenGenerate))
      }else{
        dispatch(tokenGenerateError(tokenGenerate))
      }
  
    }catch(error){
      dispatch(tokenGenerateError(error))
    }
}