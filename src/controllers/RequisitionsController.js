import {HttpClient} from './HttpClient';
import {ENDPOINTS} from '@/constants/sensitive';
import {AuthHelper} from '@/helpers';
export class RequisitionsController {
  // list requisition
  static listRequisitions() {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(
        ENDPOINTS.getlistRequisitions +
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

  // requisitionDetails
  static requisitionDetails(payload) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(
        ENDPOINTS.requisitionDetails + payload,
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
