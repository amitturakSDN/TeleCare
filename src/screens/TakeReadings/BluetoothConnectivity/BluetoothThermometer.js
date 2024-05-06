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
import {Modal, Platform, Text, View} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import {useDispatch, useSelector} from 'react-redux';
import {cToF} from '../../../utils/UnitConversion';
import deviceAPIs from '../../../utils/iHealthManager/getAPIs';
import iHealthAPI from '../../../utils/iHealthManager/iHealthAPI';
export function BluetoothThermometer({navigation, route}) {
  const {deviceId} = route.params;
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const unit = user?.user?.organizationUnit?.temperature?.temperature;
  const [modalVisible, setModalVisible] = useState(false);
  const [temperature, setTemperature] = useState(0);
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
  const [historyData, setHistoryData] = useState([]);

  let mDeviceListener = deviceAPIs.getDeviceAPI('PT3SBT');

  useEffect(() => {
    searchDevice();
    addListners();
    addDeviceListners();
  }, []);

  const searchDevice = () => {
    __DEV__ && console.log('STEP1: **********SEARCHING PT3SBT********');
    iHealthAPI.findDevice('PT3SBT');
    showSuccess('Searching Device');
  };

  const addDeviceListners = () => {
    mDeviceListener.addEventListener(response => {
      __DEV__ &&
        console.log(
          'STEP(x): SETTING_RECEIVED_DATA*****************',
          response,
        );
      if (Platform.OS === 'ios') {
        if (response && response.TEMPERATURE) {
          unit == '°F'
            ? setTemperature(cToF(response.TEMPERATURE / 100))
            : setTemperature(response.TEMPERATURE / 100);
          //  setHistoryData(response.history)
          showSuccess('Syncing successfull');
          setModalVisible(!modalVisible);
        } else if (response && response?.errorid === 400) {
          __DEV__ && console.log('Reading fail');
        }
      } else {
        if (response && response.Tbody) {
          unit == '°F'
            ? setTemperature(cToF(response.Tbody / 100))
            : setTemperature(response.Tbody / 100);
          //  setHistoryData(response.history)
          showSuccess('Syncing successfull');
          setModalVisible(!modalVisible);
        } else if (response && response.errorid === 400) {
          __DEV__ && console.log('Reading fail');
        }
      }
    });
  };

  const addListners = () => {
    iHealthAPI.addListener((macAddress, type) => {
      if (macAddress != 0) {
        setDefaultMac(macAddress);
        setDeviceStatus(true);
        deviceFound(macAddress, type);
      }
    });
    /*
    iHealthAPI.addListener((disconnect, status) => {
   __DEV__ &&   console.log('**********DISCONNECTED pt3bs********');

      if (disconnect == 0 || status == 0) setDeviceStatus(false);
    }); //GLOBAL DISCONNECT LISTNER
    */
    //GLOBAL LISTNER
  };

  const deviceFound = (macAddress, type) => {
    __DEV__ && console.log('STEP2: CONNECT_DEVICE********', macAddress);
    iHealthAPI.connectDevice(macAddress, type);
    startMeasurement(macAddress);
    setDefaultMac(macAddress);
  };

  const startMeasurement = address => {
    //  mDeviceListener.apis.setUnit(address,1);
    //  mDeviceListener.apis.getUnit(address);
    __DEV__ &&
      console.log('STEP3: RECEIVING_DATA_FROM_DEVICE********', address);
    mDeviceListener.apis.getHistoryData(address);
    // mDeviceListener.apis.deleteHistory(address);
    addDeviceListners();
  };

  const toogleModal = () => {
    if (deviceStatus) {
      addDeviceListners(); // DEVICE SPECIFIC LISTNERS
    } else {
      showError('Device not connected');
    }
  };

  const disconnectDevice = () => {
    __DEV__ && console.log('***********DISCONNECT_DEVICE********');
    mDeviceListener = deviceAPIs.getDeviceAPI('PT3SBT');
    mDeviceListener.apis.disconnect(defaultMac);
    setDeviceStatus(false);
  };

  const addReadings = () => {
    if (temperature === 0) {
      alert('Please take a reading from device');
      return;
    } else {
      let request = {
        conditionName: strings.temperature.short,
        reading: {
          temperature: temperature.toString(),
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
          conditionName: strings.temperature.short,
          programId: programId,
          valueQuantity: {
            value: {
              temperature: formattedTemperature,
            },
            unit: {
              temperature: unit,
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
    disconnectDevice();
  };
  let formattedTemperature = temperature.toString();
  if (unit === '°C') {
    const temperatureString = temperature?.toString();
    if (temperatureString) {
      const [integerPart, decimalPart] = temperatureString.split('.');
      if (integerPart && decimalPart && decimalPart[0]) {
        formattedTemperature = `${integerPart}.${decimalPart[0]}`;
      }
    }
  }
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
          title={strings.temperature.title}
          firstImage={IMAGES.icons.vitals.thermometer}
          subText={temperature.toString()}
          unit={unit}
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
            // onSwipeUp={() => setModalVisible(true)}
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

                <Text style={styles.title}>{strings.temperature.title}</Text>

                <View style={styles.circleView}>
                  <View style={styles.outerCircle}>
                    <View style={styles.midCircle}>
                      <View style={styles.innerCircle}>
                        <Text style={styles.readingCount}>
                          {formattedTemperature}
                        </Text>
                        <Text style={styles.scale}>{unit}</Text>
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
