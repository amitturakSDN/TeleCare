import {TYPES, listDevices} from '@/actions/ManualReadingsActions';
import {organizationDetails} from '@/actions/ProfileActions';
import {IMAGES} from '@/assets';
import {AppHeader, Loader, ParentContainer, TextView, VitalList} from '@/components';
import {NAVIGATION} from '@/constants';
import {showSuccess} from '@/hooks/message';
import {strings} from '@/localization';
import {styles} from '@/screens/VitalMonitoring/VitalMonitoring.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {colors} from '@/theme';
import PermissionManager from '@/utils/permissionManager';
import {useEffect, useState} from 'react';
import {FlatList, Image, TouchableOpacity, View} from 'react-native';
import {BluetoothStatus, useBluetoothStatus} from 'react-native-bluetooth-status';
import {useDispatch, useSelector} from 'react-redux';

export function VitalMonitoring({navigation, route}) {
    const {device, manual} = route.params;
    const dispatch = useDispatch();
    const {user} = useSelector(state => state);
    const [deviceActive, setDeviceActive] = useState(device ? device : false);
    const [manualActive, setManualActive] = useState(manual ? manual : false);
    const isLoading = useSelector(state => isLoadingSelector([TYPES.LIST_DEVICES], state));
    const [btStatus] = useBluetoothStatus();
    const manualReadings = useSelector(state => state.manualReadings);
    const DEVICE_LIST = manualReadings?.deviceList?.device;
    // Get unique device names
    const uniqueDeviceIds = [...new Set(DEVICE_LIST?.map(item => item.id))];
    // Filter DEVICE_LIST to include only the first occurrence of each unique device name
    const filteredDeviceList = uniqueDeviceIds?.map(id => {
        return DEVICE_LIST?.find(item => item.id === id);
    });

    useEffect(() => {
        dispatch(organizationDetails(user?.user?.orgId));
    }, []);
    useEffect(() => {
        PermissionManager();
        BluetoothStatus.addListener(isEnabled => {
            __DEV__ && console.log(isEnabled, 'CHECK BLUETOOTH STATUS');
        });
        getBluetoothState();
        dispatch(listDevices());
    }, [btStatus]);

    const list = [
        {
            title: 'Blood Glucose',
            logo: IMAGES.icons.vitals.glucose,
            color: 'rgba(221, 76, 56, 0.11)',
            onPress: () => navigation.push(NAVIGATION.bloodGlucose),
            conditionName: 'blood_glucose',
        },
        {
            title: 'Blood Pressure',
            logo: IMAGES.icons.vitals.bloodPressure,
            color: 'rgba(0, 93, 168, 0.12)',
            onPress: () => navigation.push(NAVIGATION.bloodPressure),
            conditionName: 'blood_pressure',
        },
        {
            title: 'Oxygen',
            logo: IMAGES.icons.vitals.heartrate,
            color: 'rgba(146, 163, 223, 0.22)',
            onPress: () => navigation.push(NAVIGATION.oxiMeter),
            conditionName: 'oxygen',
        },
        {
            title: 'Heart Rate',
            logo: IMAGES.icons.vitals.heartrate,
            color: 'rgba(146, 163, 223, 0.22)',
            onPress: () => navigation.push(NAVIGATION.heartRate),
            conditionName: 'heart_rate',
        },
        {
            title: 'Weight',
            logo: IMAGES.icons.vitals.weight,
            color: 'rgba(117, 222, 203, 0.15)',
            onPress: () => navigation.push(NAVIGATION.weight),
            conditionName: 'weight',
        },

        {
            title: 'Temperature',
            logo: IMAGES.icons.vitals.thermometer,
            color: 'rgba(146, 223, 154, 0.22)',
            onPress: () => navigation.push(NAVIGATION.addTemperature),
            conditionName: 'temperature',
        },
    ];

    const uniqueDeviceList = [...new Set(DEVICE_LIST?.map(item => item.conditionName))];
    let filteredManualList = [];
    uniqueDeviceList.map(device => {
        filteredManualList.push(list.find(item => item.conditionName == device));
    });

    const getBluetoothState = async () => {
        const isEnabled = await BluetoothStatus.state();
        __DEV__ && console.log(isEnabled, 'BLUETOOTH STATUS');
        if (!isEnabled) {
            showSuccess('Please enable bluetooth & internet before using a device.');
        }
        /* 
     if (Platform.OS === 'android') {
      if (!isEnabled) {
        showMessage({
          message: 'Auto enabling bluetooth',
          type: 'info',
        });
        setBluetooth(true);
      }
    } else {
      showMessage({
        message:
          'Please enable bluetooth & internet to before using iHealth devices.',
        type: 'info',
      });
    }
    */
    };

    const handleDevice = () => {
        setManualActive(false);
        setDeviceActive(true);
        //  getCurrentDateList();
    };

    const handleManual = () => {
        setManualActive(true);
        setDeviceActive(false);
    };

    const handlePress = item => {
        console.log(item, 'item......');
        switch (item.conditionName) {
            case 'blood_pressure':
                if (item.modelNumber.includes('UA-651'))
                    navigation.push(NAVIGATION.bloodPressureAd, {
                        deviceId: item?.id,
                    });
                else
                    navigation.push(NAVIGATION.btBloodPressure, {
                        deviceId: item?.id,
                    });

                break;
            case 'blood_glucose':
                if (item.modelNumber.includes('meter+38431018'))
                navigation.push(NAVIGATION.GlucometerAccua, {
                    deviceId: item?.id,
                });
            else
                navigation.push(NAVIGATION.btGlucose, {
                    deviceId: item?.id,
                });
                break;
            case 'oxygen':
                navigation.push(NAVIGATION.btOximeter, {
                    deviceId: item?.id,
                });
                break;
            case 'weight':
                navigation.push(NAVIGATION.btScale, {
                    deviceId: item?.id,
                });
                break;
            case 'temperature':
                if (item.modelNumber.includes('fora'))
                    navigation.push(NAVIGATION.thermometerFora, {
                        deviceId: item?.id,
                    });
                else
                    navigation.push(NAVIGATION.btThermometer, {
                        deviceId: item?.id,
                    });
                break;
        }
    };

    return (
        <View style={styles.container}>
            <AppHeader
                title={strings.vital.readings}
                onBackPress={() => navigation.pop()}
                onRightPress={() => navigation.push(NAVIGATION.notification)}
            />
            <Loader isLoading={isLoading} />
            <ParentContainer>
                <View style={styles.vitalContainer}>
                    <TouchableOpacity onPress={() => handleDevice()}>
                        <TextView
                            title={strings.vital.addAutomatic}
                            viewStyle={
                                deviceActive === true
                                    ? styles.titleContainerActive
                                    : styles.titleContainerInactive
                            }
                            textStyle={styles.titleText}
                            color={deviceActive ? colors.PRIMARY_BLUE : colors.TEXT3}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleManual()}>
                        <TextView
                            title={strings.vital.manual}
                            viewStyle={
                                manualActive === true
                                    ? styles.titleContainerActive
                                    : styles.titleContainerInactive
                            }
                            textStyle={styles.titleText}
                            color={manualActive ? colors.PRIMARY_BLUE : colors.TEXT3}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    {deviceActive ? (
                        <View>
                            <FlatList
                                data={filteredDeviceList}
                                extraData={filteredDeviceList}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, key) => key}
                                renderItem={({item}) => {
                                    return (
                                        <TouchableOpacity
                                            style={styles.listContainer}
                                            onPress={() => handlePress(item)}>
                                            <View style={styles.listImgContainer}>
                                                <Image
                                                    source={
                                                        item.conditionName == 'blood_pressure'
                                                            ? IMAGES.icons.vitals.bloodPressure
                                                            : item.conditionName == 'blood_glucose'
                                                            ? IMAGES.icons.vitals.glucose
                                                            : item.conditionName == 'oxygen'
                                                            ? IMAGES.icons.vitals.heartrate
                                                            : item.conditionName == 'heart_rate'
                                                            ? IMAGES.icons.vitals.heartrate
                                                            : item.conditionName == 'weight'
                                                            ? IMAGES.icons.vitals.weight
                                                            : item.conditionName == 'temperature'
                                                            ? IMAGES.icons.vitals.thermometer
                                                            : null
                                                    }
                                                />
                                            </View>
                                            <View style={styles.listTextContainer}>
                                                <TextView
                                                    title={item.deviceName}
                                                    textStyle={styles.listTxt}
                                                />
                                                <TextView
                                                    title={item.modelNumber}
                                                    textStyle={styles.subTxt}
                                                />
                                            </View>
                                            <Image source={IMAGES.bluetooth.checkedCircle} />
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </View>
                    ) : (
                        <FlatList
                            // data={list}
                            data={filteredManualList}
                            // data={[
                            //   ...new Set(filteredManualList.map(obj => obj.conditionName)),
                            // ]}
                            renderItem={({item, key}) => {
                                return (
                                    <>
                                        <View key={key}>
                                            <VitalList
                                                title={item.title}
                                                firstImage={item.logo}
                                                lastImage={IMAGES.icons.vitals.forwardArrow}
                                                onContainerPress={item.onPress}
                                                lastImagePress={item.onPress}
                                                containerColor={item.color}
                                                containerStyle={styles.menuContainer}
                                                titleContainerStyle={styles.titleContainer}
                                                titleTextStyle={styles.listTxt}
                                            />
                                        </View>
                                    </>
                                );
                            }}
                        />
                    )}
                </View>

                {/* 
        
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
          subText={'118/80'}
          unit={strings.bloodPressure.scale}
          lastImage={IMAGES.icons.vitals.sync}
          lastImageAlt={strings.others.sync}
          lastImagePress={() => toogleModal()}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop:screenHeight- moderateScale(400),
          }}>
          <BottomButton
            title={strings.vital.history}
            borderRadius={50}
            onPress={() =>
              navigation.navigate(NAVIGATION.vitalMonitoringHistory, {
                history: true,
              })
            }
          />
          <BottomButton
            title={strings.vital.manual}
            borderRadius={50}
            onPress={() =>
              navigation.navigate(NAVIGATION.vitalMonitoringHistory, {
                manual: true,
              })
            }
          />
        </View>
        {modalVisible ? (
          <GestureRecognizer
            style={{flex: 1}}
            onSwipeUp={() => setModalVisible(true)}
            onSwipeDown={() => setModalVisible(false)}>
            <Modal
              animationType="slide"
              presentationStyle="formSheet"
              visible={modalVisible}
              // backdropColor={'transparent'}
              onRequestClose={() => {
                setModalVisible(false);
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

                <Text style={styles.title}>{strings.bloodPressure.title}</Text>

                <View style={styles.circleView}>
                  <View style={styles.outerCircle}>
                    <View style={styles.midCircle}>
                      <View style={styles.innerCircle}>
                        <Text style={styles.readingCount}>118/80</Text>
                        <Text style={styles.scale}>
                          {strings.bloodPressure.scale}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.msg}>You are doing great!</Text>
                </View>
              </View>
            </Modal>
          </GestureRecognizer>
        ) : null}*/}
            </ParentContainer>
        </View>
    );
}
