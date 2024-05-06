import {moderateScale} from '@/hooks/scale';
import moment from 'moment-timezone';
import {Platform, StyleSheet, Text, View} from 'react-native';
// import { colors, FONT1REGULAR } from '../config';
// import i18n from "../utils/i18n";
const INITIAL_DATE = moment().format('YYYY-MM-DD');

export const CalendarCard = props => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemDay}>
        {moment(
          props.date ?? INITIAL_DATE
            ? moment(props.date ?? INITIAL_DATE)
            : moment(props.date ?? INITIAL_DATE, 'YYYY-MM-DD'),
        ).format('DD')}
      </Text>
      <View style={styles.dateInfo}>
        <Text style={styles.iteDayMonth}>
          {moment(
            props.date ?? INITIAL_DATE
              ? moment(props.date ?? INITIAL_DATE)
              : moment(props.date ?? INITIAL_DATE, 'YYYY-MM-DD'),
          ).format('dddd')}
        </Text>
        <View style={styles.row}>
          <Text style={styles.iteDayMonth}>
            {moment(
              props.date ?? INITIAL_DATE
                ? moment(props.date ?? INITIAL_DATE)
                : moment(props.date ?? INITIAL_DATE, 'YYYY-MM-DD'),
            ).format('MMMM')}
          </Text>
          <Text style={[styles.iteDayMonth, {marginLeft: 5}]}>
            {moment(
              props.date ?? INITIAL_DATE
                ? moment(props.date ?? INITIAL_DATE)
                : moment(props.date ?? INITIAL_DATE, 'YYYY-MM-DD'),
            ).format('yyyy')}
          </Text>
        </View>
      </View>
      {props.date != INITIAL_DATE && (
        <TouchableOpacity
          style={styles.todayContainer}
          onPress={props.selectToday}>
          <Text style={styles.todayTxt}>{i18n.t('Today')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: moderateScale(65),
    padding: moderateScale(15),
    paddingHorizontal: moderateScale(20),
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: moderateScale(5),
    backgroundColor: colors.white,
    width: '96%',
    overflow: 'visible',
    borderRadius: moderateScale(6),
    shadowColor: Platform.OS === 'ios' ? colors.shadow : 'rgba(0, 0, 0, 0.8)',
    shadowOffset: {
      width: 0,
      height: moderateScale(4),
    },
    shadowOpacity: 0.7,
    shadowRadius: moderateScale(6),
    elevation: moderateScale(5),
    marginVertical: moderateScale(10),
  },
  itemDay: {
    fontSize: moderateScale(32),
    marginRight: 20,
    // fontFamily: FONT1REGULAR,
    color: colors.secondary,
  },
  iteDayMonth: {
    // fontFamily: FONT1REGULAR,
    fontSize: moderateScale(16),
    color: colors.blue,
  },
  dateInfo: {
    fontSize: moderateScale(12),
    marginLeft: moderateScale(-40),
  },
  row: {
    flexDirection: 'row',
  },
  todayContainer: {
    height: moderateScale(30),
    width: moderateScale(90),
    backgroundColor: 'rgba(0, 204, 203, 0.15)',
    borderRadius: moderateScale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayTxt: {fontSize: moderateScale(16), color: colors.secondary},
});
