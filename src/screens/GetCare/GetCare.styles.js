import {hp, wp, moderateScale, scale, verticalScale} from '@/hooks/scale';
import {StyleSheet, Dimensions} from 'react-native';
import {typography, colors} from '@/theme';
import {Fonts} from '@/assets';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: wp(6.8),
    color: colors.BLACK,
    fontWeight: '500',
    marginTop: moderateScale(50),
  },
  circleView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(50),
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
    fontWeight: '700',
  },
  scale: {
    fontSize: wp(3.9),
    color: colors.TEXT,
    fontWeight: '500',
  },
  msg: {
    marginTop: moderateScale(50),
    fontSize: wp(3.9),
    color: colors.TEXT1,
    fontWeight: '500',
  },
  vitalContainer: {flexDirection: 'row', marginVertical: moderateScale(20)},
  titleContainerActive: {
    marginHorizontal: moderateScale(10),
    borderBottomWidth: 3,
    borderColor: '#005DA8',
  },
  titleText: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.regular,
    fontWeight: '600',
  },
  titleContainerInactive: {
    marginHorizontal: moderateScale(10),
  },
  menuContainer: {
    width: '100%',
    height: moderateScale(75),
    borderRadius: moderateScale(10),
    flexDirection: 'row',
    marginVertical: moderateScale(10),
  },
  titleContainer: {
    width: '56%',
    justifyContent: 'center',
    height: '100%',
    marginVertical: moderateScale(0),
  },

  typeTxt: {
    fontSize: moderateScale(22),
    fontWeight: '500',
    fontFamily: Fonts.semibold,
  },
  typeContainer: {marginVertical: moderateScale(10), width: '100%'},
  listContainer: {
    height: moderateScale(80),
    borderWidth: 1,
    marginTop: moderateScale(17),
    borderRadius: moderateScale(10),
    borderColor: 'rgba(0, 0, 0, 0.14)',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: moderateScale(24),
  },
  listImgContainer: {width: '30%', marginHorizontal: moderateScale(10)},
  listTextContainer: {width: '50%', flexDirection: 'column'},
  textTitle: {
    fontSize: moderateScale(18),
    fontWeight: '500',
    fontFamily: Fonts.semibold,
    marginHorizontal: moderateScale(15),
  },
  listTxt: {
    fontSize: moderateScale(18),
    fontWeight: '500',
    fontFamily: Fonts.semibold,
    color: colors.BLACK,
  },
  subTxt: {
    fontSize: moderateScale(14),
    fontWeight: '300',
    fontFamily: Fonts.regular,
    color: colors.TEXT4,
  },
  addBtn: {
    width: '100%',
    marginTop: moderateScale(30),
    marginBottom: moderateScale(50),
    height: moderateScale(20),
    alignItems: 'flex-end',
  },

  relationship: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.medium,
    fontWeight: '400',
  },
});
