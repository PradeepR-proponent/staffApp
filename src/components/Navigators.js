import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { connect } from 'react-redux';

import HomeStack from './stacks/HomeStack';
import ProfileStack from './stacks/ProfileStack';
import AppointmentStack from './stacks/AppointmentStack';
import CreateAppointmentStack from './stacks/CreateAppointmentStack';
import SettingScreen from '../screens/Setting';
import { useTheme } from 'react-native-paper';



const Tab = createMaterialBottomTabNavigator();

function App(props) { 

  const theme = useTheme();
  theme.colors.secondaryContainer = "transperent"

  
  return (

    <Tab.Navigator activeColor={'black'}
      initialRouteName="Home"
      barStyle={{
        backgroundColor: props.color.primaryColor,
      }}
      backBehavior="initialRoute"
      shifting={false}
      theme={{colors: {secondaryContainer: 'transparent'}}}
      sceneAnimationEnabled={true}>

        
      <Tab.Screen name="Home" component={HomeStack} options={{
        tabBarIcon: 'home-account',
        tabBarBadge:false
      }} />

      <Tab.Screen name="Book" component={CreateAppointmentStack} options={{
        tabBarIcon: 'plus-circle',
      }} />

      <Tab.Screen name="Appointment" component={AppointmentStack} options={{
        tabBarIcon: 'calendar-month',
      }} />
      {/* <Tab.Screen name="Profile" component={ProfileStack} options={{
        tabBarIcon: 'face',

      }} /> */}
      {/* <Tab.Screen name="More" component={SettingScreen} options={{
        tabBarIcon: 'sort-variant'
      }} /> */}
    </Tab.Navigator>

  );
}

function mapStateToProps(state) {
  return {
    color: state.Theme.colorData
  }
}


export default connect(mapStateToProps)(App)