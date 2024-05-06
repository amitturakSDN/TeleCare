import {StyleSheet} from 'react-native';
import {spacing} from '@/theme';
import {deviceWidth, moderateScale} from '@/hooks/scale';
import {Fonts} from '@/assets';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    borderRadius: 5,
    // padding: spacing.s,
    width: '100%',
    paddingBottom: spacing.l,
  },
  submitButton: {
    marginTop: spacing.s,
    borderRadius: 10,
  },
  viewTitle: {
    width: deviceWidth,
  },
  title: {
    fontSize: moderateScale(35),
    fontWeight: '700',
    fontFamily: Fonts.bold,
  },
  fieldContainer: {
    padding: spacing.s,
  },
  forgot:{
    fontSize : moderateScale(18),
    fontWeight : '400',
    fontFamily:Fonts.medium
  }
});
