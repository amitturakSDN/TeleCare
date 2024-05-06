import {AppHeader, Image, ParentContainer, TextView} from '@/components';
import {DEVICE_LIST, NAVIGATION} from '@/constants';
import {strings} from '@/localization';
import {styles} from '@/screens/TakeReadings/BluetoothConnectivity/BluetoothConnectivity.styles';
import PermissionManager from '@/utils/permissionManager';
import {useEffect} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {
  BluetoothStatus,
  useBluetoothStatus,
} from 'react-native-bluetooth-status';

export function BluetoothConnectivity({navigation}) {
  const [btStatus, isPending, setBluetooth] = useBluetoothStatus();
  useEffect(() => {
    PermissionManager();
    BluetoothStatus.addListener(isEnabled => {
      console.log(isEnabled, 'BLUETOOTH STATUS');
    });
    getBluetoothState();
  }, [btStatus]);

  const getBluetoothState = async () => {
    const isEnabled = await BluetoothStatus.state();
    console.log(isEnabled, 'BLUETOOTH STATUS');
    if (!isEnabled) {
      showSuccess(
        'Please enable bluetooth & internet before using a device.',
      );
    }
    if (isEnabled) {
      showSuccess('Bluetooth is on.');
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

  const handlePress = item => {
    switch (item.id) {
      case 1:
        navigation.push(NAVIGATION.btBloodPressure);
        break;
      case 2:
        navigation.push(NAVIGATION.btOximeter);
        break;
      case 3:
        navigation.push(NAVIGATION.btScale);
        break;
      case 4:
        navigation.push(NAVIGATION.btGlucose);
        break;
      case 5:
        navigation.push(NAVIGATION.btThermometer);
        break;
      default:
        break;
    }
  };

  return (
    <View style={{flex: 1}}>
      <AppHeader
        title={strings.home.bleConnect}
        onBackPress={() => navigation.pop()}
        onRightPress={() => navigation.navigate(NAVIGATION.notification)}
      />
      <ParentContainer>
        <View style={styles.typeContainer}>
          <TextView
            title={strings.bleConnect.type}
            textStyle={styles.typeTxt}
          />
        </View>
        <FlatList
          data={DEVICE_LIST}
          extraData={DEVICE_LIST}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, key) => key}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                //style={styles.listContainer}
                onPress={() => handlePress(item)}>
                <View style={styles.listImgContainer}>
                  <Image source={item.leftIcon} />
                </View>
                <View style={styles.listTextContainer}>
                  <TextView title={item.name} textStyle={styles.listTxt} />
                  <TextView title={item.model} textStyle={styles.subTxt} />
                </View>
                <Image source={item.rightIcon} />
              </TouchableOpacity>
            );
          }}
        />
        {/*
        <View style={[shadow.primary, styles.listContainer]}>
          <View style={styles.listSubContainer}>
            <View style={styles.listImgContainer}>
              <Image source={IMAGES.bluetooth.glucometer} />
            </View>
            <TextView
              title={'Glucometer'}
              textStyle={styles.listTxt}
              viewStyle={{width: '60%'}}
            />
            <Image source={IMAGES.bluetooth.checkedCircle} />
          </View>
        </View>

        <View
          style={[
            shadow.primary,
            styles.listContainer,
            {marginVertical: moderateScale(10)},
          ]}>
          <View style={styles.listSubContainer}>
            <View style={styles.listImgContainer}>
              <Image source={IMAGES.bluetooth.bloodPressure} />
            </View>
            <TextView
              title={'Blood Pressure'}
              textStyle={styles.listTxt}
              viewStyle={{width: '60%'}}
            />
            <Image source={IMAGES.bluetooth.checkedCircle} />
          </View>
        </View>

        <View
          style={[
            shadow.primary,
            styles.listContainer,
            {marginVertical: moderateScale(10)},
          ]}>
          <View style={styles.listSubContainer}>
            <View style={styles.listImgContainer}>
              <Image source={IMAGES.bluetooth.weight} />
            </View>
            <TextView
              title={'Weight Scale'}
              textStyle={styles.listTxt}
              viewStyle={{width: '60%'}}
            />
            <Image source={IMAGES.bluetooth.checkedCircle} />
          </View>
        </View>

        <View
          style={[
            shadow.primary,
            styles.listContainer,
            {marginVertical: moderateScale(10)},
          ]}>
          <View style={styles.listSubContainer}>
            <View style={styles.listImgContainer}>
              <Image source={IMAGES.bluetooth.oximeter} />
            </View>
            <TextView
              title={'Oximeter'}
              textStyle={styles.listTxt}
              viewStyle={{width: '60%'}}
            />
            <Image source={IMAGES.bluetooth.checkedCircle} />
          </View>
        </View>

        <View
          style={[
            shadow.primary,
            styles.listContainer,
            {marginVertical: moderateScale(10)},
          ]}>
          <View style={styles.listSubContainer}>
            <View style={styles.listImgContainer}>
              <Image source={IMAGES.bluetooth.thermometer} />
            </View>
            <TextView
              title={'Thermometer'}
              textStyle={styles.listTxt}
              viewStyle={{width: '60%'}}
            />
            <Image source={IMAGES.bluetooth.checkedCircle} />
          </View>
        </View>
        
               
        <Text>dia</Text>
        <Text>{diastolic}</Text>
        <Text>Sys</Text>
        <Text>{systolic}</Text>
        <Text>SpO2%</Text>
        <Text>{spo2}</Text>
        <Text>PRbpm</Text>
        <Text>{prbpm}</Text>
        <Text>Weight Scale lbd</Text>
        <Text> {idx(weight && weight[0], _ => _.weight) || '0.00'}</Text>
        <TouchableOpacity
          onPress={() => {
            if (deviceStatus) {
              disconnectDevice();
              alert('Disconnecting device');
            } else {
              iHealthAPI.findDevice('PO3');
            }
          }}
          style={styles.addBtn}>
          <Image source={IMAGES.bluetooth.add} />
        </TouchableOpacity>
        */}
      </ParentContainer>
    </View>
  );
}
