import {store} from '@/store';

import {jwt_decode} from 'jwt-decode';
import {Validate} from '@/helpers/Validation';
function getAccessToken() {
    const token = store.getState()?.user?.token;
    return token;
}

function parseToken() {
    let token = getAccessToken();
    return jwt_decode(token);
}

function getUserId() {
    let user = store.getState().user?.user;
    if (user) {
        return user['custom:unique_id'];
    }
    //    else {
    //     return '';
    //   }
}

function getPatientId() {
    let selectedProfile = store.getState()?.profile?.selectedProfile;
    if (selectedProfile) return selectedProfile?.id ?? getUserId();
    return getUserId();
}

function getUserName() {
    let profile = store.getState()?.profile;
    let userName = profile.firstName + ' ' + profile.lastName;
    return userName;
}

function getUserType() {
    let user = store.getState().user?.user;
    return user['cognito:groups'];
}

export const AuthHelper = {
    getAccessToken,
    parseToken,
    getUserId,
    getPatientId,
    getUserName,
    getUserType,
};
