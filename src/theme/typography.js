import { StyleSheet } from 'react-native';
import {Fonts} from '@/assets'
import {hp, wp, moderateScale} from '@/hooks/scale';
import {colors} from '@/theme';
export const typography = StyleSheet.create({
  largeTitle:{
    fontSize: moderateScale(20),
    fontWeight: '600',
    fontFamily:Fonts.semibold,
    color:colors.DARK_BLUE
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '500',
    color:colors.TEXT2,
    fontFamily:Fonts.medium,
  },
  text: {
 fontSize: moderateScale(16),
    fontWeight: '400',
    color:colors.TEXT2,
    fontFamily:Fonts.regular,
  },
  label: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color:colors.TEXT2
  },
  error: {
    fontSize: moderateScale(14),
    fontWeight: '400',
    color:colors.ERROR_RED
  },
  xlText:{
    fontFamily:Fonts.bold,
    fontWeight:"700",
    fontSize: moderateScale(24),
    color:colors.BLACK,
   
  }
});
