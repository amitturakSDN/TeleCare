import {logout} from '@/actions/UserActions';
import {Fonts, IMAGES} from '@/assets';
import {Image, TextView} from '@/components';
import {NAVIGATION} from '@/constants';
import {moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {useDrawerProgress} from '@react-navigation/drawer';
import {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, useColorScheme, FlatList} from 'react-native';
import Animated, {Extrapolate, interpolate, useAnimatedStyle} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
export function CustomDrawerContent({navigation}) {
    const menu = [
        {
            id: 1,
            visible: true,
            label: 'Home',
            icon: IMAGES.icons.drawerMenu.home,
            onPress: () => navigation.navigate(NAVIGATION.home),
        },
        {
            id: 2,
            visible: false,
            label: 'Sessions',
            icon: IMAGES.icons.drawerMenu.sessions,
            onPress: () => navigation.navigate(NAVIGATION.session),
        },
        {
            id: 3,
            visible: false,
            label: 'Disease Management',
            icon: IMAGES.icons.drawerMenu.disease,
            onPress: () => navigation.navigate(NAVIGATION.diseaseListing),
        },
        {
            id: 4,
            visible: false,
            label: 'Medication',
            icon: IMAGES.icons.drawerMenu.medication,
            onPress: () => NAVIGATION.medication,
        },
        {
            id: 5,
            visible: true,
            label: 'Profile',
            icon: IMAGES.icons.drawerMenu.profile,
            onPress: () => navigation.navigate(NAVIGATION.profile),
        },
        {
            id: 6,
            visible: false,
            label: 'Dependent',
            icon: IMAGES.icons.drawerMenu.dependent,
            onPress: () => navigation.navigate(NAVIGATION.dependentInternal),
        },
        {
            id: 7,
            visible: true,
            label: 'Settings',
            icon: IMAGES.icons.drawerMenu.settings,
            onPress: () => navigation.navigate(NAVIGATION.settings),
        },
    ];

    const dispatch = useDispatch();
    const {profile} = useSelector(state => state);
    const isDarkMode = useColorScheme() === 'dark';
    const [home_menu, setMenu] = useState([]);
    const progress = useDrawerProgress();
    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(progress.value, [0, 1], [1, 0.8], {
            extrapolateRight: Extrapolate.CLAMP,
        });

        return {
            transform: [{scale}],
        };
    });

    /**Show Dynamic menu options */
    useEffect(() => {
        initializeMenu();
    }, [profile]);

    const initializeMenu = () => {
        let licensedProduct = profile.licensedProduct;
        let data = menu.map(item => {
            if (licensedProduct?.RPM)
                //Show all options in home
                item.visible = true;
            if (
                licensedProduct?.virtualCare &&
                (item.id == 2 || item.id == 6) //Show Get Care, Appointment and Releated person Option
            )
                item.visible = true;
            return item;
        });
        setMenu(data);
    };

    const logoutUser = () => {
        navigation.toggleDrawer();
        dispatch(logout());
    };

    return (
        <Animated.View style={[styles.container, {}]}>
            <View style={styles.subContainer}>
                <Image source={IMAGES.auth.logo} />
                <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                    <Image source={IMAGES.icons.common.close} />
                </TouchableOpacity>
            </View>

            <View style={{marginHorizontal: moderateScale(20)}}>
                <FlatList
                    data={home_menu.filter(item => item.visible)}
                    ListHeaderComponent={<View style={{marginVertical: moderateScale(50)}}></View>}
                    renderItem={({item}) => {
                        return (
                            <TouchableOpacity onPress={item.onPress} style={styles.listContainer}>
                                <View style={{flex: 0.15}}>
                                    <Image source={item.icon} />
                                </View>
                                <View style={{flex: 0.85}}>
                                    <TextView
                                        title={item.label}
                                        color={isDarkMode ? '#fff' : '#000000'}
                                        textStyle={styles.textStyle}
                                    />
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    ListFooterComponent={
                        <TouchableOpacity style={styles.logout} onPress={logoutUser}>
                            <View style={{flex: 0.15}}>
                                <Image source={IMAGES.icons.drawerMenu.logout} />
                            </View>
                            <View style={{flex: 0.85}}>
                                <TextView
                                    title={strings.profile.logout}
                                    textStyle={styles.textStyle}
                                    color={isDarkMode ? '#fff' : '#000000'}
                                />
                            </View>
                        </TouchableOpacity>
                    }
                />
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: moderateScale(50),
    },
    subContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: moderateScale(20),
    },
    listContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginVertical: moderateScale(10),
    },
    textStyle: {
        fontWeight: '500',
        fontFamily: Fonts.bold,
        fontSize: moderateScale(18),
    },
    logout: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: moderateScale(80),
    },
});
