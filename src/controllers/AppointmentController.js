import {HttpClient} from './HttpClient';
import {ENDPOINTS} from '@/constants/sensitive';
import {AuthHelper} from '@/helpers';
export class AppointmentController {
  static listPatientAppointment(request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(
        ENDPOINTS.appointment +
          '?patientId=' +
          AuthHelper.getPatientId() +
          '&status=' +
          request.status,
      )
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  static getAppointmentNote(request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(
        ENDPOINTS.appointmentNote + '?appointmentId=' + request,
      )
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static getCancelAppointment(request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.delete(
        ENDPOINTS.appointment +
          '?orgId=' +
          request.orgId +
          '&appointmentId=' +
          request.appointmentId,
      )
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  static getRescheduleAppointment(request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(ENDPOINTS.appointment + '/' + request.appointmentId)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static cancelAcceptRequestedAppointment(request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.put(ENDPOINTS.appointment, request)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static listFeedbackQuetions(request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(ENDPOINTS.getFeedbackQuestion + request)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static feedbackSubmit(payload) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.post(ENDPOINTS.feedbackSubmit, payload)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static sessionEncounter(id, request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.put(`${ENDPOINTS.encounter}/${id}`, request)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  
  static createEncounter(request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.post(`${ENDPOINTS.encounter}`, request)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static cancelEncounter(request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      request.status = 'cancelled';
      return HttpClient.put(`${ENDPOINTS.encounter}/${request?.id}`, request)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static getEncounter(request) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(ENDPOINTS.encounter + '/' + request?.id)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static getQuestionaireList(type = 'Get Care') {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(`${ENDPOINTS.questionnaireList}${type}`)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static saveQuestionaireList(payload) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.post(`${ENDPOINTS.saveQuestionnaireResponse}`, payload)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
