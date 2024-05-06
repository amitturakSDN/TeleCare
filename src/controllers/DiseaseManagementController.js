import { strings } from '@/localization';
import { HttpClient } from './HttpClient';
import { ENDPOINTS } from '@/constants/sensitive';

export class DiseaseManagementContoller {

    static add(request) {

        return new Promise((resolve, reject) => {
            HttpClient.setAuthorization();
            return HttpClient.post(ENDPOINTS.disease, request).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });

    }

    static list(id) {
        return new Promise((resolve, reject) => {
            HttpClient.setAuthorization();
            return HttpClient.get(ENDPOINTS.disease + "/" + id).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    }

    static update(request){
        return new Promise((resolve, reject) => {
            HttpClient.setAuthorization();
            return HttpClient.put(ENDPOINTS.disease,request).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    }

    static delete(request){
        return new Promise((resolve, reject) => {
            HttpClient.setAuthorization();
            return HttpClient.delete(ENDPOINTS.disease + "/"+request.patientId+"?diseaseId=" + request.diseaseId ).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            });
        });
    }

}
