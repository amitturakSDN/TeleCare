import {
    TYPES,
    cancelAppointment,
    listCompletedAppointment,
    listFeedbackQuestions,
    listRequestedAppointment,
    listUpcomingAppointment,
    rescheduleAppointment,
    saveSelectedAppt,
    updateAppointment,
} from '@/actions/AppointmentAction';
import {organizationDetails} from '@/actions/ProfileActions';
import {Fonts, IMAGES} from '@/assets';
import {AppHeader, ListView1} from '@/components';
import {NAVIGATION} from '@/constants';
import {AuthHelper, NavigationHelper, Validate} from '@/helpers';
import {usePermission} from '@/hooks/permission';
import {moderateScale} from '@/hooks/scale';
import {useSession} from '@/hooks/zoom';
import {strings} from '@/localization';
import {styles} from '@/screens/Session/Session.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {useRoute, useTheme} from '@react-navigation/native';
import {EventType, useZoom} from '@zoom/react-native-videosdk';
import jwt_decode from 'jwt-decode';
import moment from 'moment-timezone';
import React, {useEffect, useState} from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {openSettings} from 'react-native-permissions';
import {useDispatch, useSelector} from 'react-redux';

export function Session({navigation}) {
    const route = useRoute();
    const dispatch = useDispatch();
    const zoom = useZoom();
    const {appointment} = useSelector(state => state);
    const {user} = useSelector(state => state);
    const [orgId, setOrgId] = useState(user?.user?.orgId);
    const patientId = AuthHelper.getPatientId();
    const isLoading = useSelector(state =>
        isLoadingSelector([TYPES.LIST_UPCOMING_APPOINTMENT], state),
    );
    const {sessionName, sessionIdleTimeoutMins} = useSession();
    const {colors} = useTheme();
    const {blockedAny} = usePermission();
    const [refreshing, setRefreshing] = useState(false);
    const [tabsOptionsData, setOptionsTabData] = useState([
        {
            id: 1,
            title: 'Upcoming',
            status: 1,
            vedio: true,
        },
        {
            id: 2,
            title: 'Requested',
            status: 0,
            vedio: false,
        },
        {
            id: 3,
            title: 'Completed',
            status: 0,
            vedio: true,
        },
    ]);

    const [upcomingSelected, setUpcomingSelected] = useState(true);
    const [requestedSelected, setRequestedSelected] = useState(false);
    const [completedSelected, setCompletedSelected] = useState(false);
    const [isRPMVisble, setRPMVisible] = useState(true);

    const {profile} = useSelector(state => state);

    let roleType = 0;
    let displayName = profile.firstName + ' ' + profile.lastName;

    useEffect(() => {
        getAllList();
        const interval = setInterval(() => getAllList(), 5000);
        return () => {
            clearInterval(interval);
        };
        blockedAny && openSettings();
    }, [blockedAny]);

    /**Show Dynamic menu options */
    useEffect(() => {
        checkRPMEnable();
    }, [profile]);

    /**Condition to check if specific product type is enable or not */
    const checkRPMEnable = () => {
        let licensedProduct = profile.licensedProduct;
        if (licensedProduct?.RPM || licensedProduct?.virtualCare) setRPMVisible(true);
        else setRPMVisible(false);
    };
    useEffect(() => {
        console.log(route, 'route.params111.....11');
        if (route.params && route.params?.selectedTab == 'Requested') {
            selectOptions(tabsOptionsData[1], 1);
        }
    }, []);

    useEffect(() => {
        const inputProxyAccount = zoom.addListener(EventType.onProxySettingNotification, () => {
            Alert.alert('You are using a proxy, please open your browser to login.');
        });
        const sslCertVerifiedFailNotification = zoom.addListener(
            EventType.onSSLCertVerifiedFailNotification,
            () => {
                Alert.alert('SSL Certificate Verify Fail Notification.');
            },
        );

        return () => {
            inputProxyAccount.remove();
            sslCertVerifiedFailNotification.remove();
        };
    }, []);

    const getAllList = () => {
        // console.log("GETTING LISTS");
        getUpcomingList();
        getRequestedList();
        getCompletedList();
        setRefreshing(false);
    };

    const getUpcomingList = () => {
        let params = {
            status: 'booked',
        };
        dispatch(listUpcomingAppointment(params));
    };
    const getRequestedList = () => {
        let params = {
            status: 'proposed',
        };
        dispatch(listRequestedAppointment(params));
    };
    const getCompletedList = () => {
        let params = {
            status: 'completed',
        };
        dispatch(listCompletedAppointment(params));
    };

    const selectOptions = (item, index) => {
        if (item.id == 1) {
            setUpcomingSelected(true);
            setRequestedSelected(false);
            setCompletedSelected(false);
        }
        if (item.id == 2) {
            setRequestedSelected(true);
            setUpcomingSelected(false);
            setCompletedSelected(false);
        }
        if (item.id == 3) {
            setCompletedSelected(true);
            setRequestedSelected(false);
            setUpcomingSelected(false);
        }
        const a = tabsOptionsData;
        for (var i = 0; i < a.length; i++) {
            a[i].status = 0;
        }
        let targetItem = a[index];
        if (targetItem.status == 0) {
            targetItem.status = 1;
        } else {
            targetItem.status = 0;
        }
        a[index] = targetItem;
        setOptionsTabData(a => [...a]);
    };

    const handleCancel = item => {
        let params = {
            orgId: item.orgId,
            appointmentId: item.id,
        };
        dispatch(cancelAppointment(params));
    };

    /**On reschedule click */
    const handleReschedule = item => {
        dispatch(saveSelectedAppt(item));
        navigation.navigate(NAVIGATION.getCareForm, {
            isReschedule: true,
            id: item.id,
            appt_data: item,
        });
    };

    /**On appointment accept */
    const handleAccept = item => {
        let params = {
            id: item?.id,
            status: 'booked',
            patientId: patientId,
            practitionerId: item?.practitionerId,
        };
        dispatch(updateAppointment(params));
    };

    /**Handle appointment rejection */
    const handleReject = item => {
        let params = {
            id: item?.id,
            status: 'cancelled',
            patientId: patientId,
            practitionerId: item?.practitionerId,
        };
        dispatch(updateAppointment(params));
    };

    /**On Refersh click */
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getAllList();
    }, []);

    const sortedByDate = (data, direction = 'desc') => {
        return data?.sort((a, b) => {
            const a_date = moment.tz(a?.requestedPeriod[0]?.start, 'UTC');
            const b_date = moment.tz(b?.requestedPeriod[0]?.start, 'UTC');
            return direction == 'asc' ? b_date - a_date : a_date - b_date;
        });
    };

    return (
        <>
            <AppHeader
                title={strings.session.title}
                toggle={route.params?.isHome ? false : true}
                onBackPress={() =>
                    route.params?.isHome ? navigation.pop() : navigation.toggleDrawer()
                }
                onRightPress={() => navigation.push(NAVIGATION.notification)}
            />
            {!isRPMVisble && (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No product access given</Text>
                </View>
            )}
            {isRPMVisble && (
                <>
                    <View style={styles.sectionView}>
                        <View style={styles.tabView}>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                horizontal
                                data={tabsOptionsData}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={tabsOptionsData}
                                renderItem={({item, index}) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                selectOptions(item, index);
                                            }}
                                            style={styles.tabTextBtn}>
                                            <Text
                                                style={{
                                                    color:
                                                        item.status == 1
                                                            ? colors.secondary
                                                            : colors.text,
                                                    fontSize: moderateScale(20),
                                                    fontFamily: Fonts.medium,
                                                    fontWeight: item.status == 1 ? '600' : '400',
                                                }}>
                                                {item?.title}
                                            </Text>
                                            <View
                                                style={{
                                                    backgroundColor:
                                                        item.status == 1
                                                            ? colors.secondary
                                                            : colors.transparent,
                                                    height: item.status == 1 ? 3 : 0,
                                                    width: moderateScale(100),
                                                }}
                                            />
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </View>
                    </View>
                    <ScrollView
                        style={styles.listView}
                        refreshControl={
                            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
                        }>
                        {upcomingSelected ? (
                            <View style={{marginTop: moderateScale(15)}}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    vertical
                                    //  inverted
                                    data={sortedByDate(appointment?.listUpcoming)}
                                    extraData={sortedByDate(appointment?.listUpcoming)}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={() => {
                                                onRefresh();
                                            }}
                                        />
                                    }
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({item}) => {
                                        // console.log(item, 'sessionToken...');

                                        const name = Validate.decryptInput(
                                            item?.practitionerData?.name[0]?.text,
                                        );
                                        const date = moment(item?.requestedPeriod[0]?.start).format(
                                            'ddd, MMM DD',
                                        );
                                        const startTime = moment(
                                            item?.requestedPeriod[0]?.start,
                                        ).format('HH:mm');
                                        const endTime = moment(
                                            item?.requestedPeriod[0]?.end,
                                        ).format('HH:mm');
                                        const sessionToken = item?.sessionToken;
                                        const decoded = item.sessionToken
                                            ? jwt_decode(sessionToken)
                                            : '';
                                        const topic = item.sessionToken ? decoded.tpc : '';
                                        const ssnPwd = item.sessionToken ? decoded.password : '';
                                        return (
                                            <ListView1
                                                name={name}
                                                userImage={
                                                    item?.practitionerData?.photo != null &&
                                                    item?.practitionerData?.photo != undefined
                                                        ? {uri: item?.practitionerData?.photo.url}
                                                        : IMAGES.icons.session.defaultUserImage
                                                }
                                                // speciality={'Pediatric Specialist'}
                                                timeText={startTime + '-' + endTime}
                                                dateText={date}
                                                onClickCancel={() => handleCancel(item)}
                                                onClickReschedule={() => handleReschedule(item)}
                                                onClickJoin={() => {
                                                    if (
                                                        item &&
                                                        item.isHostJoined &&
                                                        item.isHostJoined == true
                                                    ) {
                                                        // dispatch(listFeedbackQuestions('survey'));
                                                        dispatch(
                                                            organizationDetails(orgId, res => {
                                                                if (
                                                                    res?.data?.assignedQuestionnaire
                                                                ) {
                                                                    if (
                                                                        'survey-appointment' in
                                                                        res?.data
                                                                            ?.assignedQuestionnaire
                                                                    ) {
                                                                        dispatch(
                                                                            listFeedbackQuestions(
                                                                                res?.data
                                                                                    ?.assignedQuestionnaire[
                                                                                    'survey-appointment'
                                                                                ],
                                                                            ),
                                                                        );
                                                                    }
                                                                    // if('getcare-waitingroom' in res?.data?.assignedQuestionnaire){
                                                                    //   dispatch(getCareQuestionListWR(res?.data?.assignedQuestionnaire['getcare-waitingroom']));
                                                                    //   }else{
                                                                    //     dispatch(setQuestionnaireListWR({getCareQuestionnaire: []}),);
                                                                    //   }
                                                                }
                                                            }),
                                                        );
                                                        dispatch(saveSelectedAppt(item));

                                                        NavigationHelper.hideNavigation(navigation);
                                                        navigation.navigate(NAVIGATION.vedioCall, {
                                                            sessionToken: sessionToken,
                                                            displayName,
                                                            sessionPwd: ssnPwd,
                                                            roleType,
                                                            sessionIdleTimeoutMins,
                                                            sessionTopic: topic,
                                                            practitioner: Validate.decryptInput(
                                                                item?.practitionerData?.name[0]
                                                                    ?.text,
                                                            ),
                                                        });
                                                    } else
                                                        Alert.alert(
                                                            'Please wait for the host to start this meeting',
                                                        );
                                                }}
                                                isBtnSection={true}
                                                joinStyle={{
                                                    backgroundColor:
                                                        item &&
                                                        item.isHostJoined &&
                                                        item.isHostJoined == true
                                                            ? colors.secondary
                                                            : colors.border,
                                                }}
                                                isVideo={item?.vedio}
                                                //   onCallIconPress={() =>
                                                //     navigation.navigate(NAVIGATION.vedioCall, {
                                                //       sessionName,
                                                //       displayName,
                                                //      sessionPassword,
                                                //      roleType,
                                                //      sessionIdleTimeoutMins,
                                                //   })
                                                // }
                                            />
                                        );
                                    }}
                                />
                            </View>
                        ) : null}

                        {requestedSelected ? (
                            <View style={{marginTop: moderateScale(10)}}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    vertical
                                    inverted
                                    data={sortedByDate(appointment.listRequested)}
                                    keyExtractor={(item, index) => index.toString()}
                                    extraData={sortedByDate(appointment.listRequested)}
                                    renderItem={({item}) => {
                                        const name = Validate.decryptInput(
                                            item?.practitionerData?.name[0]?.text,
                                        );
                                        const date = moment(item?.requestedPeriod[0]?.start).format(
                                            'ddd, MMM DD',
                                        );
                                        const startTime =
                                            //  moment( item?.requestedPeriod[0]?.start)
                                            moment(item?.requestedPeriod[0]?.start).format('HH:mm');
                                        const endTime = moment(
                                            item?.requestedPeriod[0]?.end,
                                        ).format('HH:mm');
                                        return (
                                            <ListView1
                                                name={name}
                                                userImage={
                                                    item?.practitionerData?.photo != null &&
                                                    item?.practitionerData?.photo != undefined
                                                        ? {uri: item?.practitionerData?.photo.url}
                                                        : IMAGES.icons.session.defaultUserImage
                                                }
                                                timeText={startTime + '-' + endTime}
                                                dateText={date}
                                                onClickReject={() => handleReject(item)}
                                                onClickAccept={() => handleAccept(item)}
                                                isBtnSection1={item.isFromWeb ? true : false}
                                                isBtnSection={false}
                                                isVideo={item?.vedio}
                                            />
                                        );
                                    }}
                                />
                            </View>
                        ) : null}
                        {completedSelected ? (
                            <View style={{marginTop: moderateScale(10)}}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    vertical
                                    inverted
                                    data={sortedByDate(appointment.listCompleted)}
                                    keyExtractor={(item, index) => index.toString()}
                                    // extraData={sortedByDate(appointment.listCompleted)}
                                    renderItem={({item}) => {
                                        const name = Validate.decryptInput(
                                            item?.practitionerData?.name[0]?.text,
                                        );
                                        const date = moment(item?.requestedPeriod[0]?.start).format(
                                            'ddd, MMM DD',
                                        );
                                        const startTime = moment(
                                            item?.requestedPeriod[0]?.start,
                                        ).format('HH:mm');
                                        const endTime = moment(
                                            item?.requestedPeriod[0]?.end,
                                        ).format('HH:mm');
                                        return (
                                            <TouchableOpacity
                                                onPress={() =>
                                                    navigation.push(NAVIGATION.note, {
                                                        id: item.id,
                                                        name: name,
                                                        startTime: startTime,
                                                        endTime: endTime,
                                                        date: date,
                                                        status: 'Completed',
                                                        photo:
                                                            item?.practitionerData?.photo != null &&
                                                            item?.practitionerData?.photo !==
                                                                undefined
                                                                ? item?.practitionerData?.photo
                                                                : IMAGES.icons.session
                                                                      .defaultUserImage,
                                                    })
                                                }>
                                                <ListView1
                                                    name={name}
                                                    userImage={
                                                        item?.practitionerData?.photo != null &&
                                                        item?.practitionerData?.photo != undefined
                                                            ? {
                                                                  uri: item?.practitionerData?.photo
                                                                      .url,
                                                              }
                                                            : IMAGES.icons.session.defaultUserImage
                                                    }
                                                    timeText={startTime + '-' + endTime}
                                                    dateText={date}
                                                    isBtnSection={false}
                                                />
                                            </TouchableOpacity>
                                        );
                                    }}
                                />
                            </View>
                        ) : null}
                    </ScrollView>
                </>
            )}
        </>
    );
}
