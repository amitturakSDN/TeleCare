import {Fragment, useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Calendar} from 'react-native-calendars';
// import { AntDesign } from "@expo/vector-icons";
// import { COLORS } from '../config';
import {useTheme} from '@react-navigation/native';
import moment from 'moment-timezone';
import {moderateScale} from '../utils/helper';
const INITIAL_DATE = moment().format('YYYY-MM-DD');

const theme = {
  'stylesheet.calendar.header': {
    header: {
      width: '102%',
      backgroundColor: 'green',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: moderateScale(5),
      borderTopLeftRadius: moderateScale(8),
      borderTopRightRadius: moderateScale(8),
      marginLeft: moderateScale(-5),
    },
    monthText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: moderateScale(19),
    },
    dayHeader: {
      marginTop: moderateScale(2),
      marginBottom: moderateScale(7),
      width: moderateScale(30),
      textAlign: 'center',
      fontSize: moderateScale(14),
      color: 'grey',
      fontWeight: 'bold',
    },
  },
};

export const Calendars = props => {
  const {colors} = useTheme();
  const [selected, setSelected] = useState(INITIAL_DATE);
  // const color = useTheme()
  useEffect(() => {
    setSelected(props.initialDate);
  }, [props.initialDate]);

  const onDayPress = day => {
    setSelected(day.dateString);
    return props.onSelectDate ? props.onSelectDate(day) : null;
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} testID={'calendars'}>
      <Fragment>
        <Calendar
          testID={'first_calendar'}
          enableSwipeMonths
          current={props.initialDate ?? INITIAL_DATE}
          style={styles.calendar}
          onDayPress={onDayPress}
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: COLORS.secondary,
              selectedTextColor: COLORS.white,
            },
          }}
          // renderArrow={(direction: "left" | "right") =>
          //   direction === "left" ? (
          //     <AntDesign name="left" size={17} color={COLORS.white} />
          //   ) : (
          //     <AntDesign name="right" size={17} color={COLORS.white} />
          //   )
          // }
          hideExtraDays={true}
          theme={theme}
        />
      </Fragment>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  calendar: {
    marginBottom: moderateScale(10),
  },
});
