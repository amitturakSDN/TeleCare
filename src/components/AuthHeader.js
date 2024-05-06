import {IMAGES} from '@/assets';
import {Logo} from '@/components';
import {deviceHeight, deviceWidth, moderateScale} from '@/hooks/scale';
import {Image, StyleSheet} from 'react-native';

export function AuthHeader(props) {
  return (
    <>
      <Image
        source={IMAGES.auth.banner}
        style={styles.banner}
        resizeMode="stretch"
      />
      <Logo style={styles.logoContainer} logoImgStyle={styles.logo} />
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: deviceHeight / 2.3,
    width: deviceWidth,
  },
  logoContainer: {
    marginTop: moderateScale(20),
    height: moderateScale(30),
    paddingHorizontal: moderateScale(22),
    width: moderateScale(deviceWidth),
  },
  logo: {
    height: moderateScale(47),
    width: moderateScale(184),
  },
});
