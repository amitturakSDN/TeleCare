import React from 'react';
import {useTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NAVIGATION} from '@/constants';
import {
  AudioCall,
  Session,
  VedioCall,
  Notification,
  Settings,
  InviteRelative,
  RelatedPersonList,
  AppointmentNote,
  Medication,
  DependentInternal,
  RequestGuidance,
  Feedback,
  FeedbackThanks,
  GetCareForm,
  AppointmentSent,
} from '@/screens';
import {DiseaseListing, AddDisease} from '@/screens/DiseaseManagement';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
const Stack = createNativeStackNavigator();

export function SessionNavigator({navigation, route}) {
  const {colors} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: colors.app,
        },
      }}>
      <Stack.Screen
        name={NAVIGATION.session}
        component={Session}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NAVIGATION.vedioCall}
        component={VedioCall}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NAVIGATION.audioCall}
        component={AudioCall}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NAVIGATION.notification}
        component={Notification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NAVIGATION.note}
        component={AppointmentNote}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NAVIGATION.settings}
        component={Settings}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NAVIGATION.relatedPersonList}
        component={RelatedPersonList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NAVIGATION.requestGuidance}
        component={RequestGuidance}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NAVIGATION.invitePerson}
        component={InviteRelative}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NAVIGATION.medication}
        component={Medication}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NAVIGATION.diseaseListing}
        component={DiseaseListing}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NAVIGATION.dependentInternal}
        component={DependentInternal}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NAVIGATION.feedback}
        component={Feedback}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NAVIGATION.feedbackThanks}
        component={FeedbackThanks}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NAVIGATION.getCareForm}
        component={GetCareForm}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={NAVIGATION.appointmentSent}
        component={AppointmentSent}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
