import { Fonts, IMAGES } from '@/assets';
import { AppHeader, ParentContainer, TextView, VitalList } from '@/components';
import { NAVIGATION } from '@/constants';
import { AuthHelper, Validate } from '@/helpers';
import { showError, showSuccess } from '@/hooks/message';
import { moderateScale } from '@/hooks/scale';
import { strings } from '@/localization';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, Alert, Linking, Platform } from 'react-native';
import base64 from 'react-native-base64';
import BleManager from 'react-native-ble-manager';
import { useDispatch, useSelector } from 'react-redux';
import useBLE from '../hooks/useBLE';
import { ReadingModal } from '../modal/ReadingModal';
import styles from './styles';

import { mmHgTokPA, mmHgTopsi } from '../../../utils/UnitConversion';
import { addManualReadings } from '@/actions/ManualReadingsActions';
import { openSettings } from 'react-native-permissions';

const BLOOD_PRESSURE_UUID = '1810';
export function BloodPressureAd({ navigation, route }) {
    // const manager = new BleManager();
    const { requestPermissions } = useBLE();
    const dispatch = useDispatch();
    const deviceId = route?.params?.deviceId;
    const user = useSelector(state => state.user);
    const manualReadings = useSelector(state => state.manualReadings);
    const programId =
        manualReadings.deviceList && manualReadings.deviceList.programId
            ? manualReadings.deviceList.programId
            : null;
    const [modalVisible, setModalVisible] = useState(false);
    const unit = user?.user?.organizationUnit?.blood_pressure?.diastolic;

    const [diastolic, setDiastolic] = useState(0);
    const [systolic, setSystolic] = useState(0);
    const [heartRate, setHeartRate] = useState(0);

    const [connectedDevice, setConnectedDevice] = useState([]);
    const subscription = useRef(null);
    /**Start scanning the devices */
    useEffect(() => {
        BleManager.start({ showAlert: true });
        bleListenerCall();
        return () => {
            removeBleListener();
        };
    }, []);

    const bleListenerCall = () =>{
        BleManager.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        BleManager.addListener('BleManagerConnectPeripheral', handleConnectPeripheral);
        BleManager.addListener(
            'BleManagerDidUpdateValueForCharacteristic',
            handleUpdateValueForCharacteristic,
        );
        BleManager.addListener('BleManagerDisconnectPeripheral', handleDisconnectPeripheral);
        setTimeout(() => {
            scanForDevices()
        }, 1000);
    }

    const removeBleListener = () =>{
         // Remove event listeners when the component unmounts
         BleManager.removeListener('BleManagerDiscoverPeripheral');
         BleManager.removeListener('BleManagerConnectPeripheral');
         BleManager.removeListener('BleManagerDidUpdateValueForCharacteristic');
         BleManager.removeListener('BleManagerDisconnectPeripheral');
    }

    const handleDiscoverPeripheral = device => {
        console.log(device, 'handleDiscoverPeripheral');

            if (device.name == 'A&D_UA-651BLE_8DA42A') {
                if(Platform.OS == 'android'){
                    BleManager.createBond(device.id)
                    .then(() => {
                        
                        console.log("createBond success or there is already an existing one");
                        BleManager.stopScan();
                        connectToDevice(device);
                    })
                    .catch(() => {
                        // showError("Requesting to pair device");
                    //     navigation.goBack()
                    //     Alert.alert('You should connect the A&D smartbp device first before taking reading from settings on long pressing bp device', '', [
                    //    {
                    //      text: 'OK',
                    //      onPress: () =>  openDeviceSettings(),
                    //     //  onPress: () =>  openSettings().catch(
                    //     //      () => __DEV__ && console.log('cannot open settings'),
                    //     //    ),
                    //    },
                    //  ]);
                    });
                }else{
                    connectToDevice(device)
                }
                
           
        }
    };

    const handleUpdateValueForCharacteristic = device => {
        console.log(device, 'handleUpdateValueForCharacteristic>>');

        if (device && device.value) {
            showSuccess('Syncing successfull');
            // const rawData = base64.decode(characteristic?.value);
            setSystolic(device.value[1]);
            setDiastolic(device.value[3]);
            setHeartRate(device.value[7]);
            setModalVisible(!modalVisible);
        } else {
            showError(`Error in syncing data with device`);
        }
    };

    const handleConnectPeripheral = async ({ peripheral, error }) => {
        // Handle connection to a peripheral
        if (!error) {
            console.log(peripheral, 'handleConnectPeripheral');
            console.log(`Connected to ${peripheral.name || peripheral.id}`);
        } else {
            console.error(`Connection error: ${error}`);
        }
    };

    const handleDisconnectPeripheral = ({ peripheral }) => {
        // Handle disconnection from a peripheral
        console.log(`Disconnected from ${peripheral.name || peripheral.id}`);
    };
    const openDeviceSettings = () => {
        Linking.openSettings();
        navigation.goBack()
      };
    const connectToDevice = async peripheral => {
        
        // Connect to the selected peripheral
        console.log('inn>>',peripheral);
        try {
            BleManager.connect(peripheral.id).then(
                async res => {
                    // showSuccess('Connected successfully');
                    retrieveDeviceServices(peripheral);
                    console.log(res, 'connect successs');
                },
                err => {
                    // showError(`Error device connection ${JSON.stringify(err)}`);
                    navigation.goBack()
                    Alert.alert('You should connect the A&D smartbp device first before taking reading from settings on long pressing bp device', '', [
                   {
                     text: 'OK',
                     onPress: () =>  openDeviceSettings(),
                    //  onPress: () =>  openSettings().catch(
                    //      () => __DEV__ && console.log('cannot open settings'),
                    //    ),
                   },
                 ]);
                    console.log(err, 'connect error');
                },
            );
        } catch (error) {
            console.error(`Connection error: ${error}`);
        }
    };

    const retrieveDeviceServices = device => {
        BleManager.retrieveServices(device.id).then(peripheralInfo => {
            console.log('Discovered services:', peripheralInfo);
            // Find the target service
            const targetCharacteristic = peripheralInfo.characteristics.find(
                characteristics => characteristics.service === BLOOD_PRESSURE_UUID,
            );
            if (targetCharacteristic) {
                console.log(targetCharacteristic, 'targetCharacteristic>>>>');
                BleManager.startNotification(
                    device.id,
                    targetCharacteristic.service,
                    targetCharacteristic.characteristic,
                )
                .then(async () => {
                    await BleManager.read(
                        device.id,
                        targetCharacteristic.service,
                        targetCharacteristic.characteristic,
                    );
                })
                .catch(error => {
                    // Failure code
                    console.log(error);
                });
            }
        });
    };
  /**Start scanning for device */
  const scanForDevices = async () => {
    try {

        const isPermissionsEnabled = await requestPermissions();
        if (isPermissionsEnabled) {
            
           
            BleManager.scan([], 5, true)
            .then((res)=>{
                showSuccess('Searching Device')
            })
            .catch((error)=>{
                showError(`Error during scan for devices ${JSON.stringify(error)}`);
            })
        } else {
            showError('Error in requesting bluetooth permission');
        }
    } catch (error) {
        showError(`Error catch during scan for devices`);
    }
};
    const addReadings = () => {
        if (diastolic === 0 || systolic === 0 || heartRate === 0) {
            alert('Please take a reading from device');
            return;
        } else {
            let request = {
                conditionName: strings.bloodPressure.short,
                reading: {
                    systolic:
                        unit == 'mmHg'
                            ? systolic.toString()
                            : unit == 'kPa'
                                ? mmHgTokPA(systolic).toString()
                                : unit == 'psi'
                                    ? mmHgTopsi(systolic).toString()
                                    : systolic.toString(),
                    diastolic:
                        unit == 'mmHg'
                            ? diastolic.toString()
                            : unit == 'kPa'
                                ? mmHgTokPA(diastolic).toString()
                                : unit == 'psi'
                                    ? mmHgTopsi(diastolic).toString()
                                    : diastolic.toString(),
                },
            };
            let encryptPayload = {
                ...Validate.encryptInput(request),
            };
            delete encryptPayload.isMobile;
            delete encryptPayload.reading.isMobile;
            dispatch(
                addManualReadings({
                    patientId: AuthHelper.getPatientId(),
                    effectiveDateTime: moment(new Date()).format('MM/DD/YYYY'),
                    conditionName: strings.bloodPressure.short,
                    programId: programId,
                    valueQuantity: {
                        value: {
                            systolic:
                                unit == 'mmHg'
                                    ? systolic.toString()
                                    : unit == 'kPa'
                                        ? mmHgTokPA(systolic).toString()
                                        : unit == 'psi'
                                            ? mmHgTopsi(systolic).toString()
                                            : systolic.toString(),
                            diastolic:
                                unit == 'mmHg'
                                    ? diastolic.toString()
                                    : unit == 'kPa'
                                        ? mmHgTokPA(diastolic).toString()
                                        : unit == 'psi'
                                            ? mmHgTopsi(diastolic).toString()
                                            : diastolic.toString(),
                        },
                        unit: {
                            systolic: unit,
                            diastolic: unit,
                        },
                    },
                    device: {
                        reference: deviceId,
                    },
                }),
            );

            // HeartRate  reading request
            let requestHeartRate = {
                conditionName: strings.oximeter.short,
                reading: {
                    heartRate: heartRate.toString(),
                },
            };
            __DEV__ && console.log('abc', request);
            let encryptPayloadHeartRate = {
                ...Validate.encryptInput(requestHeartRate),
            };
            delete encryptPayloadHeartRate.isMobile;
            delete encryptPayloadHeartRate.reading.isMobile;
            dispatch(
                addManualReadings({
                    patientId: AuthHelper.getPatientId(),
                    effectiveDateTime: moment(new Date()).format('MM/DD/YYYY'),
                    conditionName: strings.oximeter.short,
                    programId: programId,
                    valueQuantity: {
                        value: {
                            heartRate: heartRate.toString(),
                        },
                        unit: {
                            heartRate: strings.oximeter.scale,
                        },
                    },
                    device: {
                        reference: deviceId,
                    },
                }),
            );
        }
    };

    /**On Reading Modal Close */
    const onCloseModal = () => {
        setModalVisible(false);
        addReadings();
    };

    return (
        <View style={styles.container}>
            <AppHeader
                title={strings.vital.title}
                onBackPress={() => navigation.pop()}
                onRightPress={() => navigation.push(NAVIGATION.notification)}
            />
            <ParentContainer>
                <TextView
                    title={strings.vital.takeReading}
                    viewStyle={{ marginVertical: moderateScale(20) }}
                    textStyle={{
                        fontSize: moderateScale(18),
                        fontFamily: Fonts.regular,
                        fontWeight: '600',
                    }}
                    color={'#005DA8'}
                />
                <VitalList
                    title={strings.bloodPressure.title}
                    firstImage={IMAGES.icons.vitals.bloodPressure}
                    subText={
                        unit == 'mmHg'
                            ? systolic.toString() + '/' + diastolic.toString()
                            : unit == 'kPa'
                                ? mmHgTokPA(systolic).toFixed(1).toString() +
                                '/' +
                                mmHgTokPA(diastolic).toFixed(1).toString()
                                : unit == 'psi'
                                    ? mmHgTopsi(systolic).toFixed(1).toString() +
                                    '/' +
                                    mmHgTopsi(diastolic).toFixed(1).toString()
                                    : systolic.toString() + '/' + diastolic.toString()
                    }
                    unit={unit}
                    lastImage={IMAGES.icons.vitals.sync}
                    lastImageAlt={strings.others.sync}
                    lastImagePress={() => {
                        scanForDevices();
                    }}
                    disabled={true}
                />
            </ParentContainer>

            <Modal
                animationType="slide"
                presentationStyle="formSheet"
                visible={modalVisible}
                onRequestClose={() => {
                    onCloseModal();
                }}>
                <ReadingModal
                    title={strings.bloodPressure.title}
                    heartRate={heartRate.toString()}
                    value={`${unit == 'mmHg'
                            ? systolic
                            : unit == 'kPa'
                                ? mmHgTokPA(systolic).toFixed(1).toString()
                                : unit == 'psi'
                                    ? mmHgTopsi(systolic).toFixed(1).toString()
                                    : systolic
                        }/${unit == 'mmHg'
                            ? diastolic
                            : unit == 'kPa'
                                ? mmHgTokPA(diastolic).toFixed(1).toString()
                                : unit == 'psi'
                                    ? mmHgTopsi(diastolic).toFixed(1).toString()
                                    : diastolic
                        }`}
                    unit={unit}
                    onCloseModal={() => onCloseModal()}
                />
            </Modal>
        </View>
    );
}
