import {Fonts} from '@/assets';
import {moderateScale} from '@/hooks/scale';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  listContainer: {
    height: moderateScale(55),
    borderBottomWidth: moderateScale(1),
    marginBottom: moderateScale(10),
    borderColor: 'rgba(0, 0, 0, 0.14)',
    borderRadius: moderateScale(10),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  titleContainer: {justifyContent: 'center', width: '70%'},
  imgView: {flexDirection: 'row', width: '10%'},
  title: {
    fontFamily: Fonts.medium,
    fontSize: moderateScale(15),
    color: '#005DA8',
    fontWeight: '700',
  },
  description: {
    fontFamily: Fonts.medium,
    fontSize: moderateScale(16),
    color: '#8E8E8E',
    fontWeight: '400',
  },
  lottie: {width: moderateScale(100), height: moderateScale(100)},
  relation: {fontFamily: Fonts.medium, fontSize: moderateScale(12)},
});
