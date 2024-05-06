import {Fonts} from '@/assets';
import {Image, TextView} from '@/components';
import {moderateScale} from '@/hooks/scale';
import {spacing} from '@/theme';
import {useTheme} from '@react-navigation/native';
import PropTypes from 'prop-types';
import {useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

const styles = StyleSheet.create({
    container: {
        height: moderateScale(50),
        width: '100%',
        borderRadius: moderateScale(10),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6F6F6',
    },
    input: {
        padding: spacing.xs,
        fontFamily: Fonts.medium,
        fontSize: moderateScale(16),
    },
    label: {
        marginTop: moderateScale(15),
        marginBottom: moderateScale(8),
    },
    imgContainer: {
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center',
        borderEndWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(0, 0, 0, 0.34)',
    },
    title: {
        fontSize: moderateScale(18),
        fontWeight: '400',
        fontFamily: Fonts.medium,
    },
});

export function TextField({
    onBlur,
    onFocus,
    onSubmitEditing,
    returnKeyType,
    returnKeyLabel,
    placeholder,
    value,
    title,
    icon,
    leftIcon,
    onLeftPress,
    ...rest
}) {
    const animation = useSharedValue(0);
    const {colors} = useTheme();
    const [labelWidth, setLabelWidth] = useState(0);

    const handleFocus = () => {
        if (!value) {
            animation.value = withTiming(1);
        }

        onFocus?.();
    };

    const handleBlur = () => {
        if (!value) {
            animation.value = withTiming(0);
        }

        onBlur?.();
    };

    const measureLabelWidth = ({nativeEvent}) => {
        setLabelWidth(nativeEvent.layout.width);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: 1 - animation.value * 0.25,
        transform: [
            {scale: 1 - animation.value * 0.3},
            {translateX: animation.value * (-spacing.s - labelWidth * 0.15)},
            {translateY: (1 - animation.value) * spacing.m},
        ],
    }));

    let width = '95%';
    if (icon && leftIcon) width = '75%';
    else if (icon || leftIcon) width = '85%';

    return (
        <>
            <TextView
                title={title}
                viewStyle={styles.label}
                textStyle={[styles.title, {color: colors.primary}]}
            />
            <View style={styles.container}>
                {/* <Animated.Text onLayout={measureLabelWidth} style={[styles.label, animatedStyle]}>
        {placeholder}
      </Animated.Text> */}

                {icon && (
                    <View style={styles.imgContainer}>
                        <Image source={icon} />
                    </View>
                )}
                <View style={{width}}>
                    <TextInput
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        onSubmitEditing={onSubmitEditing}
                        style={[styles.input, {color: colors.primary}]}
                        placeholderTextColor={colors.txt_placeholder}
                        value={value}
                        returnKeyLabel={returnKeyLabel}
                        returnKeyType={returnKeyType}
                        placeholder={placeholder}
                        {...rest}
                    />
                </View>
                {leftIcon && (
                    <TouchableOpacity
                        style={[styles.imgContainer, {borderEndWidth: 0}]}
                        onPress={onLeftPress}>
                        <Image source={leftIcon} />
                    </TouchableOpacity>
                )}
            </View>
        </>
    );
}

TextField.propTypes = {
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string,
};
