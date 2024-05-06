import { strings } from '@/localization';
import { HttpClient } from './HttpClient';
import { ENDPOINTS } from '@/constants/sensitive';
import { showError, showSuccess} from '@/hooks/message';
export class OtpController {

  static request(username,verificationCode) {
    
    return new Promise((resolve, reject) => {
      return HttpClient.get(ENDPOINTS.verifyEmail+'?username='+username+"&verificationCode="+verificationCode+ "&isMobile="+true).then(response => {
        resolve(response)
      }).catch(error => {
        showError('Error', error.error)
        reject(error)
      });
    });

  }

  static mfa(payload) {
    
    return new Promise((resolve, reject) => {
      return HttpClient.post(ENDPOINTS.mfaVerify,payload).then(response => {
        resolve(response)
      }).catch(error => {
        showError('Error', error.error)
        reject(error)
      });
    });

  }



}
