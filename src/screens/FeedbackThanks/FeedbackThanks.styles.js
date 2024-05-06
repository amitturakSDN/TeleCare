import {hp, wp, moderateScale, scale, verticalScale} from '@/hooks/scale';
import {StyleSheet, Dimensions} from 'react-native';
import {typography, colors} from '@/theme';
import {Fonts} from '@/assets';

export const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  title: {
    fontSize: moderateScale(25),
    color: colors.BLACK,
    fontFamily: Fonts.bold,
    paddingLeft:moderateScale(20)
  },
feedbackView: {
  width: '100%',
  // height: moderateScale(75),
  borderRadius: moderateScale(10),
  borderWidth: 1,
  borderColor: 'rgba(0, 0, 0, 0.14)',
  marginVertical: moderateScale(10),
  padding:moderateScale(10)
},
  mainView:{
marginTop:'50%',
marginLeft:'40%'
  },
  feedbackque:{
    fontWeight: '600',
    fontSize: moderateScale(20),
    fontFamily: Fonts.regular,
    color:colors.DARK_BLUE,
  },
  starView:{
    flexDirection:'row',
   justifyContent:'space-between',
   marginTop:moderateScale(8)
  },
  inputsubmitView:{
    marginHorizontal:moderateScale(16),
  },
  btnView:{
    marginHorizontal:moderateScale(16),
    marginTop:'53%',
  },
  btn:{
      // marginVertical: moderateScale(15),
      // marginBottom: moderateScale(30),
  },
  btnText2: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.bold,
  },
  thanksTextView:{
      // marginHorizontal: moderateScale(45),
    alignItems:'center'
  }
});
