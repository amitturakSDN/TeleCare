import {
  hp,
  wp,
  moderateScale,
  scale,
  deviceHeight,
  verticalScale,
  deviceWidth,
} from '@/hooks/scale';
import {StyleSheet} from 'react-native';
import {colors} from '@/theme';
import {Fonts} from '@/assets';

export const styles = StyleSheet.create({
  sectionView: {
    marginTop: moderateScale(8),
    marginHorizontal: moderateScale(15),
  },
  listView: {
    marginHorizontal: moderateScale(15),
  },
  tabTextBtn: {
    width: deviceWidth / 3,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  section1: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    marginTop: moderateScale(14),
    padding: moderateScale(12),
    borderColor: 'rgba(0, 0, 0, 0.14)',
    borderWidth: 1,
    alignItems: 'center',
  },
  sessionText: {
    fontSize: moderateScale(16),
    color: '#121F48',
    fontFamily: Fonts.regular,
    fontWeight: '700',
    marginTop: moderateScale(18),
  },
  noteName: {
    fontFamily: Fonts.bold,
    fontSize: moderateScale(22),
    fontWeight: '700',
    color: '#005DA8',
  },
  detailsView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: moderateScale(8),
  },
  timeText: {
    fontSize: moderateScale(18),
    color: '#121F48',
    marginLeft: moderateScale(6),
    fontFamily: Fonts.regular,
    fontWeight: '400',
  },
  hrline: {
    width: '100%',
    height: 1,
    backgroundColor: '#0000001C',
    marginTop: moderateScale(8),
  },
  noteText: {
    fontSize: wp(3.9),
    color: '#121F48',
    fontFamily: Fonts.regular,
    fontWeight: '400',
    marginTop: moderateScale(4),
  },
  emptyText: {
    fontSize: moderateScale(20),
    fontFamily: Fonts.medium,
    color: colors.DARK_BLUE,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: '30%',
  },
});
