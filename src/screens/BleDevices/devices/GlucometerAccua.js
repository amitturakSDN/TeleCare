import { addManualReadings } from '@/actions/ManualReadingsActions';
import { Fonts, IMAGES } from '@/assets';
import { AppHeader, ParentContainer, TextView, VitalList } from '@/components';
import { NAVIGATION } from '@/constants';
import { AuthHelper, Validate } from '@/helpers';
import { showError, showSuccess } from '@/hooks/message';
import { deviceWidth, moderateScale } from '@/hooks/scale';
import { strings } from '@/localization';
import { bytesToString } from 'convert-string';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Linking, Modal, Platform, View, NativeModules, NativeEventEmitter, } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { useDispatch, useSelector } from 'react-redux';
import { cToF, mgdLTommol } from '../../../utils/UnitConversion';
import useBLE from '../hooks/useBLE';
import { ReadingModal } from '../modal/ReadingModal';
import styles from './styles';
import { colors } from 'react-native-elements';
const GLUCOSE_SERVICE_UUID = '1808';
const GLUCOSE_CHARACTER_UUID = '0x2A18';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export function GlucometerAccua({ navigation, route }) {
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
  const unit = user?.user?.organizationUnit?.blood_glucose?.glucose;
  const [glucoseValue, setGlucoseValue] = useState(0);
  const [connectedDevice, setConnectedDevice] = useState([]);
  const [peripheralId, setPeripheralId] = useState(null);
  const subscription = useRef(null);
  let listeners = []
  /**Start scanning the devices */
  useEffect(() => {
    BleManager.start({ showAlert: true });
    bleListenerCall();

  }, []);

  useEffect(() => {
    return () => {
      console.log('unmount>>>>>');
      if (peripheralId != null) {
        removeBleListener(peripheralId);
      }
    };
  }, [peripheralId]);

  const bleListenerCall = () => {

    listeners = [
      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      ),
      bleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectPeripheral,
      ),
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      ),
      bleManagerEmitter.addListener(
        'BleManagerConnectPeripheral',
        handleConnectPeripheral,
      ),
    ];
    setTimeout(() => {
      scanForDevices();
    }, 1000);
  };

  const removeBleListener = (peripheralId) => {

    console.debug('[app] main component unmounting. Removing listeners...', listeners, peripheralId);
    for (const listener of listeners) {
      listener.remove();
    }
    if (peripheralId != null) {
      if (Platform.OS == 'android') {
        removeBondFromDevice();
      }
      disconnectFromDevice()
    }
  };


  const disconnectFromDevice = () => {
    console.log('peripheralIdtoremove1', peripheralId);
    BleManager.disconnect(peripheralId)
      .then(() => {
        console.log("Disconnected");
        
      })
      .catch((error) => {
        console.log("Error disconnecting:", error);
      });
  };

  const removeBondFromDevice = () => {
    console.log('peripheralIdtoremove2', peripheralId);
    BleManager.removeBond(peripheralId)
      .then(() => {
        console.log("Bond removed successfully");
      })
      .catch(() => {
        console.log("Failed to remove the bond");
      });
  };

  const handleDiscoverPeripheral = device => {
    // console.log(device, device.name, 'handleDiscoverPeripheral>>>2');
    console.log('handleDiscoverPeripheral', device.name, 'peripheralId before set:', peripheralId);
    // console.log(typeof device.name,'checktype>>>');
    if (device.name == "meter+38431018") {
      setPeripheralId(device.id)
      console.log('device matched. peripheralId after set11:', peripheralId);
      // if(peripheralId == null){
      //   showSuccess('Device already paired please take reading.')
      // }
    
      if (Platform.OS == 'android') {

        BleManager.createBond(device.id)
          .then(() => {
            console.log('createBond success or there is already an existing one');
            BleManager.stopScan();
            connectToDevice(device);
          })
          .catch(() => {
            //  console.log("fail to bond");
            // showError("Please enter valid code");
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
      } else {
        BleManager.stopScan();
        connectToDevice(device);

      }
    }
  };

  const handleUpdateValueForCharacteristic = device => {
    console.log(device, 'handleUpdateValueForCharacteristic>>');
    if (device && device.value) {
      showSuccess('Syncing successful');
      try {
        console.log(device.value, 'device.value>>>>>');
        const bgValues = device.value;
        console.log(bgValues,'binaryString>>>>>>');
        const glucosemmol = (bgValues[12]/18).toFixed(1)
        const glucosemgdl = bgValues[12]
        handleDataConversion(glucosemmol,glucosemgdl);
      } catch (error) {
        console.error('Error reading characteristic:', error);
      }
    } else {
      showError(`Error in syncing data with the device`);
    }
  };

  /**Convert value to corresponding unit */
  const handleDataConversion = (glucosemmol,glucosemgdl) => {
    unit == 'mg/dL' ? setGlucoseValue(glucosemgdl) : setGlucoseValue(glucosemmol);
    showSuccess('Syncing successfull');
    setModalVisible(!modalVisible);
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
    navigation.goBack();
  };
  const connectToDevice = async peripheral => {
    // Connect to the selected peripheral
    console.log('connectToDevice peripheralId:', peripheralId);
    try {
      console.log('peripheralId>>', peripheralId);
      // if(peripheral.id == null){

      // }
      BleManager.connect(peripheral.id).then(
        async res => {
          retrieveDeviceServices(peripheral);
          console.log(res, 'connect successs');
        },
        err => {
          // showError(`Error device connection ${JSON.stringify(err)}`);
          // navigation.goBack();
          // Alert.alert(
          //   'You should connect the A&D ',
          //   '',
          //   [
          //     {
          //       text: 'OK',
          //       onPress: () => openDeviceSettings(),
          //       //  onPress: () =>  openSettings().catch(
          //       //      () => __DEV__ && console.log('cannot open settings'),
          //       //    ),
          //     },
          //   ],
          // );
          console.log(err, 'connect error');
          if(err.includes('Peer removed pairing information')){
            showSuccess('Forget meter+38431018 from bluetooth device list first')
          }

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
        characteristics => characteristics.service === GLUCOSE_SERVICE_UUID,
      );
      if (targetCharacteristic) {
        console.log(targetCharacteristic, 'targetCharacteristic>>>>');
        BleManager.startNotification(
          device.id,
          targetCharacteristic.service,
          targetCharacteristic.characteristic,
        )
          .then(async (res) => {
            BleManager.isPeripheralConnected(device.id).then((isConnected) => {
              console.log(isConnected,'isConnected>>');
              if (isConnected) {
                showSuccess('Connected successfully');
              } else {
                console.log("Peripheral is NOT connected!");
              }
            });
            console.log(res,'res<<<<<<<<<<<1');
            await BleManager.read(
              device.id,
              targetCharacteristic.service,
              targetCharacteristic.characteristic,
            );
          })
          .catch(error => {
            // Failure code
            console.log(error,'errorheck>>>');
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
          .then(res => {
            showSuccess('Searching Device');
          })
          .catch(error => {
            showError(`Error during scan for devices ${JSON.stringify(error)}`);
          });
      } else {
        showError('Error in requesting bluetooth permission');
      }
    } catch (error) {
      showError(`Error catch during scan for devices`);
    }
  };

  const addReadings = () => {
    if (glucoseValue.toString() == '0') {
      alert('Please take a reading from device');
      return;
    } else {
      let request = {
        conditionName: strings.bloodGlucose.short,
        reading: {
          glucose: glucoseValue.toString(),
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
          conditionName: strings.bloodGlucose.short,
          programId: programId,
          valueQuantity: {
            value: {
              glucose:glucoseValue.toString()
            },
            unit: {
              glucose: unit,
            },
          },
          device: {
            reference: deviceId,
          },
        }),
      );
    }
  };
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
      {/* <Loader isLoading={isLoading} /> */}
      <ParentContainer>
        <TextView
          title={strings.vital.takeReading}
          viewStyle={{ marginVertical: moderateScale(20) }}
          textStyle={{
            fontSize: moderateScale(18),
            fontFamily: Fonts.regular,
            fontWeight: '600',
          }}
          color={colors.PRIMARY_BLUE}
        />
        <VitalList
          title={strings.bloodGlucose.title}
          firstImage={IMAGES.icons.vitals.glucose}
          subText={glucoseValue.toString()}
          unit={unit}
          lastImage={IMAGES.icons.vitals.sync}
          lastImageAlt={strings.others.sync}
          lastImagePress={() => scanForDevices()}
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
          unit={unit}
          value={glucoseValue.toString()}
          onCloseModal={() => onCloseModal()}
        />
      </Modal>
    </View>
  );
}

