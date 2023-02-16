/**
 * Final screen of the add appointment flow 
 * Goal of booking an appointment are being achieved here:
 * 1.Confirm the complete summary of the appointment
 */



import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ToastAndroid, Image } from 'react-native';
import { connect, useDispatch, useSelector } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Headline, Button, Snackbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Loader from '../../components/GlobalComponent/Loader';
import { addAppointment, getAppointment, getAppointmentCount } from '../../actions/appoinmentsActions';
import { CLEAR_ERRORS, RESET_MESSAGE } from '../../actions/actionTypes';
import { getAPP } from '../../services/authServices'
import { loadAppointment } from '../../actions/appoinmentsActions';

var moment = require('moment');

//Circle component

const CircleOuter = (props) => {
    return (
        <View style={props.style} />
    );
}


function AddAppointment(props) {



    const appointmentData = props.route.params.summary;
    //function states
    const { token, user } = useSelector(state => state.Auth)
    const { message, loading, error } = useSelector(state => state.AppointmentReducer)

    const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [visible, setVisibility] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const gradientColor = ['#4a6572', '#3288b1', '#2d576b'];
    const gradientStart = [0, 0];
    const gradientEnd = [0, 0];

    const _onDismissSnackBar = () => {
        setVisibility(false);
    }

    const _toggleIsLoading = () => {
        setIsLoading(false);
    }

    const createAppointment = () => {
        const createAppointmentData = {
            client_id: appointmentData.client.id,
            staff_id: appointmentData.staff.id,
            service: appointmentData.service.id,
            date: appointmentData.date,
            start_time: appointmentData.start_time,
            end_time: moment(appointmentData?.end_time, 'h:mm a').format('h:mm A')
        }
        dispatch(addAppointment(createAppointmentData, token))
    }

    useEffect(() => {
        if (message) {
            ToastAndroid.show('Appointment added successfully!', ToastAndroid.SHORT);
            props.navigation.navigate('Book', { screen: "AddAppointment" })
            dispatch({ type: RESET_MESSAGE })
            dispatch(getAppointment(token))
            dispatch(getAppointmentCount(token))
            getAPP(token).then((res) => {
                dispatch(loadAppointment(res.data))
            }).catch((err) => {
            })
        }
    }, [message, loading])


    useEffect(() => {
        if (Object.keys(error).length !== 0) {
            ToastAndroid.show(error?.message, ToastAndroid.SHORT);
            dispatch({ type: CLEAR_ERRORS })
        }
    }, [error])

    return (
        <View style={styles.container}>
            {isLoading &&
                (<Loader action={_toggleIsLoading} color={props.color} navigation={props.navigation} />)
            }
            <CircleOuter style={styles.circleOne} />
            <CircleOuter style={styles.circleTwo} />
            <CircleOuter style={styles.circleThree} />
            <CircleOuter style={styles.circleFour} />
            <CircleOuter style={styles.circleFive} />
            <CircleOuter style={styles.circleSix} />
            <Snackbar
                style={{}}
                visible={visible}
                onDismiss={_onDismissSnackBar}
                action={{
                    label: 'Ok',
                    onPress: () => {
                        // Do something
                    },
                }}
            >
                Hey there! Please confirm details.
            </Snackbar>

            <View style={styles.detailsWrapper}>
                <View style={styles.staffInfo}>
                    <View style={styles.staffImageContainer}>
                        <Image style={styles.staffImage} source={{ uri: appointmentData?.service?.image }} />
                    </View>
                    <View style={styles.staffDetailContainer}>
                        <Text style={styles.staffName}>{appointmentData?.staff?.name}</Text>
                        <Text style={styles.staffService}> {appointmentData.service.name}</Text>

                    </View>
                </View>
                <View style={styles.appointmentInfo}>

                    <View style={styles.appointmantDateContainer}>
                        <Text style={styles.appointmantDateLabel}>Client Name</Text>
                        <Text style={styles.appointmantDate}>{appointmentData?.client?.first_name} {appointmentData?.client?.last_name}</Text>
                    </View>

                    <View style={styles.appointmantDateContainer}>
                        <Text style={styles.appointmantDateLabel}>Client Email</Text>
                        <Text style={[styles.appointmantDate, { fontSize: 14 }]}>{appointmentData?.client?.email}</Text>
                    </View>

                    <View style={styles.appointmantDateContainer}>
                        <Text style={styles.appointmantDateLabel}>Client Mobile</Text>
                        <Text style={styles.appointmantDate}>{appointmentData?.client?.phone}</Text>
                    </View>

                    <View style={styles.appointmantDateContainer}>
                        <Text style={styles.appointmantDateLabel}>Date</Text>
                        <Text style={styles.appointmantDate}>{appointmentData?.date}</Text>
                    </View>
                    <View style={styles.appointmantDateContainer}>
                    <Text style={styles.appointmantTimeLabel}>Time</Text>
                        <Text style={styles.appointmantTime}>{appointmentData?.start_time} - {moment(appointmentData?.end_time, 'h:mm a').format('h:mm A')}</Text>
                    </View>

                </View>
            </View>
            <View style={styles.btnContainer}>
                <Button icon="chevron-right" style={[styles.nextBtn,{backgroundColor:props.color.primaryColor}]}  labelStyle={{ color: "#fff" }} mode="contained"  onPress={createAppointment}>
                    {loading ? "Please Wait .." : " Confirm"}
                </Button>
            </View>
        </View>
    );
}

