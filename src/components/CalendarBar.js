import {logout} from '@/actions/UserActions';
import {Fonts, IMAGES} from '@/assets';
import {Image, TextView} from '@/components';
import {deviceWidth, moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {colors} from '@/theme';
import moment from 'moment-timezone';
import CalendarStrip from 'react-native-calendar-strip';
import {Platform, StyleSheet, useColorScheme, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {useEffect, useState} from 'react';
export function CalendarBar(props) {
    let {onDateSelected} = props;
    const isDarkMode = useColorScheme() === 'dark';
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

    return (
        <CalendarStrip
            scrollable
            calendarAnimation={styles.calendarAnimation}
            daySelectionAnimation={styles.daySelectionAnimation}
            style={{
                height: moderateScale(100),
                backgroundColor: isDarkMode ? 'white' : 'white',
            }}
            calendarHeaderStyle={{
                color: isDarkMode ? colors.BLACK : colors.BLACK,
                fontSize: moderateScale(18),
                alignSelf: 'flex-start',
                fontFamily: Fonts.regular,
                fontWeight: '500',
            }}
            calendarColor={styles.calendarColor}
            dayContainerStyle={styles.dayContainerStyle}
            dateNumberStyle={{
                color: isDarkMode ? colors.BLACK : colors.BLACK,
                fontSize: moderateScale(14),
            }}
            dateNameStyle={{
                color: isDarkMode ? colors.BLACK : colors.BLACK,
                fontSize: moderateScale(14),
            }}
            highlightDateNameStyle={styles.highlightDateNameStye}
            highlightDateNumberStyle={styles.highlightDateNumberStyle}
            selectedDate={selectedDate}
            onDateSelected={date => onDateSelected(date)}
            highlightDateContainerStyle={styles.highlightDateContainerStyle}
            iconContainer={{flex: 0.08}}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    daySelectionAnimation: {
        type: 'background',
        duration: 300,
        highlightColor: colors.PURPLE,
    },
    calendarAnimation: {
        type: 'sequence',
        duration: 30,
    },
    calendarColor: {
        color: colors.WHITE,
    },
    dayContainerStyle: {
        height: moderateScale(40),
        justifyContent: 'center',
    },
    highlightDateNameStye: {
        color: colors.WHITE,
        fontSize: moderateScale(12),
    },
    highlightDateNumberStyle: {
        color: colors.WHITE,
        fontSize: moderateScale(14),
    },
    highlightDateContainerStyle: {
        backgroundColor: colors.PRIMARY_BLUE,
        borderRadius: moderateScale(8),
        height: moderateScale(40),
        justifyContent: 'center',
    },
});
