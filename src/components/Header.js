import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';
import { getHeaderTitle } from '@react-navigation/elements';

const Header = ({ navigation, previous, showMenu,options ,route }) => {
  const title = getHeaderTitle(options, route.name);

  const show = showMenu === undefined ? true : showMenu
  const { user} = useSelector(state => state.Auth)

  return (
    <Appbar style={[styles.headerContainer, { backgroundColor: "#FFC000" }]}>
      {previous ? <Appbar.BackAction onPress={navigation.goBack} /> : (show && <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />)}
      <Appbar.Content style={styles.content} title={title==="Home"?"":title} />
      {user?.name && title==="Home" &&  <View style={styles.infoWrapper}>
        <Text style={styles.infoNameHeading}>Hi, {user.name}</Text>
        <Text> <AntDesign name="enviroment" size={15} /> {user.city}</Text>
      </View>}
    </Appbar>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 90,
    position: "relative",
  },
  
  infoWrapper: {
    position: "absolute",
    right: 15,
  },
  infoNameHeading: {
    fontWeight: "bold"
  }
});

export default Header;