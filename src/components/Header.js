import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const Header = () => {
    return (
      <Appbar style={styles.headerContainer}>
        <Appbar.BackAction onPress={() => {}} />
      </Appbar>
    );
}

const styles = StyleSheet.create({
  headerContainer: {
    height:90,
  },
});

export default Header;