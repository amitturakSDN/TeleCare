import {hp, wp, moderateScale, scale, verticalScale} from '@/hooks/scale';
import {StyleSheet, Dimensions} from 'react-native';
import {typography, colors} from '@/theme';
import {Fonts} from '@/assets';

export const styles = StyleSheet.create({
  feedbackView: {
    width: '100%',
    // height: moderateScale(75),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.14)',
    marginVertical: moderateScale(10),
    padding: moderateScale(10),
  },
  mainView: {
    marginHorizontal: moderateScale(16),
  },
  feedbackque: {
    fontWeight: '600',
    fontSize: moderateScale(20),
    fontFamily: Fonts.regular,
    color: colors.DARK_BLUE,
  },
  starView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(8),
  },
  inputsubmitView: {
    // marginHorizontal: moderateScale(0),
    // marginVertical: 0,
  },
  btnView: {
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(50),
  },
  btn: {
    // marginVertical: moderateScale(15),
    marginBottom: moderateScale(30),
  },
  ratingTextView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingText: {
    fontWeight: '400',
    fontSize: moderateScale(12),
    fontFamily: Fonts.regular,
    color: 'rgba(0, 0, 0, 0.38)',
    lineHeight: moderateScale(24),
  },
});
