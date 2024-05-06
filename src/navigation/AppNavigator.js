import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from '@react-navigation/native';
import React from 'react';
import {NAVIGATION} from '@/constants';
import {HomeNavigator} from '@/navigation/HomeNavigator';
import {ChatNavigator} from '@/navigation/ChatNavigator';
import {SessionNavigator} from './SessionNavigator';
import {ProfileNavigator} from '@/navigation/ProfileNavigator';
import {TabNavigator} from '@/components';

const Tab = createBottomTabNavigator();

export function AppNavigator() {
  const {colors} = useTheme();

  return (
    <Tab.Navigator tabBar={props => <TabNavigator {...props} />}>
      <Tab.Screen
        name={NAVIGATION.home}
        component={HomeNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name={NAVIGATION.chat}
        component={ChatNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name={NAVIGATION.session}
        component={SessionNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name={NAVIGATION.profile}
        component={ProfileNavigator}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}
