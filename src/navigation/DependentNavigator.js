import React from 'react';
import {useTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NAVIGATION} from '@/constants';
import {Chat, Dependent,Notification,Settings,RelatedPersonList,InviteRelative} from '@/screens';

const Stack = createNativeStackNavigator();

export function DependentNavigator() {
  const {colors} = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: colors.app,
        },
      }}>
      <Stack.Screen
        name={NAVIGATION.dependent}
        component={Dependent}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name={NAVIGATION.notification}
        component={Notification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={NAVIGATION.settings}
        component={Settings}
        options={{ headerShown: false }}
      />
        <Stack.Screen 
        name={NAVIGATION.relatedPersonList} 
        component={RelatedPersonList} 
        options={{ headerShown: false }} 
      />

      <Stack.Screen 
        name={NAVIGATION.invitePerson} 
        component={InviteRelative} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}
