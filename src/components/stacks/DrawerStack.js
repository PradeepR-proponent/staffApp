import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

//Screens

import DrawerContent from '../CustomDrawer';
import TabNavigator from '../Navigators';
import { touchProps } from 'react-native-web/dist/cjs/modules/forwardedProps';
import ViewProfile from '../../screens/Profile/ViewProfile';
import AddUnavailability from '../../screens/Appointment/AddUnavailability';
import UpdateAppointment from '../../screens/Appointment/UpdateAppointment';

const Drawer = createDrawerNavigator();

export default function DrawerStack() {
    return (
        <Drawer.Navigator
            initialRouteName=""
            inactiveBackgroundColor="red"
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#FFC000"
                },
                headerTintColor: "black"
            }}

        >
            <Drawer.Screen name="Article" component={TabNavigator} 
            options={{
                headerShown: true,
                title: "",
            }}
            />
            <Drawer.Screen name="Profile" component={ViewProfile}
                options={{
                    headerShown: true,
                    title: "Profile",
                }} />
            <Drawer.Screen name="UpdateAppointment" component={UpdateAppointment}
                options={{
                    headerShown: true,
                    title: "Update Appointment",
                }}

            />
            <Drawer.Screen name="AddUnavailability" component={AddUnavailability}
                options={{
                    headerShown: true,
                    title: "Add Unavailability",
                }} />

        </Drawer.Navigator>
    );
}
