import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import { deviceWidth, moderateScale } from '@/hooks/scale';
import { Fonts } from '@/assets';
import { useTheme } from '@react-navigation/native';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    borderRadius:moderateScale(5) ,
    // padding: spacing.s,
    width: '100%',
    paddingBottom :moderateScale(spacing.l) 
    
  },
  submitButton: {
    marginTop:  moderateScale(spacing.m) ,
  },
  viewTitle : {
    // width : deviceWidth,
  },
  title : {
    fontSize : moderateScale(36),
    fontWeight : '700',
    fontFamily : Fonts.bold
  },
  fieldContainer : {
    padding : moderateScale(20) 
  },
  subtitle : {
    fontSize : moderateScale(18),
    fontWeight : '400',
    fontFamily : Fonts.medium,
   
  },
  subtitleView : {
    // width : deviceWidth,
    marginVertical : moderateScale(26)
  }
});
