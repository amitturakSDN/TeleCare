import {strings} from '@/localization';
import {HttpClient} from './HttpClient';
import {ENDPOINTS} from '@/constants/sensitive';
import {showError, showSuccess} from '@/hooks/message';
export class SettingsController {
  static update(payload) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.put(ENDPOINTS.setting, payload)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          showError('Error', error.error);
          reject(error);
        });
    });
  }

  static list() {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(ENDPOINTS.setting)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          showError('Error', error.error);
          reject(error);
        });
    });
  }
  static listProgram(payload) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(ENDPOINTS.programList + '?id=' + payload.id)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
