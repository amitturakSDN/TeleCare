import {Fonts} from '@/assets';
import {moderateScale} from '@/hooks/scale';
import {useTheme} from '@react-navigation/native';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        // borderRadius: moderateScale(10),
        width: '100%',

        height: moderateScale(18),
    },
    gradient: {
        width: '100%',
        height: '100%',
        borderRadius: moderateScale(50),
        justifyContent: 'center',
        alignItems: 'center',
        height: moderateScale(50),
    },
    buttonText: {
        fontWeight: '700',
        color: '#fff',
        fontSize: moderateScale(18),
        fontFamily: Fonts.medium,
    },
});

export function Button({style, textStyle, title, ...rest}) {
    const {colors} = useTheme();
    return (
        <TouchableOpacity style={[styles.button, {borderColor: colors.border}, style]} {...rest}>
            <LinearGradient
                colors={['#0083C0', '#005DA8']}
                style={[styles.gradient, style]}
                useAngle={true}
                angle={90}>
                <Text style={[styles.buttonText, textStyle]}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

Button.propTypes = {
    style: PropTypes.object,
    textStyle: PropTypes.object,
    title: PropTypes.string.isRequired,
};

Button.defaultProps = {
    // style: null,
    textStyle: null,
};
