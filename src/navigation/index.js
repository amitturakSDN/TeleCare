import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {useColorScheme, DeviceEventEmitter, Platform, Linking} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {DrawerNavigator} from '@/navigation/DrawerNavigator';
import {AppNavigator} from '@/navigation/AppNavigator';
import {BottomNavigator} from './BottomNavigator';
import {AuthNavigator} from '@/navigation/AuthNavigator';
import {getUser} from '@/selectors/UserSelectors';
import {theme} from '@/theme';
import {navigationRef} from '@/navigation/RootNavigation';
import * as RootNavigation from '@/navigation/RootNavigation';
import {NAVIGATION} from '@/constants';
import {ActivityIndicator, View} from 'react-native';
import {store} from '@/store';
import {logout} from '@/actions/UserActions';
import {openSettings, PERMISSIONS, requestMultiple} from 'react-native-permissions';
import {RelatedPersonSignup, Splash} from '@/screens';
import Config from 'react-native-config';
export function RootNavigator() {
    const user = useSelector(getUser);
    const scheme = useColorScheme();
    let linking = {
        prefixes: ['https://www.google.com', 'TeleCare://'],
        config,
    };

    if (Config.APP_TYPE != 'DEV') {
        linking = {
            prefixes: ['https://www.google.com', 'TeleCare_qa://'],
            config,
        };
    }

    console.log(Config, 'Config.APP_TYPE', linking);

    const config = {
        screens: {
            Login: {
                path: 'Login',
            },
            RelatedPersonSignup: {
                path: 'RelatedPersonSignup/:id',
                parse: {
                    id: id => `${id}`,
                },
            },
        },
    };

    const requestPermissionsAndroid = () => {
        requestMultiple([
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.RECORD_AUDIO,
        ]).then(statuses => {
            if (
                statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] == 'granted' ||
                statuses[PERMISSIONS.ANDROID.RECORD_AUDIO] == 'granted'
            ) {
            } else if (
                statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] == 'denied' ||
                statuses[PERMISSIONS.ANDROID.RECORD_AUDIO] == 'denied'
            ) {
            } else if (
                statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] == 'blocked' ||
                statuses[PERMISSIONS.ANDROID.RECORD_AUDIO] == 'blocked'
            ) {
                openSettings().catch(() => __DEV__ && console.log('cannot open settings'));
            }
        });
    };

    useEffect(() => {
        requestPermissionsAndroid();
        //  buildLink()
        // function addLinkingEventListener() {
        //   Linking.addEventListener('url', handleUrl);
        // }
    });

    useEffect(() => {
        const linkingEvent = Linking.addEventListener('url', handleDeepLink);
        Linking.getInitialURL().then(url => {
            __DEV__ && console.log('intial url', url);
            if (url && url.toString() !== null) {
                if (url.toString().includes('SignIn')) {
                    RootNavigation.navigate(NAVIGATION.login);
                } else {
                    handleDeepLink(url);
                }
            }
        });
        return () => {
            linkingEvent.remove();
        };
    }, []);

    const handleDeepLink = async url_payload => {
        // add your code here

        let url = url_payload.url;
        if (url && url.includes('RelatedPersonSignup')) {
            const urlArr = url.split(/(=|&)/);
            const id = urlArr[6];
            const email = urlArr[2];
            const ref = urlArr[10];
            /**When user is not logged In move directly to register */
            if (store.getState().user && !store.getState().user?.user) {
                RootNavigation.navigate(NAVIGATION.relatedPersonSignup, {
                    id,
                    email,
                    ref,
                });
            } else {
                /**When user is logged In then clear existing user data first and then open register page */
                store.dispatch(logout());
                setTimeout(() => {
                    RootNavigation.navigationRef.reset({
                        index: 1,
                        routes: [
                            {
                                name: NAVIGATION.relatedPersonSignup,
                                params: {
                                    id,
                                    email,
                                    ref,
                                },
                            },
                        ],
                    });
                }, 1000);
            }
        }

        if (url && url.includes('auth/setpassword')) {
            const urlArr = url.split(/(=|&)/);
            console.log(urlArr, 'urlArr....');
            //  const id = urlArr[6];
            const email = urlArr[2];
            console.log('Set Password', email);
            RootNavigation.navigate(NAVIGATION.otpVerification, {
                authType: 'verify',
                username: email,
                password: '',
            });
            //  const ref = urlArr[10];
        }
    };

    return (
        <NavigationContainer
            linking={linking}
            theme={theme[scheme]}
            ref={navigationRef}
            fallback={<Splash />}>
            {user ? <DrawerNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}
