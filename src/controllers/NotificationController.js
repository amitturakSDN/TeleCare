import { HttpClient } from '@/controllers';
import { ENDPOINTS } from '@/constants/sensitive';
export class NotificationController {

    static list (payload) {
        return new Promise((resolve,reject) =>{
            HttpClient.setAuthorization()
            return HttpClient.get(ENDPOINTS.notification+'/'+payload).then(response => {
                resolve(response)
              }).catch(error => {
                reject(error)
              });
        })
    }

    static update (payload){
        return new Promise((resolve,reject) =>{
            HttpClient.setAuthorization()
            return HttpClient.put(ENDPOINTS.notification,payload).then(response => {
                resolve(response)
              }).catch(error => {
                reject(error)
              });
        })
    }
}