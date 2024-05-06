import {StyleSheet} from 'react-native';
import {moderateScale} from '@/hooks/scale';
import {Fonts} from '@/assets';
import {colors} from '@/theme';
export const styles = StyleSheet.create({
    btn: {
        marginVertical: moderateScale(10),
        marginBottom: moderateScale(20),
        paddingHorizontal: moderateScale(10),
    },
    btnText2: {
        fontSize: moderateScale(18),
        fontFamily: Fonts.bold,
    },
    container: {
        flex: 1,
    },
    inner_container: {
        // flex: 1,
        paddingHorizontal: moderateScale(10),
        justifyContent: 'space-between',
    },
    questionContainerBox: {
        height: moderateScale(90),
    },
    questionBox: {
        height: moderateScale(90),
    },
    questionTitle: {
        fontSize: moderateScale(16),
        fontFamily: Fonts.medium,
        color: colors.BLACK,
    },
    dropdown: {
        height: moderateScale(50),
        backgroundColor: '#F6F6F6',
        borderRadius: moderateScale(10),
        padding: 12,
        marginTop: moderateScale(5),
    },
    input: {
        fontSize: moderateScale(16),
        fontFamily: Fonts.medium,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        marginTop: moderateScale(28),
        marginBottom: moderateScale(10),
    },
    title: {
        fontSize: moderateScale(16),
        fontFamily: Fonts.medium,
    },
    iconView: {
        marginBottom: moderateScale(3),
    },
    line: {
        marginBottom: moderateScale(15),
        backgroundColor: 'rgba(142, 142, 142, 0.46)',
        width: '100%',
        height: 0.5,
    },
    optionStyle: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.medium,
        paddingLeft: moderateScale(10),
    },
    checkBoxContainer: {flexDirection: 'row', paddingBottom: moderateScale(5)},
    customView: {
        marginTop: moderateScale(28),
    },
});
