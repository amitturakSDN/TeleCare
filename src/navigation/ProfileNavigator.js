import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NAVIGATION } from '@/constants';
import { Profile,Settings,Notification,Medication,InviteRelative,DependentInternal, RelatedPersonList,RelatedPersonSignup } from '@/screens';
import { useTheme } from '@react-navigation/native';
import { DiseaseListing, AddDisease } from '@/screens/DiseaseManagement';
const Stack = createNativeStackNavigator();

export function ProfileNavigator() {
  const{colors} = useTheme()
  return (
    <Stack.Navigator screenOptions={{
      contentStyle:{
        backgroundColor:colors.app
      }
   }}>
      <Stack.Screen
        name={NAVIGATION.profile}
        component={Profile}
        options={{ headerShown: false }}
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
        name={NAVIGATION.medication}
        component={Medication}
        options={{ headerShown: false }}
      />   
        <Stack.Screen
        name={NAVIGATION.diseaseListing}
        component={DiseaseListing}
        options={{ headerShown: false }}
      />  
       <Stack.Screen
        name={NAVIGATION.dependentInternal}
        component={DependentInternal}
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
