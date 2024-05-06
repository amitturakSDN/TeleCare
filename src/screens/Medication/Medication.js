import {TYPES, listMedicationByDate, updateMedication} from '@/actions/MedicationActions';
import {Fonts, IMAGES} from '@/assets';
import {AppHeader, Image, Loader, TextView, CalendarBar} from '@/components';
import {NAVIGATION} from '@/constants';
import {AuthHelper, Validate} from '@/helpers';
import {moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {styles} from '@/screens/Medication/Medication.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {colors} from '@/theme';
import moment from 'moment-timezone';
import {useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View, useColorScheme} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import {useDispatch, useSelector} from 'react-redux';

export function Medication({navigation}) {
    const dispatch = useDispatch();
    const {medication} = useSelector(state => state);
    const isDarkMode = useColorScheme() === 'dark';
    const isLoading = useSelector(state => isLoadingSelector([TYPES.LIST_MEDICATION], state));
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
    const currentDate = new Date();
    const [data, setData] = useState([]);
    useEffect(() => {
        getCurrentDateList();
    }, []);

    useEffect(() => {
        const listData = medication.list;
        setData(listData);
    }, [medication]);

    const getCurrentDateList = () => {
        dispatch(
            listMedicationByDate({
                date: selectedDate,
            }),
        );
    };

    const selectItem = (item, index) => {
        const a = data;
        for (var i = 0; i < a.length; i++) {
            a[i].checkStatus = 1;
        }
        let targetItem = a[index];
        if (targetItem.checkStatus == 1) {
            targetItem.checkStatus = 0;
        } else {
            targetItem.checkStatus = 0;
        }
        a[index] = targetItem;
        setData([...a]);
    };

    const handlePress = date => {
        setSelectedDate(moment(date).format('YYYY-MM-DD'));
        dispatch(
            listMedicationByDate({
                date: moment(date).format('YYYY-MM-DD'),
            }),
        );
    };

    const handleUpdate = (item, index) => {
        if (selectedDate > moment(currentDate).format('YYYY-MM-DD')) {
            alert('Future date can not be updated');
        } else {
            let payload = {
                request: {
                    isMobile: true,
                    date: moment(selectedDate).format('YYYY-MM-DD'),
                    time: index,
                    status: item.status == 'Taken' ? 'Take' : 'Taken',
                },
                data: {
                    patientId: AuthHelper.getPatientId(),
                    medicationId: item.id,
                },
            };
            dispatch(updateMedication(payload));
        }
    };
    return (
        <View style={{flex: 1}}>
            <AppHeader
                title={strings.home.medication}
                onBackPress={() => navigation.pop()}
                onRightPress={() => navigation.navigate(NAVIGATION.notification)}
            />
            <Loader isLoading={isLoading} />
            <View
                style={{
                    backgroundColor: isDarkMode ? colors.WHITE : colors.WHITE,
                    paddingHorizontal: moderateScale(20),
                }}>
                <CalendarBar onDateSelected={date => handlePress(date)} />
                {/* <CalendarStrip
                  scrollable
                  calendarAnimation={styles.calendarAnimation}
                  daySelectionAnimation={styles.daySelectionAnimation}
                  style={{
                      height: moderateScale(100),
                      backgroundColor: isDarkMode ? 'white' : 'white',
                  }}
                  calendarHeaderStyle={{
                      color: isDarkMode ? colors.BLACK : colors.BLACK,
                      fontSize: moderateScale(18),
                      alignSelf: 'flex-start',
                      fontFamily: Fonts.regular,
                      fontWeight: '500',
                  }}
                  calendarColor={styles.calendarColor}
                  dayContainerStyle={styles.dayContainerStyle}
                  dateNumberStyle={{
                      color: isDarkMode ? colors.BLACK : colors.BLACK,
                      fontSize: moderateScale(14),
                  }}
                  dateNameStyle={{
                      color: isDarkMode ? colors.BLACK : colors.BLACK,
                      fontSize: moderateScale(14),
                  }}
                  highlightDateNameStyle={styles.highlightDateNameStye}
                  highlightDateNumberStyle={styles.highlightDateNumberStyle}
                  selectedDate={selectedDate}
                  onDateSelected={date => handlePress(date)}
                  highlightDateContainerStyle={styles.highlightDateContainerStyle}
              /> */}

                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={data}
                    contentContainerStyle={{
                        paddingBottom: moderateScale(150),
                        //backgroundColor:"red"
                    }}
                    extraData={data}
                    renderItem={({item, index}) => {
                        let currentHour = moment(item.key, 'HH').hour();
                        let now = moment();
                        let inList = item.key;
                        return (
                            <>
                                {item.checkStatus == 0 ? (
                                    <>
                                        <View style={styles.listView}>
                                            <View style={styles.listInsideView}>
                                                <TextView
                                                    title={item.key}
                                                    color={isDarkMode ? colors.WHITE : colors.WHITE}
                                                    viewStyle={{
                                                        marginHorizontal: moderateScale(10),
                                                    }}
                                                />
                                                <Image
                                                    source={IMAGES.icons.vitals.surya}
                                                    containerStyle={{
                                                        marginHorizontal: moderateScale(10),
                                                    }}
                                                />
                                            </View>
                                            <FlatList
                                                data={item.value}
                                                extraData={item.value}
                                                keyExtractor={(item, index) => index.toString()}
                                                renderItem={({item, index}) => {
                                                    let nameDecrypt = Validate.decryptInput(
                                                        item.name,
                                                    );
                                                    return (
                                                        <View style={styles.listShowView}>
                                                            <View
                                                                style={[
                                                                    styles.listInsideShowView,
                                                                    {
                                                                        borderColor:
                                                                            item &&
                                                                            item.status == 'Take'
                                                                                ? '#FF0000'
                                                                                : colors.BORDER_COLOR,
                                                                        backgroundColor:
                                                                            item &&
                                                                            item.status == 'Take'
                                                                                ? '#FFFAFA'
                                                                                : colors.WHITE,
                                                                    },
                                                                ]}>
                                                                <View
                                                                    style={{
                                                                        flex: 0.25,
                                                                        alignItems: 'center',
                                                                    }}>
                                                                    <View style={styles.showLeft}>
                                                                        <Image
                                                                            source={
                                                                                IMAGES.icons.vitals
                                                                                    .drugs
                                                                            }
                                                                        />
                                                                    </View>
                                                                </View>

                                                                <View style={styles.showCenter}>
                                                                    <TextView
                                                                        title={nameDecrypt}
                                                                        viewStyle={{
                                                                            marginBottom: 3,
                                                                        }}
                                                                        textStyle={styles.text1}
                                                                        color={
                                                                            isDarkMode
                                                                                ? colors.BLACK
                                                                                : colors.BLACK
                                                                        }
                                                                    />
                                                                    <TextView
                                                                        title={item.dose}
                                                                        textStyle={styles.text2}
                                                                        color={
                                                                            isDarkMode
                                                                                ? colors.BLACK
                                                                                : colors.BLACK
                                                                        }
                                                                        viewStyle={{marginTop: 3}}
                                                                    />
                                                                </View>

                                                                <View style={styles.showRight}>
                                                                    <TouchableOpacity
                                                                        style={[
                                                                            styles.takenStatusContainer,
                                                                            {
                                                                                backgroundColor:
                                                                                    item &&
                                                                                    item.status ==
                                                                                        'Taken'
                                                                                        ? 'green'
                                                                                        : 'rgba(142, 142, 142, 0.15)',
                                                                            },
                                                                        ]}
                                                                        disabled={
                                                                            now.diff(
                                                                                moment(
                                                                                    selectedDate,
                                                                                ).add(
                                                                                    currentHour,
                                                                                    'hours',
                                                                                ),
                                                                                'hours',
                                                                            ) > 48
                                                                                ? true
                                                                                : false
                                                                        }
                                                                        onPress={() =>
                                                                            handleUpdate(
                                                                                item,
                                                                                inList,
                                                                            )
                                                                        }>
                                                                        <View
                                                                            style={{
                                                                                flexDirection:
                                                                                    'row',
                                                                                alignItems:
                                                                                    'center',
                                                                            }}>
                                                                            {item &&
                                                                            item.status ==
                                                                                'Taken' ? (
                                                                                <Image
                                                                                    source={
                                                                                        IMAGES.icons
                                                                                            .checked
                                                                                    }
                                                                                    style={{
                                                                                        marginRight: 5,
                                                                                    }}
                                                                                />
                                                                            ) : null}

                                                                            <TextView
                                                                                title={
                                                                                    item.status ==
                                                                                    'Taken'
                                                                                        ? strings
                                                                                              .medication
                                                                                              .taken
                                                                                        : strings
                                                                                              .medication
                                                                                              .nottaken
                                                                                }
                                                                                textStyle={
                                                                                    styles.text3
                                                                                }
                                                                                color={
                                                                                    item &&
                                                                                    item.status ==
                                                                                        'Taken'
                                                                                        ? colors.WHITE
                                                                                        : '#555555'
                                                                                }
                                                                            />
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    );
                                                }}
                                            />
                                        </View>
                                    </>
                                ) : (
                                    <TouchableOpacity
                                        style={[
                                            styles.btnStyle,
                                            {
                                                backgroundColor:
                                                    item.value[0].status == 'Taken'
                                                        ? 'green'
                                                        : colors.TERTIORY_GREY,
                                            },
                                        ]}
                                        onPress={() => selectItem(item, index)}>
                                        <TextView
                                            title={item.key}
                                            viewStyle={{marginHorizontal: moderateScale(15)}}
                                            color={
                                                isDarkMode || item.value[0].status == 'Taken'
                                                    ? colors.WHITE
                                                    : colors.BLACK
                                            }
                                        />
                                        <Image
                                            source={
                                                currentHour >= 5 && currentHour < 12
                                                    ? IMAGES.medication.morning
                                                    : currentHour >= 12 && currentHour < 17
                                                    ? IMAGES.medication.afternoon
                                                    : currentHour >= 17 && currentHour < 20
                                                    ? IMAGES.medication.night
                                                    : currentHour >= 20
                                                    ? IMAGES.medication.night
                                                    : ''
                                            }
                                            containerStyle={{marginRight: moderateScale(20)}}
                                        />
                                    </TouchableOpacity>
                                )}
                            </>
                        );
                    }}
                    ListFooterComponent={<View style={{height: moderateScale(20)}}></View>}
                    keyExtractor={(item, key) => key}
                    ListEmptyComponent={<Text>No data found</Text>}
                />
            </View>
        </View>
    );
}
