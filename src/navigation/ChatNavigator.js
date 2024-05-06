import React from 'react';
import {useTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NAVIGATION} from '@/constants';
import {Chat} from '@/screens';

const Stack = createNativeStackNavigator();

export function ChatNavigator() {
  const {colors} = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: colors.app,
        },
      }}>
      <Stack.Screen
        name={NAVIGATION.chat}
        component={Chat}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
