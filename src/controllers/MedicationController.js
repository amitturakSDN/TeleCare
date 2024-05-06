import {HttpClient} from './HttpClient';
import {ENDPOINTS} from '@/constants/sensitive';
import {AuthHelper} from '@/helpers';
export class MedicationController {
  static list(payload) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(
        ENDPOINTS.medication +
          '/' +
          AuthHelper.getPatientId() +
          '?date=' +
          payload.date,
      )
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  static update(request) {
  
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.put(ENDPOINTS.medication+"/"+request.data.patientId+"/"+request.data.medicationId, request.request)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
