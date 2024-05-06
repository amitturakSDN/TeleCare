import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, KeyboardAvoidingView, Platform, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {login, TYPES} from '@/actions/UserActions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, TextField, AuthHeader, TextView, Loader, ErrorView} from '@/components';
import {strings} from '@/localization';
import {styles} from '@/screens/Login/Login.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {IMAGES} from '@/assets';
import {moderateScale} from '@/hooks/scale';
import {NAVIGATION} from '@/constants';
import {Validate} from '@/helpers';
import {useIsFocused} from '@react-navigation/native';

export function Login({navigation}) {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const [username, setUsername] = useState(__DEV__ ? 'abhipatient@yopmail.com' : '');
    const [password, setPassword] = useState(__DEV__ ? 'Testing#123' : '');
    const [showPass, setShowPass] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    const isLoading = useSelector(state => isLoadingSelector([TYPES.LOGIN], state));
    /**Set prefilled test credentials */
    useEffect(() => {
        if (!isFocused) {
            setUsername(__DEV__ ? 'ipad.tdemo123@yopmail.com' : '');
            setPassword(__DEV__ ? 'Testing@123' : '');
            setLoginError(null);
            setPasswordError(null);
        }
    }, [isFocused]);

    /**Handle login button submission validation */
    const handleSubmit = () => {
        if (Validate.empty(username))
            return Validate.errorDisplay(strings.validation.empty, setLoginError);
        else if (Validate.empty(password)) {
            setLoginError(null);
            return Validate.errorDisplay(strings.validation.emptyPass, setPasswordError);
        } else if (Validate.password(password)) {
            setLoginError(null);
            return Validate.errorDisplay(strings.validation.invalidPass, setPasswordError);
        } else {
            setLoginError(null);
            setPasswordError(null);
            let request = {
                username: username.trim().toLocaleLowerCase(),
                password,
            };
            dispatch(login(Validate.encryptInput(request)));
        }
    };
    return (
        <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            style={styles.container}>
            <AuthHeader />
            <Loader isLoading={isLoading} />
            <View style={styles.fieldContainer}>
                <TextView
                    title={strings.login.button}
                    viewStyle={styles.viewTitle}
                    textStyle={styles.title}
                />
                <View style={[styles.formContainer]}>
                    <TextField
                        autoCapitalize="none"
                        accessibilityHint={strings.login.usernameHint}
                        accessibilityLabel={strings.login.username}
                        onChangeText={setUsername}
                        placeholder={strings.login.username}
                        value={username}
                        title={strings.login.usernameTitle}
                        icon={IMAGES.icons.username}
                    />
                    <ErrorView message={loginError} />
                    <TextField
                        autoCapitalize="none"
                        accessibilityHint={strings.login.usernameHint}
                        accessibilityLabel={strings.login.username}
                        onChangeText={setPassword}
                        placeholder={strings.login.password}
                        value={password}
                        title={strings.login.passwordTitle}
                        icon={IMAGES.icons.password}
                        secureTextEntry={!showPass}
                        leftIcon={showPass ? IMAGES.icons.hidePass : IMAGES.icons.showPass}
                        onLeftPress={() => setShowPass(!showPass)}
                        returnKeyType={'done'}
                        onSubmitEditing={handleSubmit}
                    />
                    <ErrorView message={passwordError} />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate(NAVIGATION.forgotPassword)}>
                            <TextView
                                title={strings.login.forgotPassword}
                                viewStyle={{marginVertical: moderateScale(15)}}
                                textStyle={styles.forgot}
                                color={'#0055AA'}
                            />
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => alert('Privacy Policy')}>
              <TextView
                title={strings.login.privacyPolicy}
                viewStyle={{marginVertical: moderateScale(15)}}
                textStyle={styles.forgot}
                color={'#0055AA'}
              />
            </TouchableOpacity> */}
                    </View>
                    <Button
                        onPress={handleSubmit}
                        style={styles.submitButton}
                        title={isLoading ? strings.common.loading : strings.login.button}
                    />
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}
