import {StyleSheet} from 'react-native';
import {moderateScale} from '@/hooks/scale';
import {Fonts} from '@/assets';
import {colors} from '@/theme';

export const styles = StyleSheet.create({
  listContainer: {
    borderWidth: 1,
    marginTop: moderateScale(17),
    borderRadius: moderateScale(10),
    borderColor: 'rgba(0, 0, 0, 0.14)',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: moderateScale(23),
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: moderateScale(20),
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
});
