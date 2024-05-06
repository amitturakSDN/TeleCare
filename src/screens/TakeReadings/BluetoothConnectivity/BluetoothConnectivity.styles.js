import {Fonts} from '@/assets';
import {StyleSheet} from 'react-native';
import {moderateScale} from '@/hooks/scale';
import { colors } from '@/theme';
export const styles = StyleSheet.create({
  typeTxt: {
    fontSize: moderateScale(22),
    fontWeight: '500',
    fontFamily: Fonts.semibold,
  },
  typeContainer: {marginVertical: moderateScale(10), width: '100%'},
  listContainer: {
    height: moderateScale(88),
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.14)',
    borderRadius: moderateScale(10),
    marginVertical: moderateScale(7),
    flexDirection: 'row',
    alignItems: 'center',
  },
  listImgContainer: {width: '18%', marginHorizontal: moderateScale(10)},
  listTextContainer: {width: '62%', flexDirection: 'column'},
  listTxt: {
    fontSize: moderateScale(18),
    fontWeight: '500',
    fontFamily: Fonts.semibold,
    color:colors.BLACK
  },
  subTxt: {
    fontSize: moderateScale(14),
    fontWeight: '300',
    fontFamily: Fonts.regular,
    color:colors.TEXT4
  },
  addBtn: {
    width: '100%',
    marginTop: moderateScale(30),
    marginBottom: moderateScale(50),
    height: moderateScale(20),
    alignItems: 'flex-end',
  },
});
