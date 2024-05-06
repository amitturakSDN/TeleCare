import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import { deviceWidth, moderateScale } from '@/hooks/scale';
import { Fonts } from '@/assets';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.WHITE
  },
  formContainer: {
    borderRadius: 5,
    // padding: spacing.s,
    width: '100%',
    paddingBottom : spacing.l
    
  },
  submitButton: {
    marginTop: spacing.m,
    borderRadius:10
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
  subtitle : {
    fontSize : moderateScale(18),
    fontWeight : '400'
  },
  subtitleView : {
    width : deviceWidth,
    marginVertical : moderateScale(10)
  },
  underlineStyleBase :  {
    backgroundColor : '#F6F6F6',
    borderRadius : moderateScale(10),
    // marginTop : moderateScale(-100),
    color : '#000'
  },
  otpInput : {
    width: '100%',
    height: moderateScale(50),
    marginTop: moderateScale(10),
    // backgroundColor : 'red'
  }
});
