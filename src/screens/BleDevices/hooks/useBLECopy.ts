import {useMemo, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import DeviceInfo from 'react-native-device-info';

const BLODD_PRESSURE_UUID = '00001810-0000-1000-8000-00805f9b34fb';
const BLODD_PRESSURE_CHARACTERISTIC = '00002a49-0000-1000-8000-00805f9b34fb';

interface BluetoothLowEnergyApi {
    requestPermissions(): Promise<boolean>;
    scanForPeripherals(): void;
    allDevices: Device[];
}

function useBLE(): BluetoothLowEnergyApi {
    const bleManager = useMemo(() => new BleManager(), []);
    const [allDevices, setAllDevices] = useState<Device[]>([]);
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
            return true;
        }
    };
    const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

    const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
        console.log(error, device?.name,'indsad>>>>>');
      if (error) {
        console.log(error);
      }
      if (device && device.name?.includes("A&D_UA-651BLE_8DA42A")) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });
    return {
        requestPermissions,
        scanForPeripherals,
        allDevices
    };
}

export default useBLE;
