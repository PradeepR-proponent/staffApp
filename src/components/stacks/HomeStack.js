import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../screens/Home';
import { connect } from 'react-redux';
import { View, Text, Pressable, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FontAwesome5 } from "@expo/vector-icons";


const Stack = createStackNavigator();


function HomeStack(props) {


  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: { backgroundColor: props.color.primaryColor },
      }}>
      <Stack.Screen name="Home"
        component={HomeScreen}
        options={{headerShown:false }}
      />
    </Stack.Navigator>
  );
}

function mapStateToProps(state) {
  return {
    color: state.Theme.colorData
  }
}


export default connect(mapStateToProps)(HomeStack)



const styles = StyleSheet.create({
  ViewModel: {
    width: wp('90'),
    display: 'flex',
    flexDirection: "row"
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold"
  }
})