import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Text, Image, TouchableOpacity, Pressable, View, FlatList, Dimensions} from 'react-native';
import {useDispatch} from 'react-redux';
import {strings} from '@/localization';
import {styles} from '@/screens/CallingScreens/IncomingCall/IncomingCall.styles';
import {CallActionBox} from '@/components';
import {IMAGES} from '@/assets';
import {deviceHeight, deviceWidth, moderateScale, wp} from '@/hooks/scale';
import {NAVIGATION} from '@/constants';

export function IncomingCall({navigation}) {
    return (
        <View style={styles.container}>
            <View style={{alignItems: 'center'}}>
                <Text style={styles.name}>Dr. Danielle Borut</Text>
                <Text style={styles.time}>TeleCare Vedio...</Text>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'absolute',
                    left: moderateScale(80),
                    right: moderateScale(80),
                    bottom: moderateScale(10),
                }}>
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <View
                        style={{
                            width: moderateScale(55),
                            height: moderateScale(55),
                            borderRadius: moderateScale(55),
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'red',
                        }}>
                        <Image source={IMAGES.icons.chat.disconnectCall} />
                    </View>

                    <Text
                        style={{
                            fontSize: wp(4.1),
                            color: 'white',
                            marginTop: moderateScale(5),
                            fontWeight: '400',
                        }}>
                        Decline
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    tyle={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <View
                        style={{
                            width: moderateScale(55),
                            height: moderateScale(55),
                            borderRadius: moderateScale(55),
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'green',
                        }}>
                        <Image source={IMAGES.icons.chat.check} />
                    </View>

                    <Text
                        style={{
                            fontSize: wp(4.1),
                            color: 'white',
                            marginTop: moderateScale(5),
                            fontWeight: '400',
                        }}>
                        Accept
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
