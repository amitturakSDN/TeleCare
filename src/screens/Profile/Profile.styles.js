import {StyleSheet} from 'react-native';
import {moderateScale} from '@/hooks/scale';
import {Fonts} from '@/assets';
import {colors} from '@/theme';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    label: {
        marginTop: moderateScale(15),
        marginBottom: moderateScale(8),
    },
    input: {
        fontSize: moderateScale(16),
        color: colors.DARK_BLUE,
        fontFamily: Fonts.medium,
    },
    title: {
        fontSize: moderateScale(18),
        fontWeight: '400',
        fontFamily: Fonts.medium,
    },
    imageContainer: {
        height: moderateScale(100),
        width: moderateScale(100),
        backgroundColor: '#D9D9D9',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: moderateScale(50),
        overflow: 'hidden',
    },
    dropdown: {
        height: moderateScale(50),
        backgroundColor: '#F6F6F6',
        borderRadius: moderateScale(10),
        padding: 12,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fieldContainer: {
        marginBottom: moderateScale(100),
        paddingHorizontal: moderateScale(20),
    },
    profileImage: {
        height: moderateScale(100),
        width: moderateScale(100),
    },
    genderTitle: {
        fontSize: moderateScale(18),
        fontWeight: '400',
        fontFamily: Fonts.medium,
    },
    genderTitleContainer: {
        marginTop: moderateScale(15),
        marginBottom: moderateScale(10),
    },
    genderTitleContainer: {marginTop: moderateScale(15), marginBottom: moderateScale(10)},
    phone: {
        height: moderateScale(50),
        width: '100%',
        borderRadius: moderateScale(10),
        paddingLeft: moderateScale(15),
        flexDirection: 'row',
        //  justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6F6F6',
    },
});
