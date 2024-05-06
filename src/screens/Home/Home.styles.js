import {StyleSheet, Platform} from 'react-native';
import {Fonts} from '@/assets';
import {colors} from '@/theme';
import {hp, wp, moderateScale} from '@/hooks/scale';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  listContainer: {
    height: Platform.OS === 'ios' ? hp(17.5) : hp(18.5),
    width: wp(42.3),
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.14)',
    marginTop: moderateScale(17.5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(10),
  },
  textView: {
    fontWeight: '600',
    fontSize: moderateScale(20),
    textAlign: 'center',
    marginTop: moderateScale(15),
    fontFamily: Fonts.medium,
    color: 'red',
  },
  img: {
    height: moderateScale(45),
    width: moderateScale(45),
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
  titleContainerTxt: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
