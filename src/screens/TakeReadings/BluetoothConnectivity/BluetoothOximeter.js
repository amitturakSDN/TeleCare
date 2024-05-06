import {TYPES, addManualReadings} from '@/actions/ManualReadingsActions';
import {Fonts, IMAGES} from '@/assets';
import {
  AppHeader,
  Button,
  Loader,
  ParentContainer,
  TextView,
  VitalList,
} from '@/components';
import {NAVIGATION} from '@/constants';
import {AuthHelper, Validate} from '@/helpers';
import {showError, showSuccess} from '@/hooks/message';
import {deviceWidth, moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {styles} from '@/screens/VitalMonitoring/VitalMonitoring.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {Modal, Text, View} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import {useDispatch, useSelector} from 'react-redux';
import deviceAPIs from '../../../utils/iHealthManager/getAPIs';
import iHealthAPI from '../../../utils/iHealthManager/iHealthAPI';

export function BluetoothOximeter({navigation, route}) {
  const {deviceId} = route.params;
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [heartRate, setHeartRate] = useState(0);
  const [oxygen, setOxygen] = useState(0);
  const [deviceStatus, setDeviceStatus] = useState(false);
  const [defaultMac, setDefaultMac] = useState('');
  const isLoading = useSelector(state =>
    isLoadingSelector([TYPES.ADD_MANUAL_READINGS], state),
  );
  const manualReadings = useSelector(state => state.manualReadings);
  const programId =
    manualReadings.deviceList && manualReadings.deviceList.programId
      ? manualReadings.deviceList.programId
      : null;
  const currentDate = moment(new Date()).format('MM/DD/YYYY');
  let mDeviceListener = deviceAPIs.getDeviceAPI('PO3');
  useEffect(() => {
    searchDevice();
    addListners();
    disconnectDevice();
    // GLOBAL IHEALTH LISTNERS
  }, []);

  const searchDevice = () => {
    iHealthAPI.findDevice('PO3');
    showSuccess('Searching Device');
  };

  const addDeviceListners = () => {
    mDeviceListener.addEventListener(response => {
      __DEV__ &&
        console.log(
          'STEP(x): SETTING_RECEIVED_DATA*****************',
          response.data,
        );
      if (response.bloodoxygen) {
        showSuccess('Syncing successfull');
        setOxygen(response.bloodoxygen);
        setHeartRate(response.heartrate);
        setModalVisible(!modalVisible);
        disconnectDevice();
      }
    });
  };

  const addListners = () => {
    iHealthAPI.addListener((macAddress, type) => {
      if (macAddress != 0) {
        __DEV__ && console.log('STEP1: DEVICE_FOUND*****************');
        setDefaultMac(macAddress);
        deviceFound(macAddress, type);
      }
    });
    iHealthAPI.addListener((disconnect, status) => {
      __DEV__ && console.log('STEP(x): DEVICE_DISCONNECTED*****************');
      if (disconnect == 0 || status == 0) setDeviceStatus(false);
    });
  };

  const deviceFound = (macAddress, type) => {
    __DEV__ && console.log('STEP2: CONNECT_DEVICE********', macAddress);
    iHealthAPI.connectDevice(macAddress, type);
    setDeviceStatus(true);
    startMeasurement(macAddress);
  };

  const startMeasurement = macAddress => {
    __DEV__ &&
      console.log('STEP3: RECEIVING_DATA_FROM_DEVICE********', macAddress);
    mDeviceListener.apis.startMeasure(macAddress);
    addDeviceListners();
  };

  const toogleModal = () => {
    if (deviceStatus) {
      __DEV__ &&
        console.log('STEP3: RECEIVING_DATA_FROM_DEVICE********', defaultMac);
      mDeviceListener.apis.startMeasure(defaultMac);
      addDeviceListners(); // DEVICE SPECIFIC LISTNERS
    } else {
      showError('Device not connected');
    }
  };

  const onCloseModal = () => {
    setModalVisible(false);
    addReadings();
    disconnectDevice();
  };

  const disconnectDevice = () => {
    mDeviceListener = deviceAPIs.getDeviceAPI('PO3');
    mDeviceListener.apis.disconnect(defaultMac);
    setDeviceStatus(false);
  };

  const addReadings = () => {
    if (heartRate === 0 && oxygen === 0) {
      alert('Please take a reading from device');
      return;
    } else {
      // oxygen
      let request = {
        conditionName: strings.oximeter.oxygen,
        reading: {
          oxygen: oxygen.toString(),
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
          effectiveDateTime: currentDate,
          conditionName: strings.oximeter.oxygen,
          programId: programId,
          valueQuantity: {
            value: {
              oxygen: oxygen.toString(),
            },
            unit: {
              oxygen: strings.oximeter.scale1,
            },
          },
          device: {
            reference: deviceId,
          },
        }),
      );
      // heart rate
      let requestHeartRate = {
        conditionName: strings.oximeter.short,
        reading: {
          heartRate: heartRate.toString(),
        },
      };
      let encryptPayloadHeartRate = {
        ...Validate.encryptInput(requestHeartRate),
      };
      delete encryptPayload.isMobile;
      delete encryptPayload.reading.isMobile;
      dispatch(
        addManualReadings({
          patientId: AuthHelper.getPatientId(),
          effectiveDateTime: currentDate,
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

  const onBack = () => {
    disconnectDevice();
    navigation.pop();
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title={strings.vital.title}
        onBackPress={() => onBack()}
        onRightPress={() => navigation.push(NAVIGATION.notification)}
      />
      <Loader isLoading={isLoading} />
      <ParentContainer>
        <TextView
          title={strings.vital.takeReading}
          viewStyle={{marginVertical: moderateScale(20)}}
          textStyle={{
            fontSize: moderateScale(18),
            fontFamily: Fonts.regular,
            fontWeight: '600',
          }}
          color={'#005DA8'}
        />
        <VitalList
          title={strings.oximeter.title}
          firstImage={IMAGES.icons.vitals.heartrate}
          subText={oxygen.toString() + '/' + heartRate.toString()}
          unit={strings.oximeter.scale1 + '/' + strings.oximeter.scale}
          lastImage={IMAGES.icons.vitals.sync}
          lastImageAlt={strings.others.sync}
          lastImagePress={() => toogleModal()}
        />
        {/* 
        <View
          style={{
            marginTop: moderateScale(95),
          }}>
          <BottomButton
            title={strings.btn.title}
            style={{
              borderRadius: 100,
              backgroundColor: 'red',
              width: '100%',
            }}
            onPress={() => addReadings()}
          />
        </View>
        */}

        {modalVisible ? (
          <GestureRecognizer
            style={{flex: 1}}
            //   onSwipeUp={() => setModalVisible(true)}
            onSwipeDown={() => onCloseModal()}>
            <Modal
              animationType="slide"
              presentationStyle="formSheet"
              visible={modalVisible}
              // backdropColor={'transparent'}
              onRequestClose={() => {
                onCloseModal();
              }}>
              <View style={styles.innerContent}>
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
                <Text style={styles.title}>{strings.oximeter.title}</Text>
                <View style={styles.circleView}>
                  <View style={styles.outerCircle}>
                    <View style={styles.midCircle}>
                      <View style={styles.innerCircle}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.readingCount}>
                            {oxygen + ' / '}
                          </Text>
                          <Text style={styles.readingCount}>{heartRate}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.scale}>
                            {strings.oximeter.scale1 + ' / '}
                          </Text>
                          <Text style={styles.scale}>
                            {strings.oximeter.scale}
                          </Text>
                        </View>
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
                  onPress={() => onCloseModal()}
                />
              </View>
            </Modal>
          </GestureRecognizer>
        ) : null}
      </ParentContainer>
    </View>
  );
}
