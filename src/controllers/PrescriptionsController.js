import {HttpClient} from './HttpClient';
import {ENDPOINTS} from '@/constants/sensitive';
import {AuthHelper} from '@/helpers';
export class PrescriptionsController {
  // list requisition
  static listPrescriptions() {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(
        ENDPOINTS.getlistPrescriptions +
          '?patientId=' +
         AuthHelper.getPatientId(),
      )
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // prescriptionsDetails
  static prescriptionsDetails(payload) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(
        ENDPOINTS.prescriptionsDetails + payload,
      )
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
