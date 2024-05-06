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
import {styles} from '@/screens/TakeReadings/Manual/Weight/Weight.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {shadow} from '@/theme';
import moment from 'moment';
import {useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

export function Weight({navigation}) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const unit = user?.user?.organizationUnit?.weight?.weight;
  const [weightValue, setWeightValue] = useState();
  const currentDate = moment(new Date()).format('MM/DD/YYYY');
  const [readingsError, setReadingsError] = useState(null);
  const isLoading = useSelector(state =>
    isLoadingSelector([TYPES.ADD_MANUAL_READINGS], state),
  );
  const manualReadings = useSelector(state => state.manualReadings);
  const programId =
    manualReadings.deviceList && manualReadings.deviceList.programId
      ? manualReadings.deviceList.programId
      : null;

  const setWeight = text => {
    setWeightValue(text);
    setReadingsError('');
  };
  const addReadings = () => {
    if (Validate.empty(weightValue)) {
      return Validate.errorDisplay(strings.validation.empty, setReadingsError);
    } 
    else if (Validate.single_decimal(weightValue)) {
      return Validate.errorDisplay(
        strings.validation.invalidSingleDecimal,
        setReadingsError,
      );
    } 
    else {       
      if(weightValue.length > 3 && Validate.force_single_decimal(weightValue)) {
        return Validate.errorDisplay(strings.validation.outOfRange, setReadingsError);
      }   
      else 
        setReadingsError(null);
    }
    let request = {
      conditionName: strings.weight.short,
      reading: {
        weight: weightValue,
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
      conditionName: strings.weight.short,
      programId: programId,
      valueQuantity: {
        value: {
          weight: weightValue,
        },
        unit: {
          weight: unit,
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
        title={strings.weight.title}
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
            title={strings.weight.title}
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
              flex: 1,
              marginHorizontal: moderateScale(20),
            }}>
            <TextField1
              title={strings.weight.title}
              maxLength={5}
              // placeholder={'78.5'}
              keyboardType={'decimal-pad'}
              value={weightValue}
              onChangeText={text => setWeight(text)}
              scale={true}
              scaleName={unit}
              //  scaleName={strings.weight.scale}
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
