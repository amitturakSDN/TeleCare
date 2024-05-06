import {HttpClient} from '@/controllers';
import {ENDPOINTS} from '@/constants/sensitive';
import {AuthHelper} from '@/helpers';
export class ProgramsController {
  static list(payload) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(
        ENDPOINTS.programList + '?id=' + payload,
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
