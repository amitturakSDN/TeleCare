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
    marginBottom: moderateScale(10),
    marginHorizontal: moderateScale(3),
    paddingVertical: moderateScale(15),
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
    width:'100%',
  },
  // keyName: {
  //   textAlign: 'justify',
  //   fontFamily: Fonts.medium,
  //   fontSize: moderateScale(16),
  //   fontStyle: 'normal',
  //   fontWeight: '500',
  //   lineHeight: moderateScale(18),
  // },
  keyName: {
    fontFamily: Fonts.medium,
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: moderateScale(18),
    maxWidth: '100%', // Set a maximum width (adjust as needed)
    flexWrap: 'wrap' // Allow text to wrap to the next line if it's too long
  },
  
  value: {
    textAlign: 'justify',
    fontFamily: Fonts.medium,
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: moderateScale(18)
  },
  line: {
    marginBottom: moderateScale(10),
    backgroundColor: 'rgba(142, 142, 142, 0.46)',
    width: '100%',
    height: 1
  },
  eyeIconView: {
    alignItems: 'flex-end'
  },


  // form 
  encounterId: {
    textAlign: 'justify',
    fontFamily: Fonts.medium,
    fontSize: moderateScale(15),
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: moderateScale(16)
  },
  encounterValue: {
    textAlign: 'justify',
    fontFamily: Fonts.medium,
    fontSize: moderateScale(15),
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: moderateScale(16)
  },
  detailsKey: {
    textAlign: 'justify',
    fontFamily: Fonts.bold,
    fontSize: moderateScale(15),
    fontStyle: 'normal',
    // fontWeight: '500',
    lineHeight: moderateScale(18)
  },
  detailsValue: {
    textAlign: 'justify',
    fontFamily: Fonts.medium,
    fontSize: moderateScale(15),
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: moderateScale(18),
  },
  formView: {
    marginHorizontal: moderateScale(20),
    marginTop: moderateScale(14),
    marginBottom: moderateScale(24),
  },
  subViewcounter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  subView: {

    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: moderateScale(10),
    marginVertical: moderateScale(5),
  },
  subHeading: {
    textAlign: 'justify',
    fontFamily: Fonts.bold,
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: 'bold',
    lineHeight: moderateScale(19),
    marginTop: moderateScale(12),
    marginBottom: moderateScale(14)

  },
  card: {
    flexDirection: 'column',
    backgroundColor: theme.light.colors.app,
    borderRadius: 10,
    marginBottom: moderateScale(8),
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 7,
    elevation: 7,
  },
  testingTxt: {
    textAlign: 'center',
    fontFamily: Fonts.bold,
    fontSize: moderateScale(18),
    fontStyle: 'normal',
    fontWeight: 'bold',
    // lineHeight: moderateScale(19),
  },
  headingBackground: {
    flexDirection: 'column',
    backgroundColor: theme.light.colors.secondary,
    // borderRadius: 10,
    marginVertical: moderateScale(12),
    paddingVertical: moderateScale(4),
    paddingHorizontal: moderateScale(6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 7,
    elevation: 7,
  },
  listHeading: {
    textAlign: 'justify',
    fontFamily: Fonts.bold,
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: 'bold',
    lineHeight: moderateScale(17),
    marginBottom: moderateScale(13),

  },
  iconView: {
    marginBottom: moderateScale(3)
  },
  signatureView: {
    marginTop: moderateScale(10),
    marginHorizontal: moderateScale(20),
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  signature: {
    width: '60%'
  },
  date: {
    width: '30%',
  },
  sign: {
    textAlign: 'center',
    fontFamily: Fonts.medium,
    fontSize: moderateScale(15),
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: moderateScale(18),
    marginBottom: moderateScale(10)
  },
  dateTxt: {
    textAlign: 'center',
    fontFamily: Fonts.medium,
    fontSize: moderateScale(15),
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: moderateScale(18),
    marginBottom: moderateScale(10)
  },
  subSignatureView: {
    marginHorizontal: moderateScale(20),
    flexDirection: 'row',
    justifyContent: 'space-around',

  },
  signName: {
    textAlign: 'center',
    fontFamily: Fonts.medium,
    fontSize: moderateScale(15),
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: moderateScale(18),

  },
  designationTxtView: {
    marginVertical: moderateScale(7)
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
