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
import {styles} from '@/screens/TakeReadings/Manual/Oxygen/Oxygen.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {shadow} from '@/theme';
import moment from 'moment';
import {useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

export function Oxygen({navigation}) {
  const dispatch = useDispatch();
  const [oxygen, setOxygen] = useState('');
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

  const addReadings = () => {
    if (Validate.empty(oxygen)) {
      return Validate.errorDisplay(strings.validation.empty, setReadingsError);
    } else if (Validate.numeric(oxygen)) {
      return Validate.errorDisplay(
        strings.validation.invalidWholeNumber,
        setReadingsError,
      );
    } else {
      setReadingsError(null);
    }
    let request = {
      conditionName: strings.oximeter.oxygen,
      reading: {
        //  heartRate: heartRate,
        oxygen: oxygen,
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
      conditionName: strings.oximeter.oxygen,
      programId: programId,
      valueQuantity: {
        value: {
          oxygen: oxygen,
        },
        unit: {
          oxygen: strings.oximeter.scale1,
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
        title={strings.oximeter.subTitle1}
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
            title={strings.oximeter.subTitle1}
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
              marginHorizontal: moderateScale(5),
            }}>
            {/*
               <TextField1
              title={strings.oximeter.subTitle}
              maxLength={4}
            //  placeholder={'65.5'}
              keyboardType={"decimal-pad"}
              value={heartRate}
              onChangeText={text => setOximeter(text)}
              scale={true}
              scaleName={strings.oximeter.scale}
            />
              */}

            <View style={{marginLeft: moderateScale(15)}}>
              <TextField1
                title={strings.oximeter.subTitle2}
                maxLength={3}
                autoFocus={true}
                // placeholder={'97.6'}
                keyboardType={'decimal-pad'}
                value={oxygen}
                onChangeText={text => {
                  text = text.replace(/[^0-9]/g, '');
                  setOxygen(text);
                }}
                scale={true}
                scaleName={strings.oximeter.scale1}
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
