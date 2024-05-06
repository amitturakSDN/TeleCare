import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NAVIGATION } from '@/constants';
import { 
  Login,
  ForgotPassword, 
  ForgotPasswordSuccess,
  ResetPassword, 
  OtpVerificationView, 
  RelatedPersonSignup,
  ResetTempPassword
} from '@/screens';

const Stack = createNativeStackNavigator();

export function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen component={Login} name={NAVIGATION.login} options={{ headerShown: false }} />
      <Stack.Screen component={ResetPassword} name={NAVIGATION.resetPassword} options={{ headerShown: false }} />
      <Stack.Screen component={OtpVerificationView} name={NAVIGATION.otpVerification} options={{ headerShown: false }} />     
      <Stack.Screen component={ForgotPasswordSuccess} name={NAVIGATION.forgotPasswordSuccess} options={{ headerShown: false }} />
      <Stack.Screen component={ForgotPassword} name={NAVIGATION.forgotPassword} options={{ headerShown: false }} />
      <Stack.Screen component={RelatedPersonSignup} name={NAVIGATION.relatedPersonSignup}  options={{ headerShown: false }} />
      <Stack.Screen component={ResetTempPassword} name={NAVIGATION.resetTempPassword}  options={{ headerShown: false }} />
    </Stack.Navigator> 
  );
}
