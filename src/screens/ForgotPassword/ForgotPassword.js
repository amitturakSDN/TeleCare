import {TYPES, forgotPassword} from '@/actions/ForgotActions';
import {IMAGES} from '@/assets';
import {AuthHeader, Button, ErrorView, Loader, TextField, TextView} from '@/components';
import {Validate} from '@/helpers';
import {moderateScale} from '@/hooks/scale';
import {strings} from '@/localization';
import {styles} from '@/screens/ForgotPassword/ForgotPassword.styles';
import {errorsSelector} from '@/selectors/ErrorSelectors';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {useTheme} from '@react-navigation/native';
import {useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

export function ForgotPassword({navigation, route}) {
    const {colors} = useTheme();

    const dispatch = useDispatch();
    const [username, setUsername] = useState(__DEV__ ? 'priya7nov@yopmail.com' : '');
    const [usernameError, setUsernameError] = useState(null);
    const errors = useSelector(state => errorsSelector([TYPES.FORGOT], state), shallowEqual);
    const isLoading = useSelector(state => isLoadingSelector([TYPES.FORGOT], state));

    const handleSubmit = () => {
        if (Validate.empty(username))
            return Validate.errorDisplay(strings.validation.empty, setUsernameError);
        else if (Validate.email(username.trim()))
            return Validate.errorDisplay(strings.validation.validEmail, setUsernameError);
        else {
            setUsernameError('');
            dispatch(forgotPassword(Validate.encryptInput(username.trim().toLocaleLowerCase())));
        }
    };

    return (
        <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            style={styles.container}>
            <Loader isLoading={isLoading} />

            <AuthHeader />
            <TouchableOpacity
                onPress={() => navigation.pop()}
                style={{
                    width: moderateScale(60),
                    height: moderateScale(50),

                    position: 'absolute',
                    top: moderateScale(40),
                    left: moderateScale(20),
                }}>
                <Image
                    source={IMAGES.icons.common.backWhiteArrow}
                    imageStyle={styles.banner}
                    containerStyle={{padding: 10}}
                />
            </TouchableOpacity>
            <View style={styles.fieldContainer}>
                <TextView
                    title={strings.forgot.title}
                    viewStyle={styles.viewTitle}
                    textStyle={styles.title}
                />
                <View style={[styles.formContainer]}>
                    <TextField
                        autoCapitalize="none"
                        accessibilityHint={strings.login.usernameHint}
                        accessibilityLabel={strings.login.username}
                        onChangeText={setUsername}
                        placeholder={strings.forgot.placeholder}
                        value={username}
                        title={'Please enter the email address associated with you account.'}
                        //  title={'Email'}
                        icon={IMAGES.icons.mail}
                    />
                    <ErrorView message={usernameError} />

                    <Button
                        onPress={handleSubmit}
                        style={styles.submitButton}
                        title={isLoading ? strings.common.loading : strings.buttons.send}
                    />
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}
