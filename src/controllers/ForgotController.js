import { HttpClient } from '@/controllers';
import { ENDPOINTS } from '@/constants/sensitive';
export class ForgotController {

  static request(email) {
    
    return new Promise((resolve, reject) => {
      return HttpClient.get(ENDPOINTS.forgot+'?isMobile=true&email='+email).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      });
    });
  }

  static requestTemp(email) {
    
    return new Promise((resolve, reject) => {
      return HttpClient.get(ENDPOINTS.forgot+'?isMobile=true&email='+email+'&isExpire=true' ).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      });
    });
  }

  static reset(payload) {
    
    return new Promise((resolve, reject) => {
      return HttpClient.post(ENDPOINTS.forgotReset,payload).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      });
    });

  }

  static validateToken(payload) {
    
    return new Promise((resolve, reject) => {
      return HttpClient.get(ENDPOINTS.validateToken+"?email="+payload.email+"&verificationCode="+payload.code+"&isMobile="+true).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      });
    });

  }
}
