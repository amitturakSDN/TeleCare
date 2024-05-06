import {TYPES, addManualReadings} from '@/actions/ManualReadingsActions';
import {
  AppHeader,
  Button,
  ErrorView,
  Loader,
  TextField1,
  TextView,
} from '@/components';
import {NAVIGATION} from '@/constants';
import {AuthHelper, Validate} from '@/helpers';
import {deviceWidth, moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {styles} from '@/screens/TakeReadings/Manual/Temperature/AddTemperature.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {shadow} from '@/theme';
import moment from 'moment';
import {useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
export function AddTemperature({navigation}) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const unit = user?.user?.organizationUnit?.temperature?.temperature;
  const [tempValue, setTempValue] = useState(null);
  const currentDate = moment(new Date()).format('MM/DD/YYYY');
  const [sleepScale, setSleepScale] = useState(0);
  const [readingsError, setReadingsError] = useState(null);
  const isLoading = useSelector(state =>
    isLoadingSelector([TYPES.ADD_MANUAL_READINGS], state),
  );
  const manualReadings = useSelector(state => state.manualReadings);
  const programId =
    manualReadings.deviceList && manualReadings.deviceList.programId
      ? manualReadings.deviceList.programId
      : null;

  const setTemp = text => {
    setTempValue(text);
    setReadingsError('');
  };
  const setScale = text => {
    setSleepScale(text);
  };
  const addReadings = () => {
    if (Validate.empty(tempValue)) {
      return Validate.errorDisplay(strings.validation.empty, setReadingsError);
    } 
    else if (Validate.single_decimal(tempValue)) {
      return Validate.errorDisplay(
        strings.validation.invalidSingleDecimal,
        setReadingsError,
      );
    } 
    else {       
      if(tempValue.length > 3 && Validate.force_single_decimal(tempValue)) {
        return Validate.errorDisplay(strings.validation.outOfRange, setReadingsError);
      } 
      else
        setReadingsError(null);
    }
    let request = {
      conditionName: strings.temperature.short,
      reading: {
        temperature: tempValue,
      },
    };
    let encryptPayload = {
      ...Validate.encryptInput(request),
    };
    delete encryptPayload.isMobile;
    delete encryptPayload.reading.isMobile;
    let param = {
      patientId: AuthHelper.getPatientId(),
      effectiveDateTime: currentDate,
      conditionName: strings.temperature.short,
      programId: programId,
      valueQuantity: {
        value: {
          temperature: tempValue,
        },
        unit: {
          temperature: unit,
        },
      },
      device: {
        reference: 'Device/null',
      },
    };
    dispatch(addManualReadings(param));
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title={strings.temperature.title}
        onBackPress={() => navigation.pop()}
        onRightPress={() => navigation.push(NAVIGATION.notification)}
      />
      <Loader isLoading={isLoading} />
      <View style={{margin: moderateScale(20)}}>
        <View
          style={[
            shadow.primary,
            {
              borderWidth: 1,
              width: '100%',
              height: '62.5%',
              borderRadius: moderateScale(10),
              backgroundColor: '#FFFFFF',
              borderColor: 'rgba(0, 0, 0, 0.14)',
            },
          ]}>
          <TextView
            title={strings.temperature.title}
            textStyle={styles.titleStyle}
            color={'#000'}
            viewStyle={{
              marginVertical: moderateScale(15),
              paddingHorizontal: moderateScale(20),
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: moderateScale(20),
            }}>
            <TextField1
              title={strings.temperature.subTitle}
              maxLength={5}
              // placeholder={'38.7'}
              keyboardType={'decimal-pad'}
              value={tempValue}
              onChangeText={text => setTemp(text)}
              scale={true}
              scaleName={unit}
              autoFocus={true}
              // scaleName={strings.temperature.scale}
            />
          </View>
          <View
            style={{
              marginLeft: moderateScale(10),
              marginVertical: moderateScale(3),
            }}>
            <ErrorView message={readingsError} />
          </View>
          {/* 
           <View style={styles.sliderContainer}>
            <CustomSlider
              setScale={text => setScale(text)}
              getScale={sleepScale}
              minimumValue={4}
              maximumValue={40}
            />
          </View>
                    <View
            style={{
              alignItems: 'center',
              marginTop: moderateScale(30),
            }}>
            {tempValue == 37 ? (
              <Text
                style={{
                  color: '#005DA8',
                  fontSize: wp(4.1),
                }}>
                No Fever
              </Text>
            ) : tempValue > 37 && tempValue <= 37.9 ? (
              <Text
                style={{
                  color: '#005DA8',
                  fontSize: wp(4.1),
                }}>
                Low Fever
              </Text>
            ) : tempValue >= 38 && tempValue < 39 ? (
              <Text
                style={{
                  color: '#005DA8',
                  fontSize: wp(4.1),
                }}>
                Medium Fever
              </Text>
            ) : tempValue >= 39 ? (
              <Text
                style={{
                  color: '#005DA8',
                  fontSize: wp(4.1),
                }}>
                High Fever
              </Text>
            ) : (
              <Text
                style={{
                  color: '#005DA8',
                  fontSize: wp(4.1),
                }}>
                No Fever
              </Text>
            )}
          </View>
          */}
        </View>
        <Button
          title={strings.btn.title}
          style={{
            borderRadius: 100,

            width: deviceWidth - 40,
            marginTop: moderateScale(40),
          }}
          onPress={() => addReadings()}
        />
      </View>
    </View>
  );
}
