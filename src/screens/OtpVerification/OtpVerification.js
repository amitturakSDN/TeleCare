import {OtpVerification, TYPES, otpVerificationMfa} from '@/actions/OtpActions';
import {AuthHeader, Button, ErrorView, Loader, TextView} from '@/components';
import {Validate} from '@/helpers';
import {strings} from '@/localization';
import {styles} from '@/screens/OtpVerification/OtpVerification.styles';
import {isLoadingSelector} from '@/selectors/StatusSelectors';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {useState} from 'react';
import {Keyboard, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
export function OtpVerificationView({route, navigation}) {
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState(null);
  const dispatch = useDispatch();
  // const errors = useSelector((state) => errorsSelector([TYPES.OTP_VERIFICATION], state), shallowEqual);
  const isLoading = useSelector(state =>
    isLoadingSelector([TYPES.OTP_VERIFICATION], state),
  );
  const isLoadingMfa = useSelector(state =>
    isLoadingSelector([TYPES.OTP_VERIFICATION_MFA], state),
  );

  const {username, password, authType} = route.params;

  const handleSubmit = () => {
    Keyboard.dismiss();
    if (Validate.empty(code))
      return Validate.errorDisplay(strings.validation.empty, setCodeError);
    else {
      setCodeError(null);
      let request = {
        username: username,
        password: password,
        code: code,
      };

      if (authType == 'mfa') {
        dispatch(otpVerificationMfa(Validate.encryptInput(request)));
        setCode('');
      } else if (authType == 'verify') {
        dispatch(
          OtpVerification(
            Validate.encryptInput(username),
            Validate.encryptInput(code),
            Validate.encryptInput(password),
          ),
        );
        setCode('');
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      enableOnAndroid={true}
      style={styles.container}>
      <Loader isLoading={isLoading || isLoadingMfa} />

      <AuthHeader />
      <View style={styles.fieldContainer}>
        <TextView
          title={strings.otpVerification.title}
          viewStyle={styles.viewTitle}
          textStyle={styles.title}
        />
        <View style={[styles.formContainer]}>
          <TextView
            title={strings.otpVerification.subtitle}
            viewStyle={styles.subtitleView}
            textStyle={styles.subtitle}
          />
          <OTPInputView
            style={styles.otpInput}
            code={code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
            onCodeChanged={code => setCode(code)}
            keyboardType={'number-pad'}
            pinCount={6}
            codeInputFieldStyle={styles.underlineStyleBase}
            //onCodeFilled={code => {
            //  setCode(code);
            //}}
          />
          <ErrorView message={codeError} />
          <Button
            onPress={() => handleSubmit()}
            style={styles.submitButton}
            title={isLoading ? strings.common.loading : strings.buttons.login}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
