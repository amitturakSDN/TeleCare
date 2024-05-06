import { StyleSheet } from 'react-native';
import { spacing } from '@/theme';
import { deviceWidth, moderateScale } from '@/hooks/scale';
import { Fonts } from '@/assets';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    borderRadius: 5,
    // padding: spacing.s,
    width: '100%',
    paddingBottom : spacing.l
    
  },
  submitButton: {
    marginTop: spacing.m,
  },
  viewTitle : {
    width : deviceWidth,
  },
  title : {
    fontSize : moderateScale(36),
    fontWeight : '700',
    fontFamily : Fonts.bold
  },
  fieldContainer : {
    padding : spacing.s
  },
  login : { justifyContent : 'center', width : '100%', alignItems : 'center', marginVertical : moderateScale(12) }
});
