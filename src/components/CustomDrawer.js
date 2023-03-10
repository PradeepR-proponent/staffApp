import React from 'react';
import { View, StyleSheet, ToastAndroid } from 'react-native';
import {
  DrawerItem,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
} from 'react-native-paper';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { removeUserToken } from '../actions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';


export default function DrawerContent(props) {



  const { user } = useSelector(state => state.Auth)
  const { appointmentCount } = useSelector(state => state.AppointmentReducer)

  const dispatch = useDispatch()

  const logOut = () => {
    dispatch(removeUserToken())
    ToastAndroid.show("Logged Out", ToastAndroid.SHORT);
  }

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Avatar.Image
            source={{
              uri: user.staff_profile
            }}
            size={100}
            style={{ marginTop: 20 }}
          />
          <Title style={styles.title}>{user.name}</Title>
          <Caption style={styles.caption}>{user.about}</Caption>
          <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                {appointmentCount?.total_appointments}
              </Paragraph>
              <Caption style={styles.caption}>Bookings</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
              {appointmentCount?.daily_appointments}
              </Paragraph>
              <Caption style={styles.caption}>Today's Booking</Caption>
            </View>
          </View>
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <AntDesign
                name="home"
                color={color}
                size={size}
              />
            )}
            label="Home"
            onPress={() => props.navigation.navigate("Article", { screen: "Home" })}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <AntDesign
                name="team"
                color={color}
                size={size}
              />
            )}
            label="View Appointments"
            onPress={() => props.navigation.navigate("Appointment",{screen:'ViewAppointment'})}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="update"
                color={color}
                size={size}
              />
            )}
            label="Update Appointment"
            onPress={() => props.navigation.navigate("UpdateAppointment")}
          />
          {user.role === 3 && <DrawerItem
            icon={({ color, size }) => (
              <AntDesign
                name="adduser"
                color={color}
                size={size}
              />
            )}
            label="Add Unavailability"
            onPress={() => props.navigation.navigate("AddUnavailability")}
          />}
          {/* <DrawerItem
            icon={({ color, size }) => (
              <AntDesign
                name="pluscircleo"
                color={color}
                size={size}
              />
            )}
            label="Add Appointments"
            onPress={() => props.navigation.navigate("AddAppointment")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <AntDesign
                name="edit"
                color={color}
                size={size}
              />
            )}
            label="Update Appointments"
            onPress={() => props.navigation.navigate("UpdateAppointment")}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <AntDesign
                name="man"
                color={color}
                size={size}
              />
            )}
            label="Add Unavailability"
            onPress={() => props.navigation.navigate("AddUnavailability")}
          /> */}
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="account-outline"
                color={color}
                size={size}
              />
            )}
            label="Profile"
            onPress={() => props.navigation.navigate("Profile")}
          />
          {/* <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="tune" color={color} size={size} />
            )}
            label="Setting"
            onPress={() => {}}
          /> */}
          {/* <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="bookmark-outline"
                color={color}
                size={size}
              />
            )}
            label="Bookmarks"
            onPress={() => {alert('hii')}}
          /> */}
        </Drawer.Section>
        <Drawer.Section title="Quick Action">
          {/* <TouchableRipple onPress={() => {alert('hii')}}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents="none">
                <Switch value={false} />
              </View>
            </View>
          </TouchableRipple> */}

          <DrawerItem
            icon={({ color, size }) => (
              <AntDesign name="logout" color={color} size={size} />
            )}
            label="Log out"
            onPress={logOut}
          />



          {/* <TouchableRipple onPress={}>
            <View style={styles.preference}>
              <Text style={{fontWeight:"bold"}} >Logout</Text>
            </View>
          </TouchableRipple> */}
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 13,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});