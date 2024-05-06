import {hp, wp, moderateScale, scale, verticalScale} from '@/hooks/scale';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000009C'
  },
  back: {
    position: 'absolute',
    top: moderateScale(20),
    left: moderateScale(20),
    zIndex: 10,
    width: moderateScale(30),
    height: moderateScale(30),
  },
  cameraPreview: {
    position: 'absolute',
    width: moderateScale(160),
    height: moderateScale(200),
    left: moderateScale(200),
    top: moderateScale(330),
    borderRadius: 20,
    backgroundColor: 'yellow',
  },
  name: {
    fontSize: wp(6.9),
    color: '#fff',
    fontWeight: '700',
    marginTop: moderateScale(550),
    marginBottom: moderateScale(10),
  },
  time: {
    fontSize: wp(4.5),
    color: '#fff',
    fontWeight: '400',
  },
});
