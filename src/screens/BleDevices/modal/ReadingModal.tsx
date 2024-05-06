import React, {useEffect, useState} from 'react';
import {Fonts, IMAGES} from '@/assets';
import {Text, View, Modal} from 'react-native'; // Assuming Device is imported from 'react-native-ble-plx'
import {NAVIGATION} from '@/constants';
import {Button} from '@/components';
import {useDispatch, useSelector} from 'react-redux';
import {deviceWidth, moderateScale} from '@/hooks/scale';

import {strings} from '@/localization';
import styles from '../devices/styles';

export function ReadingModal(props) {
    const {
        title = strings.temperature.title,
        heartRate = '0',
        value = 0,
        unit = 'C',
        onCloseModal = () => {},
        child,
    } = props;
    return (
        <View style={[styles.innerContent, {flex: 1}]}>
            <View
                style={{
                    width: moderateScale(85),
                    height: moderateScale(8),
                    marginTop: moderateScale(15),
                    alignItems: 'center',
                    backgroundColor: '#D9D9D9',
                    alignSelf: 'center',
                }}
            />
            <Text style={styles.title}>{title}</Text>

            <View style={styles.circleView}>
                <View style={styles.outerCircle}>
                    <View style={styles.midCircle}>
                        <View style={styles.innerCircle}>
                            <Text style={styles.readingCount}>{value.toString()}</Text>
                            <Text style={styles.scale}>{unit}</Text>
                            {title == 'Blood Pressure' && (
                                <>
                                    <Text style={styles.readingCount}>{heartRate}</Text>
                                    <Text style={styles.scale}>{strings.oximeter.scale}</Text>
                                </>
                            )}
                        </View>
                    </View>
                </View>
            </View>
            <Button
                title={'CLOSE'}
                style={{
                    borderRadius: 100,
                    width: deviceWidth - 200,
                    height: moderateScale(40),
                    marginTop: moderateScale(40),
                }}
                onPress={() => {
                    onCloseModal();
                }}
            />
        </View>
    );
}
