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
import idx from 'idx';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {Modal, Text, View} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import {useDispatch, useSelector} from 'react-redux';
import {mmHgTokPA, mmHgTopsi} from '../../../utils/UnitConversion';
import deviceAPIs from '../../../utils/iHealthManager/getAPIs';
import iHealthAPI from '../../../utils/iHealthManager/iHealthAPI';

export function BluetoothBloodPressure({navigation, route}) {
  const {deviceId} = route.params;
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [diastolic, setDiastolic] = useState(0);
  const [systolic, setSystolic] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [deviceStatus, setDeviceStatus] = useState(false);
  const [defaultMac, setDefaultMac] = useState('');
  const [infoText, setInfoText] = useState();
  const isLoading = useSelector(state =>
    isLoadingSelector([TYPES.ADD_MANUAL_READINGS], state),
  );
  const manualReadings = useSelector(state => state.manualReadings);
  const programId =
    manualReadings.deviceList && manualReadings.deviceList.programId
      ? manualReadings.deviceList.programId
      : null;
  const currentDate = moment(new Date()).format('MM/DD/YYYY');
  const user = useSelector(state => state.user);
  const unit = user?.user?.organizationUnit?.blood_pressure?.diastolic;
  let mDeviceListener = deviceAPIs.getDeviceAPI('KN550');

  useEffect(() => {
    setDeviceStatus(false);
    searchDevice();
    addListners();
    addDeviceListners();
  }, []);

  const searchDevice = () => {
    iHealthAPI.findDevice('KN550');
    showSuccess('Searching Device');
  };

  const addDeviceListners = () => {
    mDeviceListener.addEventListener(response => {
      __DEV__ && console.log('STEP(x): SETTING_RECEIVED_DATA*****************');
      // if (response.data) {
      //   console.log(response.data,'response.data+++');
      //   showSuccess('Syncing successfull');
      //   setSystolic(idx(response, _ => _.data[0].sys));
      //   setDiastolic(idx(response, _ => _.data[0].dia));
      //   setHeartRate(idx(response, _ => _.data[0].heartRate));
      //   setModalVisible(!modalVisible);
      //   disconnectDevice();
      // }
      if (response?.data && response?.data?.length > 0) {
        const lastData = response.data[response.data.length - 1];
        console.log(lastData, 'response.data+++');
        showSuccess('Syncing successfull');
        setSystolic(idx(lastData, _ => _.sys));
        setDiastolic(idx(lastData, _ => _.dia));
        setHeartRate(idx(lastData, _ => _.heartRate));
        setModalVisible(!modalVisible);
        disconnectDevice();
      }
    });
  };

  const addListners = () => {
    iHealthAPI.addListener((macAddress, type) => {
      if (macAddress != 0) {
        __DEV__ && console.log('STEP1: DEVICE_FOUND*****************');
        setDeviceStatus(true);
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
    setDefaultMac(macAddress);
    startMeasurement(macAddress);
    // setDeviceAdress(macAddress);
  };

  const startMeasurement = address => {
    setTimeout(() => {
      __DEV__ &&
        console.log('STEP3: RECEIVING_DATA_FROM_DEVICE********', address);
      mDeviceListener.apis.getOffLineData(address);
    }, 5000);
  };

  const toogleModal = () => {
    if (deviceStatus) {
      addDeviceListners();
    } else {
      showError('Device not connected');
    }

    /*
     if (deviceStatus) {
      setTimeout(() => {
        console.log('STEP3: RECEIVING_DATA_FROM_DEVICE********', deviceAddress);
        mDeviceListener.apis.getOffLineData(address);
      }, 4000);
      addDeviceListners(); // DEVICE SPECIFIC LISTNERS
    } else {
     // iHealthAPI.findDevice('KN550');
      // showSuccess('Syncing data');
    //  showSuccess('Disconnecting Device');
     // disconnectDevice();
    }
    */
  };

  const disconnectDevice = () => {
    mDeviceListener.apis.disconnect(defaultMac);
  };
  const addReadings = () => {
    if (diastolic === 0 || systolic === 0 || heartRate === 0) {
      alert('Please take a reading from device');
      return;
    }
    // systolic and diastolic reading request
    let request = {
      conditionName: strings.bloodPressure.short,
      reading: {
        //  systolic: systolic.toString(),
        //  diastolic: diastolic.toString(),
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

    __DEV__ && console.log('abc', request);
    let encryptPayload = {
      ...Validate.encryptInput(request),
    };
    delete encryptPayload.isMobile;
    delete encryptPayload.reading.isMobile;
    dispatch(
      addManualReadings({
        patientId: AuthHelper.getPatientId(),
        effectiveDateTime: currentDate,
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
          //  unit={strings.bloodPressure.scale}
          lastImage={IMAGES.icons.vitals.sync}
          lastImageAlt={strings.others.sync}
          lastImagePress={() => toogleModal()}
          disabled={true}
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
            //onSwipeUp={() => setModalVisible(true)}
            onSwipeDown={() => onCloseModal()}>
            <Modal
              animationType="slide"
              presentationStyle="formSheet"
              visible={modalVisible}
              // backdropColor={'transparent'}
              onRequestClose={() => onCloseModal()}>
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
                <Text style={styles.title}>{strings.bloodPressure.title}</Text>
                <View style={styles.circleView}>
                  <View style={styles.outerCircle}>
                    <View style={styles.midCircle}>
                      <View style={styles.innerCircle}>
                        <Text style={styles.readingCount}>
                          {unit == 'mmHg'
                            ? systolic
                            : unit == 'kPa'
                            ? mmHgTokPA(systolic).toFixed(1).toString()
                            : unit == 'psi'
                            ? mmHgTopsi(systolic).toFixed(1).toString()
                            : systolic}
                          /
                          {unit == 'mmHg'
                            ? diastolic
                            : unit == 'kPa'
                            ? mmHgTokPA(diastolic).toFixed(1).toString()
                            : unit == 'psi'
                            ? mmHgTopsi(diastolic).toFixed(1).toString()
                            : diastolic}
                        </Text>
                        <Text style={styles.scale}>{unit}</Text>

                        <Text style={styles.readingCount}>{heartRate}</Text>
                        <Text style={styles.scale}>
                          {strings.oximeter.scale}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* 
                 <Text style={styles.msg}>You are doing great!</Text>
                 */}
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
