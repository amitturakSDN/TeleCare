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
    marginTop: moderateScale(30),
    borderRadius:10
  },
  viewTitle : {
    width : deviceWidth,
    marginTop: moderateScale(10),
  },
  title : {
    fontSize : moderateScale(36),
    fontWeight : '700',
    fontFamily : Fonts.bold
  },
  fieldContainer : {
    padding : spacing.s
  }
});
