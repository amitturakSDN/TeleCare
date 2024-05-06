import {TYPES, listManualReadings} from '@/actions/ManualReadingsActions';
import {Fonts, IMAGES} from '@/assets';
import {AppHeader, Loader, ParentContainer, TextView, VitalList, CalendarBar} from '@/components';

import {organizationDetails} from '@/actions/ProfileActions';
import {NAVIGATION} from '@/constants';
import {AuthHelper, Validate} from '@/helpers';
import {moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {colors} from '@/theme';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {FlatList, Platform, TouchableOpacity, View} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import {useDispatch, useSelector} from 'react-redux';
import {styles} from './VitalMonitoringHistory.styles';

export function VitalMonitoringHistory({navigation, route}) {
    const dispatch = useDispatch();
    const {manualReadings, user} = useSelector(state => state);
    const {history, manual} = route.params;
    const orgUnits = user?.user?.organizationUnit;
    const bloodGlucose = orgUnits?.blood_glucose?.glucose;
    const bloodPressureSis = orgUnits?.blood_pressure?.systolic;
    const weight = orgUnits?.weight?.weight;
    const temperature = orgUnits?.temperature?.temperature;
    const oxygen = orgUnits?.oxygen?.oxygen;
    const heartRate = orgUnits?.heart_rate?.heartRate;
    const isLoading = useSelector(state => isLoadingSelector([TYPES.LIST_READINGS], state));
    const [selectedDate, setSelectedDate] = useState(moment(new Date()).format('MM/DD/YYYY'));
    const [historyActive, setHistoryActive] = useState(history ? history : false);
    const list = [
        {
            title: 'Blood Pressure',
            logo: IMAGES.icons.vitals.bloodPressure,
            color: 'rgba(0, 93, 168, 0.12)',
            onPress: () => navigation.push(NAVIGATION.bloodPressure),
        },
        {
            title: 'Blood Glucose',
            logo: IMAGES.icons.vitals.glucose,
            color: 'rgba(221, 76, 56, 0.11)',
            onPress: () => navigation.push(NAVIGATION.bloodGlucose),
        },
        {
            title: 'Weight',
            logo: IMAGES.icons.vitals.weight,
            color: 'rgba(117, 222, 203, 0.15)',
            onPress: () => navigation.push(NAVIGATION.weight),
        },
        {
            title: 'Heart Rate',
            logo: IMAGES.icons.vitals.heartrate,
            color: 'rgba(146, 163, 223, 0.22)',
            onPress: () => navigation.push(NAVIGATION.oxiMeter),
        },
        {
            title: 'Temperature',
            logo: IMAGES.icons.vitals.thermometer,
            color: 'rgba(146, 223, 154, 0.22)',
            onPress: () => navigation.push(NAVIGATION.addTemperature),
        },
    ];

    useEffect(() => {
        getReadingByDate();
        dispatch(organizationDetails(user?.user?.orgId));
    }, []);

    let request = {
        conditionName: [
            'temperature',
            'weight',
            'blood_pressure',
            'oxygen',
            'heart_rate',
            'blood_glucose',
        ],
    };
    let encryptPayload = {
        ...Validate.encryptInput(request),
    };
    delete encryptPayload.isMobile;
    // delete encryptPayload.reading.isMobile;

    //return;
    const getReadingByDate = (date = selectedDate) => {
        let query_string = `?patientId=${AuthHelper.getPatientId()}&date=${date}&isMobile=true&conditionName=${JSON.stringify(
            encryptPayload.conditionName,
        )}`;

        dispatch(listManualReadings(query_string));
    };

    /**fetch data for specific date click  */
    const handlePress = date => {
        getReadingByDate(date.format('MM/DD/YYYY'));
    };

    const handleHistory = () => {
        setHistoryActive(true);
        getReadingByDate();
    };

    const handleManual = () => {
        setHistoryActive(false);
    };
    return (
        <View style={{flex: 1}}>
            <AppHeader
                title={strings.vital.title}
                onBackPress={() => navigation.pop()}
                onRightPress={() => navigation.push(NAVIGATION.notification)}
            />

            <Loader isLoading={isLoading} />
            <ParentContainer>
                <View style={styles.vitalContainer}>
                    <TouchableOpacity onPress={() => handleHistory()}>
                        <TextView
                            title={strings.vital.history}
                            viewStyle={
                                historyActive === true
                                    ? styles.titleContainerActive
                                    : styles.titleContainerInactive
                            }
                            textStyle={styles.titleText}
                            color={historyActive ? colors.PRIMARY_BLUE : colors.TEXT3}
                        />
                    </TouchableOpacity>
                    {/*
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
          */}
                </View>
                <View>
                    {historyActive ? (
                        <View>
                            <CalendarBar
                                maxDate={moment(new Date())}
                                onDateSelected={date => handlePress(date)}
                            />
                            {/* <CalendarStrip
                                scrollable
                                calendarAnimation={{type: 'sequence', duration: 30}}
                                daySelectionAnimation={{
                                    type: 'background',
                                    duration: 300,
                                    highlightColor: colors.PURPLE,
                                }}
                                style={{height: moderateScale(100)}}
                                calendarHeaderStyle={styles.calendarCustomHeaderStyle}
                                iconContainer={{flex: 0.08}}
                                calendarColor={'#fff'}
                                dayContainerStyle={{
                                    height: moderateScale(40),
                                    justifyContent: 'center',
                                    //  backgroundColor: 'red',
                                }}
                                dateNumberStyle={{
                                    color: 'black',
                                    fontSize: moderateScale(13),
                                    fontFamily: Fonts.semibold,
                                }}
                                dateNameStyle={{
                                    color: 'black',
                                    fontSize: moderateScale(11),
                                    fontFamily: Fonts.semibold,
                                }}
                                // iconContainer={{flex: 0.1,}}
                                highlightDateNameStyle={{
                                    color: 'white',
                                    fontSize: moderateScale(12),
                                }}
                                highlightDateNumberStyle={{
                                    color: 'white',
                                    fontSize: moderateScale(14),
                                }}
                                maxDate={moment(new Date())}
                                selectedDate={selectedDate}
                                onDateSelected={date => {
                                    handlePress(date);
                                }}
                                highlightDateContainerStyle={{
                                    backgroundColor: colors.PRIMARY_BLUE,
                                    borderRadius: moderateScale(8),
                                    height: moderateScale(40),
                                    justifyContent: 'center',
                                }}
                            /> */}
                            {manualReadings?.list?.length > 0 ? (
                                <FlatList
                                    data={manualReadings?.list}
                                    extraData={manualReadings?.list}
                                    showsVerticalScrollIndicator={true}
                                    renderItem={({item, key}) => {
                                        let conditionName = item?.code?.text;
                                        let reading =
                                            conditionName == 'blood_pressure'
                                                ? bloodPressureSis == 'mmHg'
                                                    ? parseFloat(
                                                          item?.valueQuantity?.value?.systolic,
                                                      ) +
                                                      '/' +
                                                      parseFloat(
                                                          item?.valueQuantity?.value?.diastolic,
                                                      ) +
                                                      ' '
                                                    : bloodPressureSis == 'kPa'
                                                    ? (
                                                          parseFloat(
                                                              item?.valueQuantity?.value?.systolic,
                                                          ) / 7.501
                                                      )
                                                          .toFixed(1)
                                                          .toString() +
                                                      '/' +
                                                      (
                                                          parseFloat(
                                                              item?.valueQuantity?.value?.diastolic,
                                                          ) / (7.501).toFixed(1).toString()
                                                      ).toFixed(1) +
                                                      ' '
                                                    : bloodPressureSis == 'psi'
                                                    ? (
                                                          parseFloat(
                                                              item?.valueQuantity?.value?.systolic,
                                                          ) / 51.715
                                                      )
                                                          .toFixed(1)
                                                          .toString() +
                                                      '/' +
                                                      (
                                                          parseFloat(
                                                              item?.valueQuantity?.value?.diastolic,
                                                          ) / 51.715
                                                      )
                                                          .toFixed(1)
                                                          .toString() +
                                                      ' '
                                                    : bloodPressureSis
                                                : conditionName == 'blood_glucose'
                                                ? bloodGlucose == 'mg/dL'
                                                    ? item?.valueQuantity?.value?.glucose + ' '
                                                    : (
                                                          parseFloat(
                                                              item?.valueQuantity?.value?.glucose,
                                                          ) / 18
                                                      )
                                                          .toFixed(1)
                                                          .toString() + ' '
                                                : conditionName == 'oxygen'
                                                ? item?.valueQuantity?.value?.oxygen + ' '
                                                : conditionName == 'heart_rate'
                                                ? item?.valueQuantity?.value?.heartRate + ' '
                                                : conditionName == 'temperature'
                                                ? temperature == '°F' &&
                                                  item?.valueQuantity?.unit?.temperature == '°C'
                                                    ? item?.is_processed
                                                        ? // Celsius to Fahrenheit
                                                          (
                                                              (parseFloat(
                                                                  item?.valueQuantity?.value
                                                                      ?.temperature,
                                                              ) *
                                                                  9) /
                                                                  5 +
                                                              32
                                                          )
                                                              .toFixed(1)
                                                              .toString() + ' '
                                                        : parseFloat(
                                                              item?.valueQuantity?.value
                                                                  ?.temperature,
                                                          ).toFixed(1)
                                                    : temperature == '°C' &&
                                                      item?.valueQuantity?.unit?.temperature == '°F'
                                                    ? item?.is_processed
                                                        ? // Fahrenheit to Celsius
                                                          (
                                                              ((parseFloat(
                                                                  item?.valueQuantity?.value
                                                                      ?.temperature,
                                                              ) -
                                                                  32) *
                                                                  5) /
                                                              9
                                                          )
                                                              .toFixed(1)
                                                              .toString() + ' '
                                                        : parseFloat(
                                                              item?.valueQuantity?.value
                                                                  ?.temperature,
                                                          ).toFixed(1)
                                                    : parseFloat(
                                                          item?.valueQuantity?.value?.temperature,
                                                      ).toFixed(1)
                                                : conditionName == 'weight' &&
                                                  weight == 'kg' &&
                                                  item?.valueQuantity?.unit?.weight == 'lbs'
                                                ? item?.is_processed
                                                    ? // Convert kg to lbs
                                                      (
                                                          parseFloat(
                                                              item?.valueQuantity?.value?.weight,
                                                          ) / 2.205
                                                      )
                                                          .toFixed(1)
                                                          .toString() + ' '
                                                    : parseFloat(
                                                          item?.valueQuantity?.value?.weight,
                                                      ).toFixed(1)
                                                : conditionName == 'weight' &&
                                                  weight == 'lbs' &&
                                                  item?.valueQuantity?.unit?.weight == 'kg'
                                                ? // Convert lbs to kg
                                                  (
                                                      parseFloat(
                                                          item?.valueQuantity?.value?.weight,
                                                      ) * 2.205
                                                  )
                                                      .toFixed(1)
                                                      .toString() + ' '
                                                : parseFloat(
                                                      item?.valueQuantity?.value?.weight,
                                                  ).toFixed(1) + ' ';

                                        return (
                                            <VitalList
                                                title={item?.code?.coding[0]?.display}
                                                containerStyle={styles.listContainer}
                                                firstImage={
                                                    conditionName == 'blood_pressure'
                                                        ? IMAGES.icons.vitals.bloodPressure
                                                        : conditionName == 'blood_glucose'
                                                        ? IMAGES.icons.vitals.glucose
                                                        : conditionName == 'oxygen'
                                                        ? IMAGES.icons.vitals.heartrate
                                                        : conditionName == 'heart_rate'
                                                        ? IMAGES.icons.vitals.heartrate
                                                        : conditionName == 'weight'
                                                        ? IMAGES.icons.vitals.weight
                                                        : conditionName == 'temperature'
                                                        ? IMAGES.icons.vitals.thermometer
                                                        : null
                                                }
                                                subText={reading}
                                                color={
                                                    item?.interpretation[0]?.coding[0]?.display == 'Normal'
                                                        ? colors.TEXT_GREEN
                                                        : item?.interpretation[0]?.coding[0]?.display == 'High'
                                                        ? colors.RED_ALERT
                                                        : item?.interpretation[0]?.coding[0]?.display == 'Intermediate'
                                                        ? colors.YELLOW_ALERT
                                                        : colors.BLACK
                                                }
                                                unit={
                                                    conditionName == 'blood_pressure'
                                                        ? bloodPressureSis
                                                        : conditionName == 'blood_glucose'
                                                        ? bloodGlucose
                                                        : conditionName == 'oxygen'
                                                        ? oxygen
                                                        : conditionName == 'heart_rate'
                                                        ? heartRate
                                                        : conditionName == 'temperature'
                                                        ? temperature
                                                        : conditionName == 'weight'
                                                        ? weight
                                                        : null
                                                }
                                                lastImage={IMAGES.icons.vitals.forwardArrow}
                                                lastImagePress={() => {
                                                    navigation.push(NAVIGATION.previousReadings, {
                                                        item: item,
                                                    });
                                                }}
                                                onContainerPress={() => {
                                                    navigation.push(NAVIGATION.previousReadings, {
                                                        item: item,
                                                    });
                                                }}
                                            />
                                        );
                                    }}
                                    ListFooterComponent={
                                        <View
                                            style={{
                                                marginVertical:
                                                    Platform.OS === 'android'
                                                        ? moderateScale(10)
                                                        : moderateScale(5),
                                            }}
                                        />
                                    }
                                />
                            ) : (
                                <TextView
                                    title={'No Data Found'}
                                    textStyle={styles.noResultStyle}
                                    viewStyle={{alignSelf: 'center'}}
                                />
                            )}
                        </View>
                    ) : (
                        <FlatList
                            data={list}
                            renderItem={({item, key}) => {
                                return (
                                    <>
                                        <View key={key}>
                                            <VitalList
                                                title={item.title}
                                                firstImage={item.logo}
                                                lastImage={IMAGES.icons.vitals.forwardArrow}
                                                onContainerPress={item.onPress}
                                                containerColor={item.color}
                                                containerStyle={styles.menuContainer}
                                                titleContainerStyle={styles.titleContainer}
                                                titleTextStyle={{
                                                    fontWeight: 'bold',
                                                    fontSize: moderateScale(20),
                                                }}
                                            />
                                        </View>
                                    </>
                                );
                            }}
                        />
                    )}
                </View>
            </ParentContainer>
        </View>
    );
}
