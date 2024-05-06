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
    fontFamily: Fonts.semibold,
    // paddingLeft:moderateScale(20)
  },
  textMessage: {
    fontSize: moderateScale(18),
    color: colors.BLACK,
    fontFamily: Fonts.regular,
    textAlign:'center',
    color: 'rgba(0, 0, 0, 0.37)',
    fontWeight:'400',
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
  marginTop:'40%',
  alignItems:'center'
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
    marginTop:'20%',
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
    alignItems:'center',
    marginVertical:moderateScale(20)
  },
  textMessageView:{
      // marginHorizontal: moderateScale(45),
    alignItems:'center',
    marginHorizontal:moderateScale(2)
  }
});
