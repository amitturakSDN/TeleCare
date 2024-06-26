import { PERMISSIONS } from 'react-native-permissions';
export const PLATFORM_PERMISSIONS = {
    ios: [
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.MICROPHONE,
        //PERMISSIONS.IOS.PHOTO_LIBRARY,
    ],
    android: [
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.READ_PHONE_STATE,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ],
};