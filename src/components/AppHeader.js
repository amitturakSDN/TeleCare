import {logout} from '@/actions/UserActions';
import {Fonts, IMAGES} from '@/assets';
import {Image, TextView} from '@/components';
import {deviceWidth, moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {colors} from '@/theme';
import {useNavigation} from '@react-navigation/native';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

export function AppHeader({
  title,
  onRightPress,
  onBackPress,
  toggle,
  rightIcon,
  customTextStyle = {},
  customTitleContainerTxt = {},
  rightIconContainer = {},
  color = '',
  disableBackButton = false, 
}) {
  const navigation = useNavigation();
  const {notification} = useSelector(state => state);
  const filterData = notification.list.filter(e => e.markAsRead == false);
  const dispatch = useDispatch();

  const logoutUser = () => {
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
     {!disableBackButton && !toggle && ( // Check if disableBackButton is false, and toggle is also false
        <TouchableOpacity onPress={onBackPress}>
          <Image
            source={IMAGES.icons.common.back}
            imageStyle={styles.banner}
            containerStyle={{padding: 10}}
          />
        </TouchableOpacity>
      )}
      {!toggle && disableBackButton && ( // Check if toggle is false and disableBackButton is true
        <View style={styles.placeholder} /> // Placeholder view to maintain layout
      )}
      {toggle && ( // Conditionally render logout button based on toggle
        <TouchableOpacity style={styles.logout} onPress={logoutUser}>
          <View>
            <TextView
              title={strings.profile.logout}
              textStyle={[styles.textStyle]}
              color={'#fff'}
            />
          </View>
        </TouchableOpacity>
      )}
      <View style={[customTitleContainerTxt]}>
        <TextView
          title={title}
          color={color == '' ? colors.DARK_BLUE : color}
          textStyle={[styles.title, customTextStyle]}
        />
      </View>
      <TouchableOpacity
        onPress={onRightPress}
        style={[rightIconContainer]}>
        {onRightPress && (
          <View>
            {filterData.length > 0 ? (
              <View style={styles.count}>
                <Text style={styles.badgeStyle}>{filterData.length}</Text>
              </View>
            ) : null}
            <Image
              source={rightIcon ?? IMAGES.icons.notification}
              imageStyle={styles.banner}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    marginTop: moderateScale(44),
    paddingHorizontal: 22,
    width: moderateScale(deviceWidth),
  },
  logo: {
    height: moderateScale(47),
    width: moderateScale(184),
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(20),
    alignItems: 'center',
    height: Platform.OS == 'ios' ? moderateScale(50) : moderateScale(70),
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: moderateScale(24),
    color: colors.DARK_BLUE,
    fontFamily: Fonts.bold,
    paddingLeft: moderateScale(20),
  },
  leftView: {
    flex: 0.2,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignSelf: 'center',
    alignItems: 'flex-start',
  },
  midView: {
    flex: 0.6,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  rightView: {
    flex: 0.2,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'flex-end',
  },
  badgeStyle: {
    fontSize: moderateScale(12),
    color: 'white',
    fontFamily: Fonts.bold,
    // fontWeight: '500',
  },
  count: {
    height: moderateScale(20),
    // width: moderateScale(20),
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000',
    borderRadius: 20,
    position: 'absolute',
    top: 3,
    left: 35,
    zIndex: 2,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // position:"absolute",
    // top:hp(65),
    // left:moderateScale(20),
    marginTop: moderateScale(0),
    width: moderateScale(80),
    height: moderateScale(30),
    backgroundColor: colors.PRIMARY_BLUE,
    borderRadius: moderateScale(6),
  },
  textStyle: {
    fontWeight: '500',
    fontFamily: Fonts.bold,
    fontSize: moderateScale(16),
  },
});
