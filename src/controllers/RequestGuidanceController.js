import {HttpClient} from './HttpClient';
import {ENDPOINTS} from '@/constants/sensitive';
import {AuthHelper} from '@/helpers';
export class RequestGuidanceController {
  static listPractitionar(request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      let path = ENDPOINTS.listPractitionar;
      if(request?.scopeOfPractice){
        path +=  '?org_id=' + request.org_id + 
              '&scopeOfPractice=' + request.scopeOfPractice;
      }else{
        path+=  '?patientId=' +
        AuthHelper.getPatientId();
      }
      return HttpClient.get(
          path 
        )
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });  
    });
  }
  static listSchedule(request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(
        ENDPOINTS.schedule +  '?actorId=' +
        request.id + '&date=' + request.date 
      )
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  static listSlots(request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(
        ENDPOINTS.slots +  '?serviceCategoryId=' +
        request.serviceCatId + '&date=' + request.date + '&actorId=' + request.actorId
      )
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  static listService(request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(
        ENDPOINTS.orgServiceCat +  '?isMobile=true' + '&id=' + AuthHelper.getPatientId() 
      )
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  static listOrgSlots(request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      let path = ENDPOINTS.slots +  '?serviceCategoryId=' +
      request.serviceCatId + '&date=' + request.date +'&patientId=' + request.patientId;
      if(request?.scopeOfPractice && request?.org_id){
        path +=  '&org_id=' + request.org_id + 
              '&scopeOfPractice=' + request.scopeOfPractice;
      }
      return HttpClient.get(
        path
      )
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  static createAppointment(request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      // console.log("CREATE APPT REQUEST>>>>>>>>>>>>>>", JSON.stringify(request, undefined, 4));
      return HttpClient.post(
        ENDPOINTS.appointment, request
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
