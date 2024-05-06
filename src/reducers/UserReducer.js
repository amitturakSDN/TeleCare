import {TYPES} from '@/actions/UserActions';
const INITIAL_STATE = {
  loader: false,
  // "status": true,
  // "message": "Verification link is send to your email. Please check your mail",
  // token : 'eyJraWQiOiJBQjhOSmJqbDlGTnd1NEhZMnhIZ1lPXC9kRG1ya3h3NWh6TUF5OGNkT0dWUT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjZTRhMTQ3Mi00MTEwLTQyNGItYWZlMC05Mzg3OWY1MTUwNjIiLCJjb2duaXRvOmdyb3VwcyI6WyJQYXRpZW50Il0sImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuY2EtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2NhLWNlbnRyYWwtMV9sMFNLYmxWY0QiLCJjb2duaXRvOnVzZXJuYW1lIjoidmFpYmhhdnBhZHNhbGEiLCJvcmlnaW5fanRpIjoiNTc4OWI2ZWItMGUwZC00YTE5LWI5YjItYzQyYThhMTNmZjhhIiwiYXVkIjoiNjJhczJoam03c2o3b2ZrMGlodjJsaTFndHUiLCJldmVudF9pZCI6IjNlZjk5ZDM2LTNkNWYtNDRkOC1hODZmLWYxYzNmMDA0MjcxMyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjY5NjU3MjA0LCJleHAiOjE2Njk2NjA4MDMsImlhdCI6MTY2OTY1NzIwNCwianRpIjoiODljYmExNmMtOWU3ZS00NzgyLWIzMjQtZDE0NTI0NjJlZjhkIiwiZW1haWwiOiJ2cDczOTMwNzFAZ21haWwuY29tIn0.y74ZaWN97rg5hFc52gOk-15KA_JGkSzAfOZar35n2lHxkRJO0Uhha4uoUzBc1NbN5zhbtZjFMVrLLwwr5KvIbQBd467T_Nkr7pIBgD0McEzxSznM3UV0e8jvtR6GuxoPSmWs0XhfEIISitudsVJedR_6YVEsyQ1V7Iz2jv3YO4ngNz6m6ERD9KaQ35qyoN4mq914lEFVZlt0-gc5GSNJk5Ougqrj3V_I76Fu3oM2eYFN_EOi-HkOnnq1xTwVJUABf1LRfD_aZWE8eXE7d_4ZVKpoK1xYExUhvolbhhNzZdttArA7zBiTND0YWeBBlYii2dD6JsnFjIACAFaXGmsHJQ'
};
export const userReducer = (state = INITIAL_STATE, {payload, type}) => {
  switch (type) {
    case TYPES.LOGIN_SUCCESS:
      return {...state, ...payload.user};
    case TYPES.CLEAR_STORE:
      return INITIAL_STATE;
    case TYPES.TOGGLE_LOADER:
      return {...state, loader: payload};
    default:
      return state;
  }
};
