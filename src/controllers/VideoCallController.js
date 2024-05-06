import { HttpClient } from './HttpClient';
import { ENDPOINTS } from '@/constants/sensitive';

export class VideoCallController {
    
    static generateToken(payload){
        return new Promise((resolve, reject) => {
            HttpClient.setAuthorization()
            return HttpClient.post(ENDPOINTS.sessionCreate, payload).then(response => {
              resolve(response)
            }).catch(error => {
              reject(error)
            });
          });
    }
}