import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Text, Image, TouchableOpacity, Pressable, View, FlatList, Dimensions} from 'react-native';
import {useDispatch} from 'react-redux';
import {strings} from '@/localization';
import {styles} from '@/screens/CallingScreens/AudioCall/AudioCall.styles';
import {CallActionBox} from '@/components';
import {IMAGES} from '@/assets';
import {deviceHeight, deviceWidth, moderateScale, wp} from '@/hooks/scale';
import {NAVIGATION} from '@/constants';

export function AudioCall({navigation}) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.pop()} style={styles.back}>
                <Image source={IMAGES.icons.session.back} />
            </TouchableOpacity>

            <View style={styles.userImage}>
                <Image
                    source={IMAGES.icons.session.defaultUserImage}
                    style={{
                        width: moderateScale(184),
                        height: moderateScale(184),
                    }}
                    resizeMode={'contain'}
                />
                <Text style={styles.name}>Dr. Danielle Borut</Text>
                <Text style={styles.time}>10:12</Text>
            </View>
            <CallActionBox isVedio={false} btnContainerStyles={styles.audioBtnContainer} />
        </View>
    );
}