function mapStateToProps(state) {
    return {
        color: state.Theme.colorData
    }
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAppointment)

const circleColor = "#fff3e0";
const textColor = "#333";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "space-around",

    },
    btnContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: "#ffffff00",
        alignItems: "flex-end",
        justifyContent: "center"
    },
    appointmentHeadline: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: "center",
    },
    nextBtn: {
        width: wp('40%'),
    },
    detailsWrapper: {
        flex: 4,
        zIndex:10
    },
    staffInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        justifyContent: "space-around"
    },
    staffImageContainer: {
        //backgroundColor:"yellow"
    },
    staffImage: {
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        borderColor: "white",
        borderWidth: 1,

    },
    staffDetailContainer: {
        paddingHorizontal: 10
    },
    staffName: {
        fontSize: 25,
        color: textColor
    },
    staffService: {
        fontSize: 20,
        color: textColor
    },
    appointmentInfo: {
        //backgroundColor:"teal",
        flex: 1
    },
    appointmantDateContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
padding:10
        
    },
    appointmantDateLabel: {
        fontSize: 20,
        fontWeight: "900",
        color: textColor
    },
    appointmantDate: {
        fontSize: 20,
        color: textColor
    },
    appointmantTimeContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        flex: 1
    },
    appointmantTimeLabel: {
        fontSize: 20,
        fontWeight: "900",
        color: textColor
    },
    appointmantTime: {
        fontSize: 20,
        color: textColor
    },
    circleOne: {

        backgroundColor: circleColor,
        borderRadius: wp('80%') / 2,
        width: wp('80%'),
        height: wp('80%'),
        position: "absolute",
        top: 0,
        left: 0
    },
    circleTwo: {

        backgroundColor: circleColor,
        borderRadius: wp('20%') / 2,
        width: wp('20%'),
        height: wp('20%'),
        position: "absolute",
        top: wp('98%'),
        left: wp('20%')
    },
    circleThree: {

        backgroundColor: circleColor,
        borderRadius: wp('10%') / 2,
        width: wp('10%'),
        height: wp('10%'),
        position: "absolute",
        top: wp('100%'),
        left: wp('80%')
    },
    circleFour: {

        backgroundColor: circleColor,
        borderRadius: wp('10%') / 2,
        width: wp('10%'),
        height: wp('10%'),
        position: "absolute",
        top: wp('100%'),
        left: wp('80%')
    },
    circleFive: {

        backgroundColor: circleColor,
        borderRadius: wp('5%') / 2,
        width: wp('5%'),
        height: wp('5%'),
        position: "absolute",
        top: wp('60%'),
        left: wp('90%')
    },
    circleSix: {

        backgroundColor: circleColor,
        borderRadius: wp('5%') / 2,
        width: wp('5%'),
        height: wp('5%'),
        position: "absolute",
        top: wp('100%'),
        left: wp('10%')
    },

    //Loader Model Styling 

    modalContainer: {
        flex: 1
    }


});