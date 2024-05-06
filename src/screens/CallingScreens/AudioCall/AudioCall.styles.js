import {hp, wp, moderateScale, scale, verticalScale} from '@/hooks/scale';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  back: {
    position: 'absolute',
    top: moderateScale(20),
    left:  moderateScale(20),
    zIndex: 10,
    width: moderateScale(30),
    height: moderateScale(30),
  },
  userImage:{
    alignItems: 'center',
    marginTop:moderateScale(150)

  },
  name: {
    fontSize: wp(6.9),
    color: '#000000',
    fontWeight: '700',
     marginTop:moderateScale(20)
  },
  time: {
    fontSize: wp(4.5),
    color: '#565656',
    fontWeight: '400',
    marginTop:moderateScale(10)
  },
  audioBtnContainer: {
    position:'absolute',
    top:moderateScale(430),
    backgroundColor: 'white',
    height: '10%',
    flexDirection: 'row',
    paddingHorizontal: moderateScale(100),
    justifyContent: 'space-between',
  },
});
