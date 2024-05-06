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
import {styles} from '@/screens/TakeReadings/Manual/BloodPressure/BloodPressure.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {shadow} from '@/theme';
import moment from 'moment';
import {useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

export function BloodPressure({navigation}) {
  const dispatch = useDispatch('');
  const user = useSelector(state => state.user);
  const unit = user?.user?.organizationUnit?.blood_pressure?.diastolic;
  const [dailValue, setDialValue] = useState();
  const [systValue, setSystValue] = useState();
  const [readingsError, setReadingsError] = useState(null);
  const currentDate = moment(new Date()).format('MM/DD/YYYY');
  const isLoading = useSelector(state =>
    isLoadingSelector([TYPES.ADD_MANUAL_READINGS], state),
  );
  const manualReadings = useSelector(state => state.manualReadings);
  const programId =
    manualReadings.deviceList && manualReadings.deviceList.programId
      ? manualReadings.deviceList.programId
      : null;

  const setDial = text => {
    setDialValue(text);
    setReadingsError('');
  };

  const setSyst = text => {
    setSystValue(text);
    setReadingsError('');
  };

  const addReadings = () => {
    if (Validate.empty(dailValue) || Validate.empty(systValue)) {
      return Validate.errorDisplay(
        strings.validation.emptyAll,
        setReadingsError,
      );
    } else if (Validate.numeric(dailValue) || Validate.numeric(systValue)) {
      return Validate.errorDisplay(
        strings.validation.invalidWholeNumber,
        setReadingsError,
      );
    } else {
      setReadingsError(null);
    }
    let request = {
      conditionName: strings.bloodPressure.short,
      reading: {
        systolic: systValue,
        diastolic: dailValue,
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
      conditionName: strings.bloodPressure.short,
      programId: programId,
      valueQuantity: {
        value: {
          systolic: systValue,
          diastolic: dailValue,
        },
        unit: {
          systolic: unit,
          diastolic: unit,
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
        title={strings.bloodPressure.title}
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
            title={strings.bloodPressure.title}
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
              marginHorizontal: moderateScale(20),
            }}>
            <TextField1
              title={strings.bloodPressure.systolic}
              maxLength={3}
              autoFocus={true}
              //  placeholder={'101'}
              keyboardType={'decimal-pad'}
              value={systValue}
              onChangeText={text => {
                text = text.replace(/[^0-9]/g, '');
                setSyst(text);
              }}
            />
            <View style={{marginLeft: moderateScale(15)}}>
              <TextField1
                title={strings.bloodPressure.diastollic}
                maxLength={3}
                //  placeholder={'118'}
                keyboardType={'decimal-pad'}
                value={dailValue}
                scale={true}
                scaleName={unit}
                // scaleName={strings.bloodPressure.scale}
                onChangeText={text => {
                  text = text.replace(/[^0-9]/g, '');
                  setDial(text);
                }}
              />
            </View>
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
