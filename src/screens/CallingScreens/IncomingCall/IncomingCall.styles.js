import {hp, wp, moderateScale, scale, verticalScale} from '@/hooks/scale';
import { colors } from '@/theme';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0083C0'
  },
  name: {
    fontSize: wp(6.9),
    color: '#fff',
    fontWeight: '700',
    marginTop: moderateScale(120),
    marginBottom: moderateScale(10),
  },
  time: {
    fontSize: wp(4.5),
    color: '#fff',
    fontWeight: '400',
  },
});
