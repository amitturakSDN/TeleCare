import {StyleSheet} from 'react-native';
import {deviceHeight, deviceWidth, moderateScale} from '@/hooks/scale';
import {Fonts} from '@/assets';
import {fonts} from 'react-native-elements/dist/config';
export const styles = StyleSheet.create({
  vitalContainer: {flexDirection: 'row', marginVertical: moderateScale(20)},
  titleContainerActive: {
    marginHorizontal: moderateScale(10),
    borderBottomWidth: 3,
    borderColor: '#005DA8',
  },
  titleText: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.regular,
    fontWeight: '600',
  },
  titleContainerInactive: {
    marginHorizontal: moderateScale(10),
  },
  menuContainer: {
    width: '100%',
    height: moderateScale(75),
    borderRadius: moderateScale(10),
    flexDirection: 'row',
    marginVertical: moderateScale(10),
  },
  titleContainer: {
    width: '56%',
    justifyContent: 'center',
    height: '100%',
    marginVertical: moderateScale(0),
  },
  listContainer: {
    marginBottom: moderateScale(20),
  },
  noResultStyle: {
    fontSize: moderateScale(20),
    marginVertical: moderateScale(10),
    fontFamily: Fonts.medium,
  },
  calendarCustomHeaderStyle: {
    color: 'black',
    fontSize: moderateScale(18),
    fontFamily: Fonts.bold,
    alignSelf: 'flex-start',
  },
});
