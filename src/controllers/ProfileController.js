import {HttpClient} from './HttpClient';
import {ENDPOINTS} from '@/constants/sensitive';
import {showError, showSuccess} from '@/hooks/message';

export class ProfileController {
  static detail(id) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(ENDPOINTS.patient + id)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          if (error?.error) showError('Error', error.error);
          if (error?.message) showError('Error', error.message);
          reject(error);
        });
    });
  }

  static update(request) {
    let id = request.id;
    delete request.id;
    delete request.data.isMobile;
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.put(ENDPOINTS.patient + id, request)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          if (error?.error) showError('Error', error.error);
          if (error?.message) showError('Error', error.message);
          reject(error);
        });
    });
  }

  static related(patientId) {
    let endpoint = patientId ? '?patientRefId=' + patientId : '';
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(ENDPOINTS.relatedPerson + endpoint)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          if (error?.error) showError('Error', error.error);
          if (error?.message) showError('Error', error.message);
          reject(error);
        });
    });
  }

  static inviteRelated(payload) {
    let request = {
      patientRefId: payload.id,
      relationship: payload.relation,
      email: payload.email,
      isInvited: true,
      patient: {
        reference: 'Patient/' + payload.id,
        type: 'Patient',
      },
      text: {
        status: 'generated',
      },
      /* 
      'patientName': [
        {
          'use': 'usual',
          'text': payload.username,
          'family': payload.username,
          'given': [
            payload.username
          ]
        }
      ]
      */
    };

    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.post(ENDPOINTS.relatedPerson, request)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          if (error?.error) showError('Error', error.error);
          if (error?.message) showError('Error', error.message);
          reject(error);
        });
    });
  }

  static deleteRelatedPerson(payload) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.delete(
        ENDPOINTS.relatedPerson +
          '?id=' +
          payload.id +
          '&patientRefId=' +
          payload.userId +
          '&isMobile=' +
          true,
      )
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          if (error?.error) showError('Api Error', error.error);
          if (error?.message) showError('Api Error', error.message);
          reject(error);
        });
    });
  }

  static updateInvitation(payload) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.put(ENDPOINTS.relatedPerson, payload)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          if (error?.error) showError('Api Error', error.error);
          if (error?.message) showError('Api Error', error.message);
          reject(error);
        });
    });
  }

  // FETCH ORGANIZATION DETATILS
  static organizationDetail(id) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(`${ENDPOINTS.organization}${id}`)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          if (error?.error) showError('Error', error.error);
          if (error?.message) showError('Error', error.message);
          reject(error);
        });
    });
  }

  // FETCH ORGANIZATION DETATILS
  static discoverOrganisation(id) {
    return new Promise((resolve, reject) => {
      HttpClient.setAuthorization();
      return HttpClient.get(`${ENDPOINTS.discover}/${id}`)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          if (error?.error) showError('Error', error.error);
          if (error?.message) showError('Error', error.message);
          reject(error);
        });
    });
  }
}
