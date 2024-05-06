import {StyleSheet} from 'react-native';
import {hp, wp, moderateScale} from '@/hooks/scale';
import {typography, colors} from '@/theme';
import {Fonts} from '@/assets';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noResultStyle: {
    fontSize: moderateScale(16),
    marginVertical: moderateScale(10),
    fontFamily: Fonts.medium,
  },
  outerContainer: {
    flexDirection: 'row',
    height: moderateScale(85),
    borderWidth: 1,
    borderColor: '#0000001F',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: moderateScale(10),
  },
  innerContainer: {
    flex: 0.25,
    backgroundColor: '#005DA80F',
    borderTopRightRadius: moderateScale(85),
    height: moderateScale(85),
    borderBottomRightRadius: moderateScale(85),
    alignItems: 'center',
    justifyContent: 'center',
  },
  latestReadingFont: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    fontFamily: Fonts.medium,
  },
  latestReadingTime: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    marginTop: moderateScale(10),
    color: '#8E8E8E',
  },
  readingValue: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#005DA8',
    alignSelf: 'center',
    textAlign: 'center',
  },
  endDateContainer: {
    borderWidth: 1,
    borderColor: '#0000001F',
    borderRadius: 10,
    height: moderateScale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  toTextContainer: {
    flex: 0.2,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endDateText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: 'black',
    fontFamily: Fonts.medium,
  },
  deviceText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#8E8E8E',
    fontFamily: Fonts.medium,
    marginTop: moderateScale(2),
    marginLeft: moderateScale(5),
  },
  readingText: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    alignSelf: 'center',
    fontFamily: Fonts.bold,
  },
  conditionText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    alignSelf: 'center',
    color: '#8E8E8E',
    fontFamily: Fonts.medium,
  },
});
