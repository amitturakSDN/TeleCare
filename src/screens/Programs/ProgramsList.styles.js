import { StyleSheet } from "react-native";
import { deviceHeight, moderateScale } from "@/hooks/scale";
import { Fonts } from "@/assets";
import { colors } from '@/theme';

export const styles = StyleSheet.create({
    container: { flex: 1 },
    listContainer: { flex: 1, marginTop: moderateScale(10), paddingHorizontal: moderateScale(20) },
    contentContainer: { marginVertical: moderateScale(10), width: '100%' },
    msgContainer: { flexDirection: 'row', width: '100%' },
    msgTxt: {
        textAlign: 'justify',
        fontFamily: Fonts.semibold,
        fontSize: moderateScale(15),
    },
    timeTxt: { textAlign: 'justify', fontFamily: Fonts.medium, fontSize: moderateScale(12), },
    timeContainer: { marginVertical: moderateScale(10) },
    btnContainer: {
        flexDirection: 'row',
        paddingVertical: moderateScale(10),
    },
    acceptContainer: {
        paddingHorizontal: moderateScale(10),
        height: moderateScale(40),
        width: moderateScale(100),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.TEXT_GREEN,
        borderRadius: moderateScale(50),
    },
    acceptTxt: {
        fontFamily: Fonts.semibold,
        fontSize: moderateScale(16),
    },
    rejectBtnContainer: {
        paddingHorizontal: moderateScale(10),
        height: moderateScale(40),
        marginLeft: moderateScale(10),
        width: moderateScale(100),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.ERROR_RED,
        borderRadius: moderateScale(50),
    },
    separator: {
        borderWidth: 0.5,
        width: '100%',
        borderColor: 'rgba(0, 0, 0, 0.14)',
    },
    empty: { height: deviceHeight - 120, justifyContent: 'center', alignItems: 'center' }
})