import {sign}  from 'react-native-pure-jwt';

import { CREDENTIALS } from '@/constants';

function makeId(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function generateJwt(
  sessionName,
  roleType
) {

  try {
    const token = await sign(
      {
        app_key: CREDENTIALS.zoomAppKey,
        version: 1,
        user_identity: makeId(10),
        iat: new Date().getTime(),
        exp: new Date(Date.now() + 23 * 3600 * 1000).getTime(),
        tpc: sessionName,
        role_type: parseInt(roleType, 10),
      },
      CREDENTIALS.zoomAppSecret,
      {
        alg: 'HS256',
      }
    );
    return token;
  } catch (e) {
    __DEV__ && console.log(e);
    return '';
  }
}