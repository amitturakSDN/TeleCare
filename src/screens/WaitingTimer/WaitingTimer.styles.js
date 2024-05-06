import {StyleSheet} from 'react-native';
import {deviceWidth, moderateScale, wp} from '@/hooks/scale';
import {Fonts} from '@/assets';
import {colors} from '@/theme';
export const styles = StyleSheet.create({
  customTitle: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.semibold,
    color: colors.PRIMARY_BLUE,
  },
  header: {
    fontSize: moderateScale(20),
    textAlign: 'center',
    fontFamily: Fonts.semibold,
    marginVertical: moderateScale(10),
  },
  personCount: {
    fontSize: moderateScale(17),
    textAlign: 'center',
    fontFamily: Fonts.semibold,
    marginBottom: moderateScale(10),
  },
  note: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    fontFamily: Fonts.semibold,
  },

  btnText2: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.bold,
    color: 'rgba(255, 0, 0, 1)',
    paddingHorizontal: moderateScale(10),
  },

  btnText: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.bold,
    color: colors.WHITE
  },

  btn: {
    backgroundColor: 'rgba(255, 0, 0, 0.18)',
    borderRadius: moderateScale(30),
    padding: moderateScale(10),
    alignItems: 'center',
    marginVertical: moderateScale(30),
  },

  btn2: {
    marginVertical: moderateScale(10),
    marginBottom: moderateScale(20),
    paddingHorizontal: moderateScale(10),
  },

  infoView: {
      flex: 1,
      flexDirection: 'row',
    },
    subText: {
      flex: 0.85,
    },
    btnstyle: {
      flexDirection: 'column',
      backgroundColor: colors.white,
      borderRadius: 10,
      marginVertical: moderateScale(8),
      paddingTop: moderateScale(12),
      paddingBottom: moderateScale(18),
      paddingHorizontal: moderateScale(18),
      borderColor: 'rgba(0, 0, 0, 0.14)',
      borderWidth: 1,
      // shadowOffset: {width: 0, height: -2},
      //shadowOpacity: 0.5,
      //shadowRadius: 1,
    },
    nameText: {
      fontSize: moderateScale(20),
      color: colors.secondary,
      fontFamily: Fonts.medium,
      fontWeight: '700',
    },
    specialityText: {
      fontSize: wp(3.7),
      color: colors.text,
      marginTop: moderateScale(4),
      fontFamily: Fonts.regular,
      fontWeight: '400',
    },
    userImgView: {
      flex: 0.15,
    },
    timeView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: moderateScale(4.5),
    },
    timeText: {
      fontSize: moderateScale(16),
      color: colors.text,
      marginLeft: moderateScale(6),
      fontFamily: Fonts.regular,
      fontWeight: '400',
    },
    dateText: {
      fontSize: moderateScale(16),
      color: colors.text,
      marginLeft: moderateScale(6),
      fontFamily: Fonts.regular,
      fontWeight: '400',
    },
    btnSection: {
      marginTop: moderateScale(12),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cancelBtn: {
      alignItems: 'center',
      justifyContent: 'center',
      // width: moderateScale(125),
      width: deviceWidth / 3,
      height: moderateScale(36),
      backgroundColor: colors.secondaryGrey,
      borderRadius: 50,
    },
    cancelText: {
      fontSize: moderateScale(18),
      color: colors.black,
      fontFamily: Fonts.light,
      fontWeight: '600',
    },
    joinBtn: {
      alignItems: 'center',
      justifyContent: 'center',
      width: deviceWidth / 2.7,
      height: moderateScale(36),
      backgroundColor: colors.secondary,
      borderRadius: 50,
    },
    joinText: {
      fontSize: moderateScale(18),
      color: colors.white,
      fontFamily: Fonts.light,
      fontWeight: '600',
    },
    iconView: {
      height: moderateScale(35),
      width: moderateScale(35),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.secondary,
      borderRadius: moderateScale(50),
    },
});
