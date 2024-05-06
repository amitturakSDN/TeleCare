import {TYPES, addManualReadings} from '@/actions/ManualReadingsActions';
import {
  AppHeader,
  BottomButton,
  ErrorView,
  Loader,
  TextField1,
  TextView,
} from '@/components';
import {NAVIGATION} from '@/constants';
import {AuthHelper, Validate} from '@/helpers';
import {deviceWidth, moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {styles} from '@/screens/TakeReadings/Manual/HeartRate/HeartRate.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {shadow} from '@/theme';
import moment from 'moment';
import {useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

export function HeartRate({navigation}) {
  const dispatch = useDispatch();
  const manualReadings = useSelector(state => state.manualReadings);
  const programId =
    manualReadings.deviceList && manualReadings.deviceList.programId
      ? manualReadings.deviceList.programId
      : null;

  const [heartValue, setHeartValue] = useState('');
  const currentDate = moment(new Date()).format('MM/DD/YYYY');
  const [readingsError, setReadingsError] = useState(null);

  const isLoading = useSelector(state =>
    isLoadingSelector([TYPES.ADD_MANUAL_READINGS], state),
  );

  const setGlucose = text => {
    setHeartValue(text);
    setReadingsError('');
  };
  const addReadings = () => {
    if (Validate.empty(heartValue)) {
      return Validate.errorDisplay(strings.validation.empty, setReadingsError);
    } else if (Validate.numeric(heartValue)) {
      return Validate.errorDisplay(
        strings.validation.invalidWholeNumber,
        setReadingsError,
      );
    } else {
      setReadingsError(null);
    }
    let request = {
      conditionName: strings.oximeter.short,
      reading: {
        heartRate: heartValue,
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
      programId: programId,
      conditionName: strings.oximeter.short,
      valueQuantity: {
        value: {
          heartRate: heartValue,
        },
        unit: {
          heartRate: strings.oximeter.scale,
        },
      },
      device: {
        reference: 'Device/null',
      },
    };
    dispatch(addManualReadings(param));
  };
  return (
    <View style={{flex: 1}}>
      <AppHeader
        title={strings.oximeter.subTitle}
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
              height: moderateScale(182),
              borderRadius: moderateScale(10),
              backgroundColor: '#FFFFFF',
              borderColor: 'rgba(0, 0, 0, 0.14)',
            },
          ]}>
          <TextView
            title={strings.oximeter.subTitle}
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
              flex: 1,
              marginHorizontal: moderateScale(20),
            }}>
            <TextField1
              title={strings.oximeter.subTitle}
              maxLength={3}
              //  placeholder={'98.3'}
              autoFocus={true}
              keyboardType={'decimal-pad'}
              value={heartValue}
              onChangeText={text => {
                text = text.replace(/[^0-9]/g, '');
                setGlucose(text);
              }}
              scale={true}
              scaleName={strings.oximeter.scale}
            />
          </View>
          <View
            style={{
              marginLeft: moderateScale(10),
              marginVertical: moderateScale(3),
            }}>
            <ErrorView message={readingsError} />
          </View>
        </View>
      </View>
      <View
        style={{
          marginTop: moderateScale(95),
          marginHorizontal: moderateScale(20),
        }}>
        <BottomButton
          title={strings.btn.title}
          style={{
            borderRadius: 100,
            backgroundColor: 'red',
            width: deviceWidth - 40,
          }}
          onPress={() => addReadings()}
        />
      </View>
    </View>
  );
}
