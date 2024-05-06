import {Fonts} from '@/assets';
import {TextView} from '@/components';
import {moderateScale, wp} from '@/hooks/scale';
import {spacing, typography} from '@/theme';
import {useTheme} from '@react-navigation/native';
import PropTypes from 'prop-types';
import {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Input} from 'react-native-elements';
import {useSharedValue, withTiming} from 'react-native-reanimated';
export function TextField1({
    onBlur,
    onFocus,
    placeholder,
    maxLength,
    keyboardType,
    value,
    title,
    textStyle,
    scaleStyle,
    scaleName,
    scale = false,
    ...rest
}) {
    const animation = useSharedValue(0);
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
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

    return (
        <View>
            <TextView title={title} textStyle={[styles.label, textStyle]} />

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Input
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    inputContainerStyle={{
                        borderBottomWidth: 0.5,
                    }}
                    containerStyle={styles.input}
                    maxLength={maxLength}
                    value={value}
                    keyboardType={keyboardType}
                    placeholder={placeholder}
                    inputStyle={[
                        typography.xlText,
                        {
                            marginTop: Platform.OS === 'ios' ? moderateScale(5) : moderateScale(8),
                            paddingLeft: moderateScale(7),
                        },
                    ]}
                    {...rest}
                />
                {scale ? (
                    <TextView title={scaleName} textStyle={[styles.scale, scaleStyle]} />
                ) : null}
            </View>
        </View>
    );
}

TextField1.propTypes = {
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string,
};

const createStyles = theme =>
    StyleSheet.create({
        label: {
            fontSize: moderateScale(16),
            color: theme.colors.sText,
            fontFamily: Fonts.medium,
            fontWeight: '400',
            marginBottom: moderateScale(5),
        },
        input: {
            height: moderateScale(72),
            width: moderateScale(80),
            alignItems: 'center',

            padding: spacing.xs,

            borderRadius: 10,
            backgroundColor: theme.colors.inputBG,
        },
        scale: {
            fontSize: wp(4.9),
            fontWeight: '400',
            fontFamily: Fonts.semibold,
            color: '#969696',
            marginLeft: moderateScale(10),
        },
    });
