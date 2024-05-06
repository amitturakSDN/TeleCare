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
import {colors} from '@/theme';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {Modal, Text, View} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import {useDispatch, useSelector} from 'react-redux';
import {mgdLTommol} from '../../../utils/UnitConversion';
import deviceAPIs from '../../../utils/iHealthManager/getAPIs';
import iHealthAPI from '../../../utils/iHealthManager/iHealthAPI';

export function BluetoothBloodGlucose({navigation, route}) {
  const {deviceId} = route.params;
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const unit = user?.user?.organizationUnit?.blood_glucose?.glucose;
  const [modalVisible, setModalVisible] = useState(false);
  const [glucoseValue, setGlucoseValue] = useState(0);
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

  let mDeviceListener = deviceAPIs.getDeviceAPI('BG5S');
  useEffect(() => {
    setDeviceStatus(false);
    searchDevice();
    addListners(); // GLOBAL IHEALTH LISTNERS
    addDeviceListners(); // DEVICE SPECIFIC LISTNERS
  }, []);

  const searchDevice = () => {
    iHealthAPI.findDevice('BG5S');
    showSuccess('Searching Device');
  };

  const addDeviceListners = () => {
    mDeviceListener.addEventListener(response => {
      __DEV__ && console.log('STEP(x): SETTING_RECEIVED_DATA*****************');
      if (response && response.result_value) {
        __DEV__ && console.log('response blood glucose', response);
        setGlucoseValue(response.result_value);
        showSuccess('Syncing successfull');
        setModalVisible(!modalVisible);
        disconnectDevice();
      } else {
        __DEV__ && console.log('No data recieved ');
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
  };

  const startMeasurement = address => {
    mDeviceListener.apis.setUnit(address, 2);
    setTimeout(() => {
      __DEV__ &&
        console.log('STEP3: RECEIVING_DATA_FROM_DEVICE********', address);
      mDeviceListener.apis.startMeasure(address, 2);
    }, 5000);
  };

  const toogleModal = () => {
    __DEV__ && console.log('device status', deviceStatus);
    if (deviceStatus) {
      addDeviceListners();
      // showSuccess('Disconnecting Device');
      // disconnectDevice();
    } else {
      showError('Device not connected');
    }
  };

  const disconnectDevice = () => {
    mDeviceListener.apis.disconnect(defaultMac);
  };

  const addReadings = () => {
    if (glucoseValue === 0) {
      alert('Please take a reading from device');
      return;
    }
    let request = {
      conditionName: strings.bloodGlucose.short,
      reading: {
        glucose:
          unit == 'mg/dL' ? glucoseValue.toString() : mgdLTommol(glucoseValue),
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
        conditionName: strings.bloodGlucose.short,
        programId: programId,
        valueQuantity: {
          value: {
            glucose:
              unit == 'mg/dL'
                ? glucoseValue.toString()
                : mgdLTommol(glucoseValue),
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
          color={colors.PRIMARY_BLUE}
        />
        <VitalList
          title={strings.bloodGlucose.title}
          firstImage={IMAGES.icons.vitals.glucose}
          subText={
            unit == 'mg/dL' ? glucoseValue.toString() : mgdLTommol(glucoseValue)
          }
          // unit={strings.bloodGlucose.scale}
          unit={unit}
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
            //  onSwipeUp={() => setModalVisible(true)}
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
                <Text style={styles.title}>{strings.bloodGlucose.title}</Text>
                <View style={styles.circleView}>
                  <View style={styles.outerCircle}>
                    <View style={styles.midCircle}>
                      <View style={styles.innerCircle}>
                        <Text style={styles.readingCount}>
                          {unit == 'mg/dL'
                            ? glucoseValue.toString()
                            : mgdlTommol(glucoseValue)}
                        </Text>
                        <Text style={styles.scale}>{unit}</Text>
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
