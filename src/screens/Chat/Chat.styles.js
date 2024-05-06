import {StyleSheet} from 'react-native';
import {hp, wp, moderateScale} from '@/hooks/scale';
import {typography,colors} from '@/theme';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchView: {
    flexDirection: 'row',
    marginHorizontal: moderateScale(20),
    alignItems: 'center',
    marginTop: moderateScale(15),
    justifyContent: 'space-between',
  },
  searchEdit:{
    height: hp(6),
    width: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(100),
    backgroundColor: colors.BG_GREY,
  },
  listContainer:{
    marginTop: moderateScale(23),
    paddingBottom: moderateScale(12),
    marginHorizontal: moderateScale(20),
  }
});
