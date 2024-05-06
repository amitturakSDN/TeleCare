import { StyleSheet } from 'react-native';
import { moderateScale } from '@/hooks/scale';
import { Fonts } from '@/assets';
import { colors, theme } from '@/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listingView: {
    flexDirection: 'column',
    backgroundColor: theme.light.colors.app,
    borderRadius: 10,
    marginTop: moderateScale(14),
    marginBottom:moderateScale(5),
    marginHorizontal: moderateScale(14),
    paddingVertical: moderateScale(18),
    paddingHorizontal: moderateScale(18),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 7,
    elevation: 7,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(7),
    overflow: 'hidden',
    flexWrap: 'wrap',
  },
  keyName: {
    textAlign: 'justify',
    fontFamily: Fonts.medium,
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: moderateScale(18),
  },
  value: {
    textAlign: 'justify',
    fontFamily: Fonts.medium,
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: moderateScale(18),
  },
  line: {
    marginVertical: moderateScale(9),
    backgroundColor: 'rgba(142, 142, 142, 0.46)',
    width: '100%',
    height: 1
  },
  eyeIconView: {
    alignItems: 'flex-end'
  },
  noResultStyle: {
    fontSize: moderateScale(20),
    marginVertical: moderateScale(10),
    fontFamily: Fonts.medium,
  },
});
