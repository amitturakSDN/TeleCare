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
import {kgTolbs} from '../../../utils/UnitConversion';
import deviceAPIs from '../../../utils/iHealthManager/getAPIs';
import iHealthAPI from '../../../utils/iHealthManager/iHealthAPI';

export function BluetoothScale({navigation, route}) {
  const {deviceId} = route.params;
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const unit = user?.user?.organizationUnit?.weight?.weight;
  const [modalVisible, setModalVisible] = useState(false);
  const [weight, setWeight] = useState(0);
  const [deviceStatus, setDeviceStatus] = useState(false);
  const [searchInterval, setSearchInterval] = useState(0);
  const [defaultMac, setDefaultMac] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const isLoading = useSelector(state =>
    isLoadingSelector([TYPES.ADD_MANUAL_READINGS], state),
  );
  const manualReadings = useSelector(state => state.manualReadings);
  const programId =
    manualReadings.deviceList && manualReadings.deviceList.programId
      ? manualReadings.deviceList.programId
      : null;
  const currentDate = moment(new Date()).format('MM/DD/YYYY');

  let mDeviceListener = deviceAPIs.getDeviceAPI('HS2S');

  useEffect(() => {
    setDeviceStatus(false);
    searchDevice();
    addListners();
    addDeviceListners();
  }, []);

  const searchDevice = () => {
    showSuccess('Searching Device');
    iHealthAPI.findDevice('HS2S');
  };

  const addListners = () => {
    iHealthAPI.addListener((macAddress, type) => {
      if (macAddress != 0) {
        __DEV__ &&
          console.log('STEP1: DEVICE_FOUND*****************', macAddress);
        setDefaultMac(macAddress);
        setDeviceStatus(true);
        deviceFound(macAddress, type);
      }
    });
  };

  const disconnectDevice = () => {
    __DEV__ && console.log('***********DISCONNECT_DEVICE********');
    mDeviceListener = deviceAPIs.getDeviceAPI('HS2S');
    mDeviceListener.apis.disconnect(defaultMac);
  };

  const deviceFound = (macAddress, type) => {
    iHealthAPI.connectDevice(macAddress, type);
    /**
     * Unit type:
     * 1: kg
     * 2: lbs
     **/
    mDeviceListener.apis.setUnit(macAddress, 1);
    mDeviceListener.apis.getAnonymousMemoryData(macAddress);
    const continiousMeasure = setInterval(() => {
      startMeasurement(macAddress);
    }, 5000);
    setSearchInterval(continiousMeasure);
  };

  const startMeasurement = macAddress => {
    mDeviceListener.apis.getAnonymousMemoryData(macAddress);
    addDeviceListners();
  };

  const addDeviceListners = () => {
    mDeviceListener.addEventListener(response => {
      __DEV__ && console.log(response, '***********MEASUREMENTS');
      // if (response) {
      //   unit == 'kg'
      //     ? setWeight(idx(response, _ => _.history_data[0].weight))
      //     : setWeight(kgTolbs(idx(response, _ => _.history_data[0].weight)));
      //     setModalVisible(!modalVisible);
      // }
      if (
        response &&
        response.history_data &&
        response.history_data.length > 0
      ) {
        const lastEntry =
          response.history_data[response.history_data.length - 1];
        const weight =
          unit === 'kg' ? lastEntry.weight : kgToLbs(lastEntry.weight);
        setWeight(weight);
        setModalVisible(!modalVisible);
      }
      /*
       if (idx(response, _ => _.history_data.length > 0)) {
        setWeight(idx(response, _ => _.history_data));
      }
       */
    });
  };

  const addReadings = () => {
    if (weight === 0) {
      alert('Please take a reading from device');
      return;
    } else {
      let request = {
        conditionName: strings.weight.short,
        reading: {
          weight: unit == 'kg' ? weight.toString() : kgTolbs(weight),
        },
      };
      let encryptPayload = {
        ...Validate.encryptInput(request),
      };
      dispatch(
        addManualReadings({
          patientId: AuthHelper.getPatientId(),
          effectiveDateTime: currentDate,
          conditionName: strings.weight.short,
          programId: programId,
          valueQuantity: {
            value: {
              weight: unit == 'kg' ? weight.toString() : kgTolbs(weight),
            },
            unit: {
              weight: unit,
            },
          },
          device: {
            reference: deviceId,
          },
        }),
      );
    }
  };

  const handleBack = () => {
    navigation.pop();
    disconnectDevice();
  };

  const onCloseModal = () => {
    setModalVisible(false);
    addReadings();
    disconnectDevice();
  };

  const sync = () => {
    if (deviceStatus == true) {
      addDeviceListners();
    } else {
      showError('Device not connected');
    }
  };

  useEffect(() => {
    // const weightInterval = setInterval(() => {
    //   console.log('***********CONTINIOUS SEARCHINGS********');
    //   iHealthAPI.findDevice('KN550');
    // }, 3000);

    mDeviceListener = deviceAPIs.getDeviceAPI('HS2S');
    return () => {
      mDeviceListener.removeEventListener();
      iHealthAPI.removeListener();
      // clearInterval(weightInterval);
      clearInterval(searchInterval);
      // Anything in here is fired on component unmount.
    };
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader
        title={strings.vital.title}
        onBackPress={() => handleBack()}
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
          title={strings.weight.title}
          firstImage={IMAGES.icons.vitals.weight}
          subText={weight.toString()}
          //unit={strings.weight.scale}
          unit={unit}
          lastImage={IMAGES.icons.vitals.sync}
          lastImageAlt={strings.others.sync}
          lastImagePress={() => sync()}
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
                <Text style={styles.title}>{strings.weight.title}</Text>
                <View style={styles.circleView}>
                  <View style={styles.outerCircle}>
                    <View style={styles.midCircle}>
                      <View style={styles.innerCircle}>
                        <Text style={styles.readingCount}>{weight}</Text>
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
