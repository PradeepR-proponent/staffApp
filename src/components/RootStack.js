import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { connect, useSelector, useDispatch } from 'react-redux';
//Screens

import AuthLoading from '../screens/Auth/AuthLoading';
import AuthStack from './stacks/AuthStack';
import AppIntro from '../screens/AppIntro/AppIntro';
import MainAppStack from './stacks/DrawerStack';
import { getUserToken, saveUserToken, LoadUser } from '../actions'

const Stack = createStackNavigator();


function RootStack(props) {

  const dispatch = useDispatch()
  const { token, isAuthenticated } = useSelector(state => state.Auth)

  React.useEffect(() => {
    const loadusr = () => dispatch(LoadUser(token))
    if (!isAuthenticated && token !== null) {
      loadusr()
    }
  }, [isAuthenticated, token])


  return (
    <NavigationContainer>
      <Stack.Navigator
        headerMode="none"
      >

        {props.auth.loading ? (

          <Stack.Screen name="AuthLoading" component={AuthLoading} />
        ) : props.auth.token == null ? (

          props.appIntroStatus.status ?
            (
              <Stack.Screen name="AppIntro" component={AppIntro} />
            ) :
            (
              <Stack.Screen name="AuthStack" component={AuthStack} />
            )

        ) : (

          <Stack.Screen name="MainAppStack" component={MainAppStack} />
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}


const mapStateToProps = state => ({
  auth: state.Auth,
  appIntroStatus: state.ShowAppIntro.appIntroStatus,
  color: state.Theme.colorData
});


const mapDispatchToProps = dispatch => ({
  getUserToken: () => dispatch(getUserToken()),
  isAppIntroStatus: status => dispatch(isAppIntroStatus(status))
});


export default connect(mapStateToProps, mapDispatchToProps)(RootStack)