import {strings} from '@/localization';
import {HttpClient} from './HttpClient';
import {ENDPOINTS} from '@/constants/sensitive';
export class UserController {
  static login(payload) {
    return new Promise((resolve, reject) => {
      return HttpClient.post(ENDPOINTS.login, payload)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static changeTempPassword(payload) {
    return new Promise((resolve, reject) => {
      return HttpClient.post(ENDPOINTS.reset, payload)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static postToken(payload) {
    return new Promise((resolve, reject) => {
      return HttpClient.post(ENDPOINTS.deviceToken, payload)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static logout() {
    return new Promise(resolve => {
      setTimeout(resolve, 250);
    });
  }

  static checkRelatedPerson(request) {
    return new Promise((resolve, reject) => {
      return HttpClient.post(ENDPOINTS.signupRelative, request)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
