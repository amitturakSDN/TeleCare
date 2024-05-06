import {AuthHeader, Button, TextView} from '@/components';
import {NAVIGATION} from '@/constants';
import {strings} from '@/localization';
import {styles} from '@/screens/ForgotPasswordSuccess/ForgotPasswordSuccess.styles';
import {useTheme} from '@react-navigation/native';
import {KeyboardAvoidingView, Platform, View, useColorScheme, ScrollView} from 'react-native';

export function ForgotPasswordSuccess({navigation}) {
    const {colors} = useTheme();
    const isDarkMode = useColorScheme() === 'dark';
    const handleSubmit = () => {
        navigation.navigate(NAVIGATION.login);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
            style={[styles.container, {backgroundColor: colors.background}]}>
            <ScrollView>
                <AuthHeader />
                <View style={styles.fieldContainer}>
                    <TextView
                        title={strings.forgotPasswordSuccess.title}
                        viewStyle={styles.viewTitle}
                        textStyle={styles.title}
                        color={isDarkMode ? '#fff' : '#000'}
                    />
                    <View style={[styles.formContainer]}>
                        <TextView
                            title={strings.forgotPasswordSuccess.subtitle}
                            viewStyle={styles.subtitleView}
                            textStyle={styles.subtitle}
                            color={isDarkMode ? '#fff' : '#000'}
                        />

                        <Button
                            onPress={handleSubmit}
                            style={styles.submitButton}
                            title={strings.buttons.backLogin}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
