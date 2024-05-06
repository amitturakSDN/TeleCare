import {StyleSheet} from 'react-native';
import {spacing, colors} from '@/theme';
import {deviceWidth, moderateScale, wp, hp} from '@/hooks/scale';
import { Fonts } from '@/assets';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleStyle: {
    fontWeight: '500',
    fontSize: wp(4.9),
    color: colors.BLACK,
    fontFamily:Fonts.regular
  },
  scaleStyle:{
    fontSize: moderateScale(15),
    fontWeight: '400',
    fontFamily:Fonts.medium,
    color:'#969696'
  }
 
});
