import { moderateScale } from '@/hooks/scale';
import { StyleSheet } from 'react-native';

/*
 * generated with https://ethercreative.github.io/react-native-shadow-generator/
 * to get the same shadow on both platforms
 */
export const shadow = StyleSheet.create({
  primary: {
    elevation: moderateScale(3),
    shadowColor: 'rgba(0, 0, 0, 0.14)',
    shadowRadius: moderateScale(10),
    shadowOpacity: 0.27,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  }
   
});
