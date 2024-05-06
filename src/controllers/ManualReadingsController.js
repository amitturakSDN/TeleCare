import {strings} from '@/localization';
import {HttpClient} from './HttpClient';
import {ENDPOINTS} from '@/constants/sensitive';
import {AuthHelper} from '@/helpers';

export class ManualReadingsController {
  static add(request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.post(ENDPOINTS.addManualReadings, request)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static listDevices() {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(
        ENDPOINTS.programEnroll +
          '?id=' +
          AuthHelper.getPatientId() +
          '&isMobile=' +
          true,
      )
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  static list(request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.post(ENDPOINTS.listManualReadings, request)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  static getReadings(query_string) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();

      return HttpClient.get(`${ENDPOINTS.getObservationReading}${query_string}`)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  static listPrevious(request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      // return HttpClient.post(ENDPOINTS.listManualReadings, request)
      return HttpClient.get(`${ENDPOINTS.getObservationReading}${request}`)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  static listAll(request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      //  return HttpClient.post(ENDPOINTS.listManualReadings, request)
      return HttpClient.get(`${ENDPOINTS.getObservationReading}${request}`)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
