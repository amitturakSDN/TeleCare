import {notificationListing} from '@/actions/NotificationActions';
import {
    getDiscoverOrganisation,
    profileDetail,
    profileRelatedPerson,
} from '@/actions/ProfileActions';
import {listPractitionar} from '@/actions/RequestGuidanceActions';
import {getDeviceToken} from '@/actions/UserActions';
import {IMAGES} from '@/assets';
import {AppHeader, Image, TextView} from '@/components';
import {NAVIGATION} from '@/constants';
import {AuthHelper, Validate} from '@/helpers';
import {moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {Dependent} from '@/screens';
import {styles} from '@/screens/Home/Home.styles';
import {getUser} from '@/selectors/UserSelectors';
import {BlurView} from '@react-native-community/blur';
import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Modal, Text, View, useColorScheme, TouchableOpacity, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

export function Home({navigation}) {
    const {colors} = useTheme();

    const dispatch = useDispatch();
    const user = useSelector(getUser);
    const userId = AuthHelper.getUserId();
    const {profile} = useSelector(state => state);
    const {notification} = useSelector(state => state);

    const [showModal, setShowModal] = useState(false);
    const [home_menu, setMenu] = useState([]);

    const isDarkMode = useColorScheme() === 'dark';
    const name = AuthHelper.getUserName();
    const patientId = AuthHelper.getPatientId();
    const email = user?.user?.email;

    const deviceToken = notification?.fcmDeviceToken;

    /**Show Dynamic menu options */
    useEffect(() => {
        initializeMenu();
    }, [profile]);

    /**Hit initial API used to lod the page */
    useEffect(() => {
        dispatch(profileDetail(userId));
        setShowModal(profile?.selectedProfile ? false : true);
        dispatch(listPractitionar());
        dispatch(profileRelatedPerson(userId));
        let params = {
            email: email,
            deviceToken: deviceToken,
        };
        dispatch(getDeviceToken(params));
        dispatch(notificationListing(patientId));
        dispatch(getDiscoverOrganisation(user?.user.orgId));
    }, []);

    const menu = [
        {
            id: 1,
            title: strings.vital.takeReading,
            icon: IMAGES.icons.home.reading,
            onPress: () =>
                navigation.navigate(NAVIGATION.vitalMonitoring, {
                    device: true,
                }),
            visible: false,
        },
        {
            id: 2,
            title: strings.home.resultDashboard,
            icon: IMAGES.icons.home.dashboard,
            onPress: () =>
                navigation.navigate(NAVIGATION.vitalMonitoringHistory, {
                    history: true,
                }),
            visible: false,
        },
        /* 
     {
      title: strings.home.bleConnect,
      icon: IMAGES.icons.home.bluetooth,
      onPress: () => requestPermissions(),
    },
       {
      title: 'Secure Messaging',
      icon: IMAGES.icons.home.message,
      onPress: () => navigation.navigate(NAVIGATION.session),
    },
    {
      title: strings.home.appointments,
      icon: IMAGES.icons.home.appointment,
      onPress: () =>  navigation.push(NAVIGATION.session,{
        isHome: true
     }),
    },
    */
        {
            id: 3,
            title: strings.getCare.name,
            icon: IMAGES.icons.home.getCare,
            onPress: () => {
                navigation.push(NAVIGATION.bookingList);
                // if (dependentName === 'SELF') {
                //   navigation.push(NAVIGATION.getCare);
                // } else {
                //   navigation.push(NAVIGATION.bookingList);
                // }
            },
            visible: false,
        },
        // {
        //   title: strings.home.requestGuidance,
        //   icon: IMAGES.icons.home.guidance,
        //   onPress: () => navigation.navigate(NAVIGATION.requestGuidance),
        // },
        {
            id: 4,
            title: strings.home.appointments,
            icon: IMAGES.icons.home.appointment,
            onPress: () => navigation.navigate(NAVIGATION.session),
            visible: false,
        },
        {
            id: 5,
            title: strings.home.medication,
            icon: IMAGES.icons.home.medication,
            onPress: () => navigation.navigate(NAVIGATION.medication),
            visible: false,
        },

        {
            id: 6,
            title: strings.home.diseaseMgmt,
            icon: IMAGES.icons.home.disease,
            onPress: () => navigation.navigate(NAVIGATION.diseaseListing),
            visible: false,
        },

        /* 
     {
      title: strings.settings.programs,
      icon: IMAGES.icons.home.appointment,
      onPress: () => navigation.push(NAVIGATION.programsList),
    },
    */
        {
            id: 7,
            title: strings.dependent.name,
            icon: IMAGES.icons.home.dependant,
            // icon:  IMAGES.icons.home.message,
            onPress: () => navigation.push(NAVIGATION.dependentInternal),
            visible: false,
        },
        {
            id: 8,
            title: strings.requisitions.name,
            icon: IMAGES.icons.home.callBack,
            onPress: () => navigation.push(NAVIGATION.requisitions),
            visible: false,
        },
        {
            id: 9,
            title: strings.prescriptions.name,
            icon: IMAGES.icons.home.prescriptions,
            onPress: () => navigation.push(NAVIGATION.prescriptions),
            visible: false,
        },
        // {
        //     id: 10,
        //     title: 'BLE Device',
        //     icon: IMAGES.icons.home.prescriptions,
        //     onPress: () => navigation.push(NAVIGATION.newDevice),
        //     visible: false,
        // },
        // {
        //   title: strings.getCare.name,
        //   icon: IMAGES.icons.home.getCare,
        //   onPress: () => {
        //     if (dependentName === 'SELF') {
        //       navigation.push(NAVIGATION.getCare);
        //     } else {
        //       navigation.push(NAVIGATION.bookingList);
        //     }
        //   },
        //},
    ];

    /**Render dymanic menu options based on the product type */
    const initializeMenu = () => {
        let licensedProduct = profile.licensedProduct;
        let data = menu.map(item => {
            if (licensedProduct?.RPM) {
                // Show all options in home
                item.visible = true;
            }
            // Handle item with id 8 or id 9
            if ((item.id === 8 || item.id === 9) && licensedProduct?.RPM) {
                item.visible = false;
            }
            if (
                licensedProduct?.virtualCare &&
                (item.id == 3 || item.id == 4 || item.id == 7 || item.id == 8 || item.id == 9)
            )
                item.visible = true;
            return item;
        });
        setMenu(data);
    };
    return (
        <View style={styles.container}>
            <AppHeader
                title={Validate.empty(name) ? 'Home' : (name.length > 14 ? name.substring(0, 14) + '...' : name)}
                toggle={true}
                onBackPress={() => navigation.toggleDrawer()}
                onRightPress={() => navigation.navigate(NAVIGATION.notification)}
                customTitleContainerTxt={styles.titleContainerTxt}
                rightIconContainer={styles.rightIconContainer}
                />
            <View
                style={{
                    paddingHorizontal: moderateScale(20),
                }}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={{justifyContent: 'space-between'}}
                    data={home_menu.filter(item => item.visible)}
                    numColumns={2}
                    renderItem={({item}) => {
                        return (
                            <TouchableOpacity style={styles.listContainer} onPress={item.onPress}>
                                <Image source={item.icon} imageStyle={styles.img} />
                                <TextView
                                    title={item.title}
                                    textStyle={styles.textView}
                                    color={isDarkMode ? colors.secondary : colors.secondary}
                                    //color={'#005DA8'}
                                />
                            </TouchableOpacity>
                        );
                    }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No product access given</Text>
                        </View>
                    }
                    ListFooterComponent={<View style={{marginVertical: moderateScale(30)}} />}
                    keyExtractor={(item, index) => index}
                />
            </View>
            {profile?.relatedPerson?.length > 0 ? (
                <Modal
                    //  visible={profile.selectedProfile ? false : true}
                    visible={showModal}
                    animationType="slide"
                    presentationStyle="formSheet">
                    <View style={{flex: 1, justifyContent: 'flex-end'}}>
                        <BlurView style={styles.absolute} blurType="light" blurAmount={10} />
                        <Dependent setModalVisibilty={status => setShowModal(status)} />
                    </View>
                </Modal>
            ) : null}
        </View>
    );
}
