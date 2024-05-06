import {HttpClient} from './HttpClient';
import {ENDPOINTS} from '@/constants/sensitive';
import {showError} from '@/hooks/message';
export class SignupRelativeController {
  static signup(payload) {
    // let patientRefId = payload.id.replace("invite_", '')
    let request = {
      id: payload.id,
      patientRefId: payload.ref,
      patient: {
        reference: 'Patient/' + payload.ref,
        type: 'Patient',
      },
      text: {
        status: 'generated',
      },
      name: [
        {
          use: 'usual',
          text: `${payload.firstName} ${payload.lastName}`,
          family: payload.lastName,
          given: [payload.firstName],
        },
      ],
      gender: payload.gender,
      birthDate: payload.dob,
      telecom: [
        {
          system: 'email',
          value: payload.email,
          use: 'work',
        },
        {
          system: 'phone',
          value: payload.phone,
          use: 'home',
        },
      ],
      email: payload.email,
      isMobile: true,
    };
    return new Promise((resolve, reject) => {
      // HttpClient.setUnAuthHeaderStatic()
      // HttpClient.setAuthorization();
      return HttpClient.post(ENDPOINTS.signupRelative, request)
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

  static checkUser(payload) {
    // let patientRefId = payload.id.replace("invite_", '')

    return new Promise((resolve, reject) => {
      // HttpClient.setUnAuthHeaderStatic()
      // HttpClient.setAuthorization();
      return HttpClient.post(ENDPOINTS.checkUserRegister, payload)
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
