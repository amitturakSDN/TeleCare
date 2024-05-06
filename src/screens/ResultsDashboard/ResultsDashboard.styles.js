import {hp, wp, moderateScale, scale, verticalScale} from '@/hooks/scale';
import {StyleSheet} from 'react-native';
import {typography, colors} from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: moderateScale(100),
  
  },
  title: {
    fontSize: wp(6.8),
    color: colors.BLACK,
    fontWeight:"500"
  },
  circleView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:moderateScale(50),
  },
  outerCircle: {
    width: moderateScale(300),
    height: moderateScale(300),
    backgroundColor: colors.OUTERCIRCLE,
    borderRadius: moderateScale(300),
    alignSelf: 'center',
  },
  midCircle: {
    width: moderateScale(250),
    height: moderateScale(250),
    backgroundColor: colors.MIDCIRCLE,
    borderRadius: moderateScale(250),

    alignSelf: 'center',
    marginTop: moderateScale(25),
  },
  innerCircle: {
    width: moderateScale(160),
    height: moderateScale(160),
    backgroundColor: colors.WHITE,
    borderRadius: moderateScale(160),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: moderateScale(45),
  },
  readingCount: {
    fontSize: wp(7.9),
    color: colors.TEXT_GREEN,
    fontWeight:"700"
  },
  scale: {
    fontSize: wp(3.9),
    color: colors.TEXT,
    fontWeight:"500"
  },
  msg: {
    marginTop:moderateScale(50),
    fontSize: wp(3.9),
    color: colors.TEXT1,
    fontWeight:"500"
  },
});
