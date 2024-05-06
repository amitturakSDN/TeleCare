import { createDrawerNavigator } from '@react-navigation/drawer';
import { Dependent, Home } from '@/screens';
import { getHeaderTitle } from '@react-navigation/elements';
import { CustomDrawerContent, AppHeader } from '@/components';
import { BottomNavigator } from '@/navigation/BottomNavigator';
import { NAVIGATION } from '@/constants';

export function DrawerNavigator(){
    const Drawer = createDrawerNavigator();
    return (
        <Drawer.Navigator 
            id="mainNav"
            initialRouteName="Home" 
            screenOptions={{
                header: ({ navigation, route, options }) => {
                    const title = getHeaderTitle(options, route.name);
                    return <AppHeader title={title} navigation={navigation} />;
                }
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            {/* <Drawer.Screen name={NAVIGATION.dependent} component={Dependent} options={{ headerShown: false }}  /> */}
            <Drawer.Screen name={NAVIGATION.bottomNavigator} component={BottomNavigator} options={{ headerShown: false }}  />
        </Drawer.Navigator>
    )
}
