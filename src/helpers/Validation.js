import {showError} from '@/hooks/message';
import {strings} from '@/localization';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,100}$/;
// const PASSWORD_REGEX =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@|_;#><$/!%*?&])[A-Za-z\d@$><!;%*|/_#?&]{8,}$/;
// Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
const PHONE_REGEX = /^(\d{1})?\d{10}$/;
//const PHONE_REGEX_1 = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
const DECIMAL_REGEX = /^\d+(\.\d{1,2})?$/;
const NUMERIC_REGEX = /^\d+$/;
const SINGLE_DECIMAL_REGEX = /^\d+(\.\d{1})?$/;
const FORCE_SINGLE_DECIMAL_REGEX = /^\d+\.\d{1}$/;
const SECRET_KEY = '';

const IGNORE_FIELDS = [
  'id',
  'patientId',
  'url',
  'notificationId',
  'patientRefId',
  'userId',
  'photo',
  'reference',
  'type',
  'country',
  'patient',
  'use',
  'updatedAt',
  'createdAt',
  // 'relationship'
];
const empty = input => {
  return space(input) == '' || space(input) == 0 || space(input) == null;
};

const space = input => {
  return input ? input.trim() : null;
};

const email = input => {
  return !EMAIL_REGEX.test(input);
};

const password = input => {
  return !PASSWORD_REGEX.test(input);
};

const phone = input => {
  return !PHONE_REGEX.test(removeMasking(input));
};

const decimal = input => {
  return !DECIMAL_REGEX.test(input);
};

const single_decimal = input => {
  return !SINGLE_DECIMAL_REGEX.test(input);
};

const force_single_decimal = input => {
  return !FORCE_SINGLE_DECIMAL_REGEX.test(input);
};

const numeric = input => {
  return !NUMERIC_REGEX.test(input);
};

const cipher = salt => {
  const textToChars = text => text.split('').map(c => c.charCodeAt(0));
  const byteHex = n => ('0' + Number(n).toString(16)).substr(-2);
  const applySaltToChar = code =>
    textToChars(salt).reduce((a, b) => a ^ b, code);
  return text =>
    text.split('').map(textToChars).map(applySaltToChar).map(byteHex).join('');
};
const decipher = salt => {
  const textToChars = text => text.split('').map(c => c.charCodeAt(0));
  const applySaltToChar = code =>
    textToChars(salt).reduce((a, b) => a ^ b, code);
  return encoded =>
    encoded
      .match(/.{1,2}/g)
      .map(hex => parseInt(hex, 16))
      .map(applySaltToChar)
      .map(charCode => String.fromCharCode(charCode))
      .join('');
};

const encrypt = data => {
  __DEV__ && console.log(data, '__ecrypt_data_________');
  const encryptData = cipher(SECRET_KEY);
  // return encryptData(data);
  return data;
  // return Aes.randomKey(16).then(iv => {
  //     return Aes.encrypt(data, SECRET_KEY, iv, 'aes-256-cbc').then(cipher => ({
  //         cipher,
  //         iv,
  //     }))
  // })
  // __DEV__ && console.log("encrypt this value",data)
  // return CryptoJS.AES.encrypt(data, SECRET_KEY)?.toString()
};

const decrypt = data => {
  const decryptData = decipher(SECRET_KEY);
  const decryptedValue = decryptData(data);
  //__DEV__ && console.log(data, '__decrypt_data ===>', decryptedValue);
  // return decryptedValue;
  return data;
};

const errorDisplay = (msg, callback) => {
  return callback(msg);
};

const encryptInput = input => {
  if (!input) return input;
  // __DEV__ && console.log(input, '__encryptInput');

  let dataType = typeof input;

  if (dataType === 'object') {
    Object.keys(input).forEach(key => {
      __DEV__ && console.log(!IGNORE_FIELDS.includes(key), key);
      input[key] = !IGNORE_FIELDS.includes(key)
        ? encryptInput(input[key])
        : input[key];
    });
    input['isMobile'] = true;
    return input;
  } else if (dataType === 'boolean') {
    return input;
  } else {
    // return encrypt(input);
    return input;
  }
};

const decryptInput = input => {
  if (!input) return input;
  // __DEV__ && console.log(input, '__decryptInput');

  let dataType = typeof input;
  //  console.log(dataType, 'dataType');
  if (dataType === 'object') {
    Object.keys(input).forEach(key => {
      input[key] = !IGNORE_FIELDS.includes(key)
        ? decryptInput(input[key])
        : input[key];
    });

    return input;
  } else if (dataType === 'boolean') {
    return input;
  } else {
    // return decrypt(input);
    return input;
  }
};

const removeMasking = data => {
  let removePlus = data.replace('+', '');
  let value = removePlus.replace('(', '');
  let newNo = value.replace(')', '');
  let space = newNo.replace(' ', '');
  let dash = space.replace('-', '');
  __DEV__ && console.log(dash);
  return dash;
};

export const Validate = {
  space,
  email,
  phone,
  password,
  encrypt,
  decrypt,
  empty,
  errorDisplay,
  encryptInput,
  decryptInput,
  decimal,
  single_decimal,
  force_single_decimal,
  numeric
};
