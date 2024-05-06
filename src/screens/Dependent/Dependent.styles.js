import {StyleSheet} from 'react-native';
import {deviceHeight, moderateScale} from '@/hooks/scale';
import {Fonts} from '@/assets';
import {colors} from '@/theme';

export const styles = StyleSheet.create({
  listContainer: {
    // height: moderateScale(80),
    borderWidth: 1,
    marginTop: moderateScale(17),
    borderRadius: moderateScale(10),
    borderColor: 'rgba(0, 0, 0, 0.14)',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    //  padding: moderateScale(24),
    padding: moderateScale(23),
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleContainer: {
    alignItems: 'center',
    //  marginTop: moderateScale(20),
    paddingVertical: moderateScale(10),
  },
  title: {
    fontSize: moderateScale(30),
    fontWeight: '500',
    fontFamily: Fonts.semibold,
    color: colors.BLACK,
  },
  subtitle: {
    fontSize: moderateScale(18),
    fontWeight: '500',
    fontFamily: Fonts.medium,
    color: colors.DARK_BLUE,
  },
  swiper: {
    width: '15%',
    height: moderateScale(8),
    marginTop: moderateScale(15),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    alignSelf: 'center',
  },

  relationship: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.medium,
    fontWeight: '400',
  },

  listContainerNot: {
    marginTop: moderateScale(10),
    paddingHorizontal: moderateScale(20),
  },
  contentContainer: {marginVertical: moderateScale(10), width: '100%'},
  msgContainer: {flexDirection: 'row', width: '100%'},
  msgTxt: {
    textAlign: 'justify',
    fontFamily: Fonts.semibold,
    fontSize: moderateScale(15),
  },
  timeTxt: {
    textAlign: 'justify',
    fontFamily: Fonts.medium,
    fontSize: moderateScale(12),
  },
  timeContainer: {marginVertical: moderateScale(10)},
  btnContainer: {
    flexDirection: 'row',
    paddingVertical: moderateScale(10),
  },
  acceptContainer: {
    paddingHorizontal: moderateScale(10),
    height: moderateScale(40),
    width: moderateScale(100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.TEXT_GREEN,
    borderRadius: moderateScale(50),
  },
  acceptTxt: {
    fontFamily: Fonts.semibold,
    fontSize: moderateScale(16),
  },
  rejectBtnContainer: {
    paddingHorizontal: moderateScale(10),
    height: moderateScale(40),
    marginLeft: moderateScale(10),
    width: moderateScale(100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ERROR_RED,
    borderRadius: moderateScale(50),
  },
  separator: {
    borderWidth: 0.5,
    width: '100%',
    borderColor: 'rgba(0, 0, 0, 0.14)',
  },
  empty: {
    height: deviceHeight - 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
