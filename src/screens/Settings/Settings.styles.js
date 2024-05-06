import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import { deviceWidth,hp,wp, moderateScale } from '@/hooks/scale';
import {Fonts, IMAGES} from '@/assets';
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
    fontWeight : '700'
  },
  fieldContainer : {
    padding : spacing.s
  },
  textStyle : {
    fontWeight: '500',
    fontFamily: Fonts.bold,
    fontSize: moderateScale(18),

  },
  logout : {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"center",
   // position:"absolute",
   // top:hp(65),
   // left:moderateScale(20),
    marginTop: moderateScale(20),
    width:moderateScale(120),
    height:moderateScale(40),
    backgroundColor:colors.PRIMARY_BLUE,
    borderRadius:moderateScale(8)
  }
});
