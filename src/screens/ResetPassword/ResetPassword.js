import {ForgotPassReset, forgotCheckResetToken} from '@/actions/ForgotActions';
import {
  TYPES,
  loginChangeTempPassword,
  setUserData,
} from '@/actions/UserActions';
import {IMAGES} from '@/assets';
import {
  AuthHeader,
  Button,
  ErrorView,
  Loader,
  TextField,
  TextView,
} from '@/components';
import {NAVIGATION} from '@/constants';
import {Validate} from '@/helpers';
import {strings} from '@/localization';
import {styles} from '@/screens/ResetPassword/ResetPassword.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
export function ResetPassword({route, navigation}) {
  const {username, session, type, code, email} = route.params;
  const {colors} = useTheme();
  const dispatch = useDispatch();

  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [old_password, setOldpassword] = useState('');

  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);

  const [passwordError, setPasswordError] = useState(null);
  const [cPasswordError, setCPasswordError] = useState(null);
  const [oldPasswordError, setOldPasswordError] = useState(null);
  const [resetType, setResetType] = useState(type);

  const isLoading = useSelector(state =>
    isLoadingSelector([TYPES.LOGIN_CHANGE_TEMP_PASSWORD], state),
  );

  useEffect(() => {
    if (!(Validate.empty(email) && Validate.empty(code))) {
      dispatch(
        forgotCheckResetToken({
          email,
          code,
        }),
      );
    }
  }, []);

  const setPwd = text => {
    setPassword(text);
    setPasswordError(null);
  };

  const setCpwd = text => {
    setCpassword(text);
    setCPasswordError(null);
  };

  const setOldpwd = text => {
    setOldpassword(text);
    setOldPasswordError(null);
  };

  const handleSubmit = () => {
    if (type == 'link_reset' && old_password == '')
      return Validate.errorDisplay(
        'Please fill old password',
        setOldPasswordError,
      );
    else if (Validate.empty(password) || Validate.empty(cpassword))
      return Validate.errorDisplay(strings.validation.empty, setPasswordError);
    else if (password != cpassword)
      return Validate.errorDisplay(
        strings.validation.matchPass,
        setPasswordError,
      );
    else if (Validate.password(password))
      return Validate.errorDisplay(
        strings.validation.invalidPass,
        setPasswordError,
      );
    else if (Validate.password(cpassword))
      return Validate.errorDisplay(
        strings.validation.invalidPass,
        setCPasswordError,
      );
    else setPasswordError(null);
    setCPasswordError(null);

    if (type == 'link_reset') {
      let request = {
        username: username,
        password: old_password,
      };
      dispatch(
        setUserData(request, res => {
          if (res.status) {
            dispatch(
              loginChangeTempPassword({
                ...Validate.encryptInput({
                  username: username,
                  password: password,
                }),
                session: res.session,
              }),
            );
          } else {
            navigation.navigate(NAVIGATION.login);
          }
        }),
      );
    } else if (type == 'reset') {
      let request = {
        username,
        password,
      };
      dispatch(
        loginChangeTempPassword({...Validate.encryptInput(request), session}),
      );
    } else {
      let pwd = Validate.encrypt(password);
      let request = {
        password: pwd,
        verificationCode: code,
        email: email.toLocaleLowerCase(),
        isMobile: true,
      };
      dispatch(ForgotPassReset(request));
    }
  };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      enableOnAndroid={true}
      style={[styles.container, {backgroundColor: colors.background}]}>
      <Loader isLoading={isLoading} />
      <AuthHeader />
      <View style={styles.fieldContainer}>
        <TextView
          title={strings.resetPassword.title}
          viewStyle={styles.viewTitle}
          textStyle={styles.title}
        />
        <View style={[styles.formContainer]}>
          {resetType == 'link_reset' && (
            <View>
              <TextField
                autoCapitalize="none"
                accessibilityHint={strings.login.usernameHint}
                accessibilityLabel={strings.login.username}
                onChangeText={text => setOldpwd(text)}
                placeholder={strings.resetPassword.oldPassTitle}
                value={old_password}
                title={strings.resetPassword.oldPassTitle}
                icon={IMAGES.icons.password}
                secureTextEntry={!showOldPass}
                leftIcon={
                  showOldPass ? IMAGES.icons.hidePass : IMAGES.icons.showPass
                }
                onLeftPress={() => setShowOldPass(!showOldPass)}
                returnKeyType={'done'}
                onSubmitEditing={handleSubmit}
              />
              <ErrorView message={oldPasswordError} />
            </View>
          )}
          <TextField
            autoCapitalize="none"
            accessibilityHint={strings.login.usernameHint}
            accessibilityLabel={strings.login.username}
            onChangeText={text => setPwd(text)}
            placeholder={strings.resetPassword.newPassPlaceholder}
            value={password}
            title={strings.resetPassword.newPassTitle}
            icon={IMAGES.icons.password}
            secureTextEntry={!showPass}
            leftIcon={showPass ? IMAGES.icons.hidePass : IMAGES.icons.showPass}
            onLeftPress={() => setShowPass(!showPass)}
          />
          <ErrorView message={passwordError} />

          <TextField
            autoCapitalize="none"
            accessibilityHint={strings.login.usernameHint}
            accessibilityLabel={strings.login.username}
            onChangeText={text => setCpwd(text)}
            placeholder={strings.resetPassword.confirmPassPlaceholder}
            value={cpassword}
            title={strings.resetPassword.confirmPassTitle}
            icon={IMAGES.icons.password}
            secureTextEntry={!showCPass}
            leftIcon={showCPass ? IMAGES.icons.hidePass : IMAGES.icons.showPass}
            onLeftPress={() => setShowCPass(!showCPass)}
            returnKeyType={'done'}
            onSubmitEditing={handleSubmit}
          />
          <ErrorView message={cPasswordError} />

          <Button
            onPress={handleSubmit}
            style={styles.submitButton}
            title={strings.buttons.submit}
          />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(NAVIGATION.login)}
          style={styles.login}>
          <TextView
            title={strings.buttons.backLogin}
            textStyle={styles.title}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}
