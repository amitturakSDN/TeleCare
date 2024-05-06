import {useNavigation, useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, KeyboardAvoidingView, TouchableOpacity, Image, Platform} from 'react-native';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {tempPasswordReset, TYPES} from '@/actions/ForgotActions';
import {Button, ErrorView, TextField, AuthHeader, TextView, Loader} from '@/components';
import {strings} from '@/localization';
import {styles} from '@/screens/ForgotPassword/ForgotPassword.styles';
import {errorsSelector} from '@/selectors/ErrorSelectors';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {IMAGES} from '@/assets';
import {Validate} from '@/helpers';
import {showError} from '@/hooks/message';
import {moderateScale} from '@/hooks/scale';

export function ResetTempPassword({navigation, route}) {
    const {colors} = useTheme();

    const {email, type} = route.params;

    const dispatch = useDispatch();
    const [username, setUsername] = useState(email ? email : '');
    const [usernameError, setUsernameError] = useState(null);
    const errors = useSelector(state => errorsSelector([TYPES.TEMP], state), shallowEqual);
    const isLoading = useSelector(state => isLoadingSelector([TYPES.TEMP], state));

    const handleSubmit = () => {
        if (Validate.empty(username))
            return Validate.errorDisplay(strings.validation.empty, setUsernameError);
        else if (Validate.email(username))
            return Validate.errorDisplay(strings.validation.validEmail, setUsernameError);
        else {
            setUsernameError('');

            dispatch(tempPasswordReset(Validate.encryptInput(username.toLocaleLowerCase())));
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
                    title={strings.resetTemp.title}
                    viewStyle={styles.viewTitle}
                    textStyle={styles.title}
                />
                <View style={[styles.formContainer]}>
                    <TextField
                        autoCapitalize="none"
                        accessibilityHint={strings.login.usernameHint}
                        accessibilityLabel={strings.login.username}
                        onChangeText={setUsername}
                        placeholder={strings.resetTemp.placeholder}
                        value={username}
                        title={'Please click on the below button to recieve the link'}
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
