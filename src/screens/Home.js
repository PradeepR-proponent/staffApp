import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Pressable, Linking, Image, ScrollView, ToastAndroid } from 'react-native';
import { connect, useSelector, useDispatch } from 'react-redux';
import { toggleTheme, removeUserToken, saveUserToken, LoadUser, loading } from '../actions';
import { getAppointmentCount, getAppointment } from '../actions/appoinmentsActions';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CLEAR_ERRORS } from '../actions/actionTypes';
import { getAPP } from '../services/authServices'
import { loadAppointment } from '../actions/appoinmentsActions';





function Home(props) {

    const dispatch = useDispatch()
    const { user, token, } = useSelector(state => state.Auth)
    const { appointmentCount, latestAppointment, error } = useSelector(state => state.AppointmentReducer)

    const getApp = () => {
        getAPP(token).then((res) => {
            dispatch(loadAppointment(res.data))
        }).catch((err) => {
            ToastAndroid.show("No Appointment Available", ToastAndroid.SHORT);
        })
    }

    useEffect(() => {
        if (token !== null) {
            dispatch(saveUserToken(token))
            dispatch(getAppointment(token))
            dispatch(getAppointmentCount(token))
        }
    }, [token])

    useEffect(() => {
        if (Object.keys(error).length !== 0) {
            ToastAndroid.show(error?.message, ToastAndroid.SHORT);
            dispatch({ type: CLEAR_ERRORS })
        }
    }, [error])


    useEffect(() => {
        getApp()
    }, [props])

    return (
        <ScrollView>
 <View>
            <StatusBar backgroundColor="white" barStyle={'dark-content'} />
            <View style={[styles.containerWrapper, { backgroundColor: props.color.primaryColor }]}>
                <View style={[styles.topDataWrapper, { backgroundColor: props.color.primaryColor }]}>
                    <View style={styles.infoWrapper}>
                        <View style={styles.infoName}>
                            <Text style={styles.infoNameHeading}>Hi, {user.name}</Text>
                            <Text style={styles.infoNameSubheading}> <AntDesign name="enviroment" size={20} /> {user.city}</Text>
                        </View>
                        <View style={styles.infoImage}>
                            <Image source={{ uri: user.staff_profile }} style={styles.infoMainImage} />
                        </View>
                    </View>
                    {
                        latestAppointment?.length > 0 && (<View style={styles.pagerWrapper}>
                            <Text style={styles.pagerHeading}>Latest Appointment</Text>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false} style={styles.scrollWrapper}>
                                {latestAppointment?.map((data, idx) => (
                                    <TouchableOpacity key={idx} style={[styles.scrollView, { borderColor: "#FFC000" }]}>
                                        <Text style={styles.scrollViewHeading}>{data.client.name}</Text>
                                        <View style={styles.scrollViewDetails}>
                                            <Text style={styles.scrollViewText}>{data.service[0].name}</Text>
                                        </View>
                                        <View style={styles.scrollViewDetails}>
                                            <Text style={{ ...styles.scrollViewText, fontSize: 10 }}>{data.start_time} to {data.end_time}</Text>
                                            <Pressable onPress={() => Linking.openURL(`tel:${data.client.phone}`)} >
                                                <Text style={[styles.scrollViewText, styles.callBtn, { backgroundColor: "#FFC000" }]}>Call</Text>
                                            </Pressable>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>)
                    }


                </View>

                <View style={styles.statWrapper}>

                    <Pressable onPress={getApp} >
                        <View style={styles.statItem}>
                            <Ionicons name="alarm" size={60} color={props.color.secondaryColor} />
                            <View style={styles.statData}>
                                <Text style={styles.statDataName}>Today's Appointments</Text>
                                <Text style={styles.statDataValue}>{appointmentCount?.daily_appointments}</Text>
                            </View>
                        </View>
                    </Pressable>
                    <View style={styles.statItem}>
                        <Ionicons name="people" size={60} color={props.color.secondaryColor} />
                        <View style={styles.statData}>
                            <Text style={styles.statDataName}>This Month</Text>
                            <Text style={styles.statDataValue}>{appointmentCount?.monthly_appointments}</Text>
                        </View>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="md-analytics" size={60} color={props.color.secondaryColor} />
                        <View style={styles.statData}>
                            <Text style={styles.statDataName}>This Year</Text>
                            <Text style={styles.statDataValue}>{appointmentCount?.yearly_appointments}</Text>
                        </View>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="ios-ribbon" size={60} color={props.color.secondaryColor} />
                        <View style={styles.statData}>
                            <Text style={styles.statDataName}>All Time</Text>
                            <Text style={styles.statDataValue}>{appointmentCount?.total_appointments}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
        </ScrollView>
       
    );
}




function mapStateToProps(state) {
    return {
        color: state.Theme.colorData
    }
}

function mapDispatchToProps(dispatch) {
    return ({
        toggleTheme: color => dispatch(toggleTheme(color)),
        removeUserToken: () => dispatch(removeUserToken())

    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

const styles = StyleSheet.create({
    containerWrapper: {
        height: hp('100'),
        width: wp('100'),
        backgroundColor: "#78909c"
    },

    reload: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        color: "white"
    },
    topDataWrapper: {
        paddingBottom: 20,
    },
    infoWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10
    },
    infoMainImage: {
        width: wp('15%'),
        height: hp('7%'),
        borderRadius: 12
    },
    infoNameHeading: {
        fontSize: 20,
        color: "#333"
    },
    infoNameSubheading: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333"
    },
    pagerWrapper: {
        marginTop: 5,
    },
    pagerHeading: {
        fontSize: 20,
        marginVertical: 5,
        padding: 10,
        color: "#333"
    },
    scrollWrapper: {
        width: wp('100%'),
        // height:hp('15%'),
    },
    scrollViewDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    scrollView: {
        width: wp('50%'),
        backgroundColor: "white",
        justifyContent: "space-between",
        padding: 10,
        borderRadius: 12,
        borderWidth: 2,
        marginHorizontal: 5
    },
    scrollViewHeading: {
        fontSize: 18
    },
    statWrapper: {
        flex: 1,
        padding: 10,
        marginTop:20,
        width: wp('100%'),
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginTop: -10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
        flexGrow: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
    },
    statItem: {
        backgroundColor: "white",
        width: wp('40%'),
        height: hp('20%'),
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
        padding: 10,
        margin: 10,
        borderRadius: 4
    },
    statData: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center"
    },
    statDataName: {
        fontSize: 11,
        width: "65%"
    },
    statDataValue: {
        fontSize: 16,
        width: "35%",
        textAlign: "center"
    },
    callBtn: {
        color: "#fff",
        width: 45,
        paddingBottom: 2,
        paddingTop: 2,
        borderRadius: 20,
        textAlign: "center"
    }
});
