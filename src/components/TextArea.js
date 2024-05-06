import {useTheme} from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {spacing} from '@/theme';
import {moderateScale} from '@/hooks/scale';
import {Image, TextView} from '@/components';
import {Fonts, IMAGES} from '@/assets';
const styles = StyleSheet.create({
    container: {
        height: moderateScale(200),
        width: '100%',
        borderRadius: moderateScale(10),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6F6F6',
    },
    input: {
        padding: spacing.xs,
        height: moderateScale(200),
        textAlignVertical: 'top',
        fontFamily: Fonts.medium,
        paddingTop: moderateScale(10),
        fontSize: moderateScale(16),
    },
    label: {
        marginTop: moderateScale(34),
        marginBottom: moderateScale(10),
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
        fontFamily: Fonts.medium,
    },
});

export function TextArea({
    onBlur,
    onFocus,
    placeholder,
    value,
    title,
    icon,
    customViewStyle = {},
    customInputStyle = {},
    customContainer = {},
    customTitleStyle = {},
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

    return (
        <>
            <TextView
                title={title}
                viewStyle={[styles.label, customViewStyle]}
                textStyle={[styles.title, {color: colors.primary}, customTitleStyle]}
            />
            <View style={[styles.container, customContainer]}>
                {/* <Animated.Text onLayout={measureLabelWidth} style={[styles.label, animatedStyle]}>
        {placeholder}
      </Animated.Text> */}

                {icon && (
                    <View style={styles.imgContainer}>
                        <Image source={icon} />
                    </View>
                )}
                <View style={{width: icon ? '85%' : '95%'}}>
                    <TextInput
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        style={[styles.input, customInputStyle]}
                        value={value}
                        placeholder={placeholder}
                        {...rest}
                    />
                </View>
            </View>
        </>
    );
}

TextArea.propTypes = {
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string,
};
