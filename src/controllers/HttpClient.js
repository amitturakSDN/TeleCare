import axios from 'axios';
import {strings} from '@/localization';
import {CREDENTIALS} from '@/constants';
import * as AxiosLogger from 'axios-logger';
import {AuthHelper} from '@/helpers';
import {showError} from '@/hooks/message';
import {store} from '@/store';
import {logout} from '@/actions/UserActions';

const client = axios.create({
    baseURL: CREDENTIALS.endpoint,
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use(request => {
    return AxiosLogger.requestLogger(request);
});

client.interceptors.response.use(
    response => {
        __DEV__ && AxiosLogger.responseLogger(response);
        return response.data;
    },
    error => {
        __DEV__ && AxiosLogger.errorLogger(error);
        if (error.response) {
            if (error.response.data?.error) showError('Error :', error.response.data?.error);
            else if (error.response.data?.message) {
                let msg = error.response.data?.message;
                if (msg.includes('Please refer to Appointments section for details')) {
                    showError('Please Note :', error.response.data?.message);
                } else {
                    showError('Error :', error.response.data?.message);
                }
            } else showError('Error :', 'Api returns an exception errror');

            if (error.response.status === 401) {
                return Promise.reject(error.response.data) && store.dispatch(logout());
            }
            return Promise.reject(error.response.data);
        } else if (error.request) {
            return Promise.reject(new Error(strings.common.connectionError));
        } else {
            return Promise.reject(error);
        }
    },
);

const setAuthorization = () => {
    client.defaults.headers.common.authorization = AuthHelper.getAccessToken();
};

const clearAuthorization = () => {
    delete client.defaults.headers.common.authorization;
};

const setUnAuthHeaderStatic = () => {
    client.defaults.headers.common.authorization =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIiLCJuYW1lIjoiIiwiaWF0IjoxNTE2MjM5MDIyfQ.lrVF59rWfSemg8LfuG-PoXSZwGlQK0QiZ-qToxaYw50';
};

export const HttpClient = {
    ...client,
    setAuthorization,
    clearAuthorization,
    setUnAuthHeaderStatic,
};
