import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';

//Screens
import LoginScreen from '../../screens/Auth/Login';
import AppIntro from '../../screens/AppIntro/AppIntro';
import ForgetPassword from '../../screens/Auth/ForgetPassword';


const Stack = createStackNavigator();


function AuthStack(props){
      return(
      <Stack.Navigator 
      headerMode="none"
      initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      </Stack.Navigator>
      );
}

function mapStateToProps(state) {
    return {
        color: state.Theme.colorData
    }
}


export default connect(mapStateToProps)(AuthStack)