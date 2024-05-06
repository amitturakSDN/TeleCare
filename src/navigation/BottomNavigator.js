import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from '@react-navigation/native';
import {CommonActions} from '@react-navigation/native';
import React from 'react';
import {NAVIGATION} from '@/constants';
import {HomeNavigator} from '@/navigation/HomeNavigator';
import {ProfileNavigator} from '@/navigation/ProfileNavigator';
import {TabNavigator} from '@/components';
import {SafeAreaView} from 'react-native-safe-area-context';
// import {ChatNavigator} from '@/navigation/ChatNavigator';
import {Dependent, DependentNavigator} from '@/navigation/DependentNavigator';
import {SessionNavigator} from '@/navigation/SessionNavigator';
import {SettingsNavigator} from './SettingsNavigator';

const Tab = createBottomTabNavigator();

export function BottomNavigator(props) {
  const {colors} = useTheme();
  let show = props.route.props;
  /**
   * Resets tabs with stackNavigators to the first route when navigation to another tab
   */
  const resetTabStacksOnBlur = ({navigation}) => ({
    blur: () => {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'Home'}],
        }),
      );
    },
  });

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white',}}>
      <Tab.Navigator
        screenOptions={{
          tabBarHideOnKeyboard: true,
          unmountOnBlur: true,
        }}
        tabBar={props => <TabNavigator {...props} show={show} />}>
        <Tab.Screen
          name={NAVIGATION.home}
          component={HomeNavigator}
          options={{headerShown: false}}
          //  listeners={resetTabStacksOnBlur}
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
        <Tab.Screen
          name={NAVIGATION.settings}
          component={SettingsNavigator}
          options={{headerShown: false}}
        />
        
      </Tab.Navigator>
    </SafeAreaView>
  );
}
