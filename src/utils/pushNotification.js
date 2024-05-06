import PushNotification, {Importance} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import {Alert, Platform} from 'react-native';
import {fcmToken} from '../actions/NotificationActions';
import {store} from '@/store';

export const BackgroundNotificationManager = response => {
  Platform.OS == 'ios' && PushNotification.setApplicationIconBadgeNumber(0);
  if (Platform.OS === 'ios') {
    __DEV__ &&
      console.log(
        PushNotificationIOS,
        PushNotificationIOS.addNotificationRequest,
        'PushNotificationIOS',
      );
  }
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    __DEV__ &&
      console.log(
        '***********MESSAGE_IN_BACKGROUND************',
        JSON.stringify(remoteMessage),
      );
    if (response) response(true);
    if (Platform.OS === 'android') {
        PushNotification.localNotification({
    //  title: remoteMessage.data.default,
        channelId: 'TeleCare123',
        channelName: 'TeleCare notification',
        autoCancel: true,
        message: remoteMessage.data.default,
    //  bigText:remoteMessage.notification.body,
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds
        playSound: true, // (optional) default: true
      });
    }
    if (Platform.OS === 'ios') {
      PushNotificationIOS.addNotificationRequest({
        title: remoteMessage.data.title,
        body: remoteMessage.data.body,
        id: new Date().toISOString(),
      });
      PushNotificationIOS.presentLocalNotification({
        title: remoteMessage.data.title,
        body: remoteMessage.data.body,
        id: new Date().toISOString(),
      });
    }
  });
};

export const GetBadgeNumber = async response => {
  PushNotification.getApplicationIconBadgeNumber(notificationBadge => {
    __DEV__ && console.log('NOTIFICATION_BADGE', response(notificationBadge));
  });
};

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    messaging().registerDeviceForRemoteMessages();
    messaging()
      .getToken()
      .then(token => {
        console.log('***********NOTI_AUTH_STATUS TOKEN************', token);
        __DEV__ && console.log('storee', store);
        store.dispatch(fcmToken(token));
      });
    PushNotification.getChannels(function (channel_ids) {
    });
    messaging().onTokenRefresh(token => {
      __DEV__ && console.log('messaging.onTokenRefresh', token);
    });
  }
};

export const InitiateNotification = () => {
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: 'TeleCare123', // (required)
        channelName: 'TeleCare notification',
        autoCancel: true, // (required)
        //  channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: 'notification.mp3', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      created => __DEV__ && console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }
  messaging().onMessage(async remoteMessage => {
    __DEV__ &&
      console.log(
        '***********NEW_MESSAGE Foreground ************ ',
        JSON.stringify(remoteMessage),
      );
    if (Platform.OS === 'android') {
      PushNotification.localNotification({
        //title: remoteMessage.data.default,
        channelId: 'TeleCare123',
        channelName: 'TeleCare notification',
        autoCancel: true,
        message: remoteMessage.data.default,
        // bigText:remoteMessage.notification.body,
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds
        playSound: true, // (optional) default: true
      });
    }
    if (Platform.OS === 'ios') {
      PushNotificationIOS.addNotificationRequest({
        title: remoteMessage.data.title,
        body: remoteMessage.data.body,
        id: new Date().toISOString(),
      });
      PushNotificationIOS.presentLocalNotification({
        title: remoteMessage.data.title,
        body: remoteMessage.data.body,
        id: new Date().toISOString(),
      });
    }
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    __DEV__ &&
      console.log(
        '***********NOTIFICATION_CAUSED_APP_OPEN_FROM_BACKGROUND_STATE**********',
        remoteMessage,
        remoteMessage.data.default,
        //remoteMessage.notification,
      );
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      __DEV__ &&
        console.log(
          '***********NOTIFICATION_CAUSED_APP_OPEN_FROM_QUIT_STATE************',
          remoteMessage,
        );
    });
};
