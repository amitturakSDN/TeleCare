import {StyleSheet, useColorScheme} from 'react-native';
import {moderateScale} from '@/hooks/scale';
import {colors} from '@/theme';
import {Fonts} from '@/assets';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  daySelectionAnimation: {
    type: 'background',
    duration: 300,
    highlightColor: colors.PURPLE,
  },
  calendarAnimation: {
    type: 'sequence',
    duration: 30,
  },
  calendarHeaderStyle: {
    color: colors.BLACK,
    fontSize: moderateScale(18),
    alignSelf: 'flex-start',
    fontFamily: Fonts.regular,
    fontWeight: '500',
  },
  calendarStyle: {
    height: moderateScale(100),
    backgroundColor: 'white',
  },
  calendarColor: {
    color: colors.WHITE,
  },
  dayContainerStyle: {
    height: moderateScale(40),
    justifyContent: 'center',
  },
  dateNameStye: {
    color: colors.BLACK,
    fontSize: moderateScale(12),
  },
  dateNumberStyle: {
    color: colors.BLACK,
    fontSize: moderateScale(14),
  },
  highlightDateNameStye: {
    color: colors.WHITE,
    fontSize: moderateScale(12),
  },
  highlightDateNumberStyle: {
    color: colors.WHITE,
    fontSize: moderateScale(14),
  },
  highlightDateContainerStyle: {
    backgroundColor: colors.PRIMARY_BLUE,
    borderRadius: moderateScale(8),
    height: moderateScale(40),
    justifyContent: 'center',
  },
  btnStyle: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: moderateScale(44),

    marginVertical: moderateScale(10),
    borderRadius: moderateScale(10),
  },
  text1: {
    color: colors.BLACK,
    fontSize: moderateScale(18),
    fontFamily: Fonts.semibold,
  },
  text2: {
    color: '#8E8E8E',
    fontSize: moderateScale(14),
    fontFamily: Fonts.medium,
  },
  text3: {
    // color: '#555555',
    fontSize: moderateScale(16),
    fontFamily: Fonts.medium,
  },
  listView: {
    minHeight: moderateScale(270),
    width: '100%',
    borderRadius: moderateScale(10),
    borderColor: 'rgba(0, 93, 168, 0.35)',
    borderWidth: 0.5,
  },
  listInsideView: {
    justifyContent: 'space-between',
    height: moderateScale(50),
    backgroundColor: '#005DA8',
    borderTopEndRadius: moderateScale(10),
    borderTopStartRadius: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  listShowView: {
    flex: 1,
    alignItems: 'center',
    marginVertical: moderateScale(10),
  },
  listInsideShowView: {
    borderWidth: 0.3,
    height: moderateScale(85),
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    //  borderColor: '#FF0000',
    borderRadius: moderateScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: moderateScale(15),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  showLeft: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: 50,
    backgroundColor: '#E0EBF49C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  showCenter: {
    flexDirection: 'column',
    flex: 0.4,
    alignItems: 'flex-start',
  },
  showRight: {
    flex: 0.35,
    alignItems: 'center',
  },
  btnUpdate: {
    height: moderateScale(38),
    width: moderateScale(88),
    backgroundColor: 'rgba(142, 142, 142, 0.15)',
    marginHorizontal: moderateScale(20),
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  takenStatusContainer: {
    height: moderateScale(38),
    width: moderateScale(88),
    marginHorizontal: moderateScale(20),
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
