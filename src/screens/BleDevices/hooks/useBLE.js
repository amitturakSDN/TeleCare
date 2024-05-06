import {useMemo, useState} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {BleManager, BleError} from 'react-native-ble-plx';
import DeviceInfo from 'react-native-device-info';
import base64 from 'react-native-base64';
import {
    request,
    PERMISSIONS,
    // openSettings,
    RESULTS,
    check,
} from 'react-native-permissions';
const BLODD_PRESSURE_UUID = '00001810-0000-1000-8000-00805f9b34fb';
const BLODD_PRESSURE_CHARACTERISTIC = '00002a35-0000-1000-8000-00805f9b34fb';

function useBLE() {
    //  const bleManager = useMemo(() => new BleManager(), []);
    const [allDevices, setAllDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [heartRate, setHeartRate] = useState(0);

    const requestAndroid31Permissions = async () => {
        console.log('requestAndroid31Permissions');
        const bluetoothScanPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
                title: 'Location Permission',
                message: 'Bluetooth Low Energy requires Location',
                buttonPositive: 'OK',
            },
        );
        const bluetoothConnectPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
                title: 'Location Permission',
                message: 'Bluetooth Low Energy requires Location',
                buttonPositive: 'OK',
            },
        );
        const fineLocationPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location Permission',
                message: 'Bluetooth Low Energy requires Location',
                buttonPositive: 'OK',
            },
        );

        console.log(
            'All Permissions status ',
            bluetoothScanPermission,
            bluetoothConnectPermission,
            fineLocationPermission,
        );

        return (
            bluetoothScanPermission === 'granted' &&
            bluetoothConnectPermission === 'granted' &&
            fineLocationPermission === 'granted'
        );
    };

    const requestPermissions = async () => {
        let API_LEVEL = await DeviceInfo.getApiLevel();
        if (Platform.OS === 'android') {
            if (API_LEVEL < 31) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'Bluetooth Low Energy requires Location',
                        buttonPositive: 'OK',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } else {
                const isAndroid31PermissionsGranted = await requestAndroid31Permissions();
                return isAndroid31PermissionsGranted;
            }
        } else {
            const result = await check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
            console.log(result, 'result....');
            if (result == RESULTS.GRANTED) {
                return true;
            }
            if (result !== RESULTS.GRANTED) {
                const permissionResult = await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
                console.log(permissionResult, 'permissionResult');
                if (permissionResult !== RESULTS.GRANTED) {
                    return false;
                }
                return false;
            }
        }
    };

    // const scanForPeripherals = () => {
    //     bleManager.startDeviceScan(null, null, async (error, device) => {
    //         if (error) {
    //             console.log('Scan error:', error);
    //             return;
    //         }

    //         if (device && device.name === 'A&D_UA-651BLE_8DA42A') {
    //             try {
    //                 console.log('Device found:', device.id);
    //                 const isConnected = await device.isConnected();

    //                 if (isConnected) {
    //                     const connected = await device.connect();
    //                     console.log('Connected:', connected.id);
    //                     const services = await connected.discoverAllServicesAndCharacteristics();
    //                     const serviceUUID = services?.serviceUUIDs?.[0];

    //                     if (serviceUUID) {
    //                         connected.monitorCharacteristicForService(
    //                             BLODD_PRESSURE_UUID,
    //                             BLODD_PRESSURE_CHARACTERISTIC,
    //                             onBloodPressureUpdate
    //                         );
    //                     } else {
    //                         console.log('No service UUID found');
    //                     }
    //                 }
    //             } catch (connectError) {
    //                 console.error('Connection error:', connectError);
    //             }
    //         }
    //     });
    // };

    // const connectToDevice = async (device) => {
    //     try {
    //         startStreamingData(device);
    //         console.error('deviceConnection connecting to device:', device);
    //     } catch (error) {
    //         console.error('Error connecting to device:', error);
    //         throw error;
    //     }
    // };

    // const disconnectFromDevice = () => {
    //     if (connectedDevice) {
    //         bleManager.cancelDeviceConnection(connectedDevice.id);
    //         setConnectedDevice(null);
    //         setHeartRate(0);
    //     }
    // };

    // const onHeartRateUpdate = (error, characteristic) => {
    //     console.log(error, characteristic, 'onBloodPressureUpdate.....');

    //     if (error) {
    //         console.log(error);
    //         return -1;
    //     } else if (!characteristic?.value) {
    //         console.log('No Data was received');
    //         return -1;
    //     }

    //     console.log(characteristic.value, 'characteristic.value received');
    //     const rawData = base64.decode(characteristic.value);
    //     let innerHeartRate = -1;

    //     const firstBitValue = Number(rawData) & 0x01;

    //     if (firstBitValue === 0) {
    //         innerHeartRate = rawData[1].charCodeAt(0);
    //     } else {
    //         innerHeartRate =
    //             Number(rawData[1].charCodeAt(0) << 8) +
    //             Number(rawData[2].charCodeAt(2));
    //     }

    //     setHeartRate(innerHeartRate);
    // };

    // const startStreamingData = async (device) => {
    //     if (device) {
    //         console.log('amit>>', device);
    //         device.monitorCharacteristicForService(
    //             BLODD_PRESSURE_UUID,
    //             BLODD_PRESSURE_CHARACTERISTIC,
    //             onBloodPressureUpdate
    //         );
    //         bleManager.stopDeviceScan();
    //     } else {
    //         console.log('No Device Connected');
    //     }
    // };

    return {
        requestPermissions,
        // scanForPeripherals,
        // allDevices,
        // connectToDevice,
        // connectedDevice,
        // disconnectFromDevice,
        // heartRate,
    };
}

export default useBLE;
