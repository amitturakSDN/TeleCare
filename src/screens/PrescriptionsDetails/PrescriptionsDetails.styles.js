import { Dimensions, StyleSheet } from 'react-native';
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
    marginHorizontal: moderateScale(14),
    paddingVertical: moderateScale(18),
    paddingHorizontal: moderateScale(18),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 7,
    elevation: 7,
  },
  detailsView: {
    flexDirection: 'row',
    width: '100%',
    marginBottom:moderateScale(2)
  },
  instructionTxtView: {
    textAlign:'left'
  },
  detailsViewName: {
    paddingRight: moderateScale(20),
    width: '50%',
    justifyContent: 'center',
  },
  detailsViewValue: {
    width: '50%',
    justifyContent: 'center',
  },
  instructionKeyName: {
    fontFamily: Fonts.medium,
    fontSize: moderateScale(14),
    fontStyle: 'italic',
    fontWeight: '400',
    lineHeight: moderateScale(20),
    color:'rgba(0, 0, 0, 0.47)',
    textAlign:'left'
  },
  keyName: {
    fontFamily: Fonts.medium,
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: moderateScale(20),
    marginBottom: moderateScale(5),
   
  },
  value: {
    textAlign:'right',
    fontFamily: Fonts.medium,
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: moderateScale(20),
    marginBottom: moderateScale(5),
    flexWrap: 'wrap',
  },
  pdf: {
    flex:1,
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
},
pdfView:{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
}
});
