import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {hide} from 'react-native-bootsplash';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {RootNavigator} from '@/navigation';
import {persistor, store} from '@/store';
import FlashMessage from 'react-native-flash-message';
import {LogBox, Platform, AppState} from 'react-native';
import {ZoomVideoSdkProvider} from '@zoom/react-native-videosdk';
import {Splash} from '@/screens';
import {iHealthDeviceManagerModule} from '../modified_modules/@ihealth/ihealthlibrary-react-native';
import {
    BackgroundNotificationManager,
    InitiateNotification,
    requestUserPermission,
} from './utils/pushNotification';
import iHealthAPI from './utils/iHealthManager/iHealthAPI';
import Config from 'react-native-config';
export function App() {
    const [splash, setSplash] = useState(true);
    // const [filename,setFileName] = useState('')
    useEffect(() => {
        setTimeout(() => {
            setSplash(false);
        }, 300);
        requestUserPermission();
        InitiateNotification();
        BackgroundNotificationManager();
    });
    LogBox.ignoreAllLogs();

    //iHealth labs iOS and android .pem file for the authorization in the App with their respective bundle id //
    if (Platform.OS === 'ios') {
        __DEV__ && console.log('IOS************************', iHealthDeviceManagerModule);
        let filename = 'org_reactjs_native_example_TeleCare_ios.pem';
        if (Config.APP_TYPE == 'QA') {
            filename = 'org_react_js_native_qa_TeleCare_ios.pem';
        }
        console.log(filename, 'filename in ios .....');
        iHealthDeviceManagerModule.sdkAuthWithLicense(filename); //Autnentication
        iHealthAPI.authenConfigureInfo();
    } else {
        __DEV__ && console.log('ANDROID********************', iHealthDeviceManagerModule);
        let filename = 'com_TeleCare_android.pem';
        if (Config.APP_TYPE == 'QA') {
            filename = 'com_TeleCare_qa_android.pem';
        }
        console.log(filename, 'filename in android.....');
        iHealthDeviceManagerModule.sdkAuthWithLicense(filename); //Autnentication
    }

    if (splash) {
        return <Splash />;
    } else {
        console.log('render..', store, persistor);
        return (
            <ZoomVideoSdkProvider
                config={{
                    appGroupId: 'group.org.reactjs.native.example.Foneme',
                    domain: 'zoom.us',
                    enableLog: false,
                }}>
                <Provider store={store}>
                    <RootNavigator />
                    <FlashMessage position="top" />
                </Provider>
            </ZoomVideoSdkProvider>
            // <ZoomVideoSdkProvider
            //     config={{
            //         appGroupId: 'group.org.reactjs.native.example.Foneme',
            //         domain: 'zoom.us',
            //         enableLog: false,
            //     }}>
            //     <Provider store={store}>
            //         <PersistGate onBeforeLift={hide} persistor={persistor}>
            //             <RootNavigator />
            //         </PersistGate>
            //         <FlashMessage position="top" />
            //     </Provider>
            // </ZoomVideoSdkProvider>
        );
    }
}
