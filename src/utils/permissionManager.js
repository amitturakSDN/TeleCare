import {
  checkMultiple,
  requestMultiple,
  PERMISSIONS,
  openSettings,
} from 'react-native-permissions';
import {Platform} from 'react-native';

const PermissionManager = () => {
  const checkPermissionsAndroid = () => {
    checkMultiple([
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    ]).then(statuses => {
      if (
        statuses[PERMISSIONS.ANDROID.CAMERA] == 'granted' &&
        statuses[PERMISSIONS.ANDROID.RECORD_AUDIO] == 'granted' &&
        statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] == 'granted' &&
        statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] == 'granted' &&
        statuses[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] == 'granted' &&
        statuses[PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE] == 'granted' &&
        statuses[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] == 'granted'
      ) {
        return
      } else {
        requestPermissionsAndroid();
      }
    });
  };
  const checkPermissionsIos = () => {
    checkMultiple([
      PERMISSIONS.IOS.LOCATION_ALWAYS,
      PERMISSIONS.IOS.MEDIA_LIBRARY,
      PERMISSIONS.IOS.PHOTO_LIBRARY,
      PERMISSIONS.IOS.SPEECH_RECOGNITION,
      PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
    ]).then(statuses => {
      if (
        statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] == 'granted' &&
        statuses[PERMISSIONS.IOS.MEDIA_LIBRARY] == 'granted' &&
        statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] == 'granted' &&
        statuses[PERMISSIONS.IOS.SPEECH_RECOGNITION] == 'granted' &&
        statuses[PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL] == 'granted'
      ) {
        return
      } else {
        requestPermissionsIos();
      }
    });
  };

  const requestPermissionsAndroid = () => {
    requestMultiple([
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    ]).then(statuses => {
      if (
        statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] == 'granted' ||
        statuses[PERMISSIONS.ANDROID.RECORD_AUDIO] == 'granted' ||
        statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] == 'granted' ||
        statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] == 'granted' ||
        statuses[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] == 'granted' ||
        statuses[PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE] == 'granted' ||
        statuses[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] == 'granted'
      ) {
      } else if (
        statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] == 'denied' ||
        statuses[PERMISSIONS.ANDROID.RECORD_AUDIO] == 'denied' ||
        statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] == 'denied' ||
        statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] == 'denied' ||
        statuses[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] == 'denied' ||
        statuses[PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE] == 'denied' ||
        statuses[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] == 'denied'
      ) {
        PermissionManager(); //Re requesting
      } else if (
        statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] == 'blocked' ||
        statuses[PERMISSIONS.ANDROID.RECORD_AUDIO] == 'blocked' ||
        statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] == 'blocked' ||
        statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] == 'blocked' ||
        statuses[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] == 'blocked' ||
        statuses[PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE] == 'blocked' ||
        statuses[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] == 'blocked'
      ) {
        openSettings().catch(
          () => __DEV__ && console.log('cannot open settings'),
        );
      }
    });
  };

  const requestPermissionsIos = () => {
    requestMultiple([
      PERMISSIONS.IOS.LOCATION_ALWAYS,
      PERMISSIONS.IOS.MEDIA_LIBRARY,
      PERMISSIONS.IOS.PHOTO_LIBRARY,
      PERMISSIONS.IOS.SPEECH_RECOGNITION,
      PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
    ]).then(statuses => {
      if (
        statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] == 'granted' &&
        statuses[PERMISSIONS.IOS.MEDIA_LIBRARY] == 'granted' &&
        statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] == 'granted' &&
        statuses[PERMISSIONS.IOS.SPEECH_RECOGNITION] == 'granted' &&
        statuses[PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL] == 'granted'
      ) {
        return
      } else if (
        statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] == 'denied' &&
        statuses[PERMISSIONS.IOS.MEDIA_LIBRARY] == 'denied' &&
        statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] == 'denied' &&
        statuses[PERMISSIONS.IOS.SPEECH_RECOGNITION] == 'denied' &&
        statuses[PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL] == 'denied'
      ) {
        PermissionManager(); //Re requesting
      } else if (
        statuses[PERMISSIONS.IOS.LOCATION_ALWAYS] == 'blocked' &&
        statuses[PERMISSIONS.IOS.MEDIA_LIBRARY] == 'blocked' &&
        statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] == 'blocked' &&
        statuses[PERMISSIONS.IOS.SPEECH_RECOGNITION] == 'blocked' &&
        statuses[PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL] == 'blocked'
      ) {
        openSettings().catch(
          () => __DEV__ && console.log('cannot open settings'),
        );
      }
    });
  };
  if (Platform.OS == 'ios') {
    checkPermissionsIos();
  } else {
    checkPermissionsAndroid();
  }
};

export default PermissionManager;
