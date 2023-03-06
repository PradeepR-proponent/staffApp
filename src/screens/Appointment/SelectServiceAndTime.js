import React, { useState } from 'react';
import {
    View, Text, ScrollView, StyleSheet,
    ToastAndroid, TouchableOpacity, Image, Pressable
} from 'react-native';
import { connect, useDispatch, useSelector } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Headline, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { getSlots, getServices } from '../../actions/appDataActions';

var moment = require('moment');



function AddAppointment(props) {

    const { services, slots, error } = useSelector(state => state.AppData)
    const { token, user } = useSelector(state => state.Auth)
    const dispatch = useDispatch()
    const lastPageData = props.route.params.appointmentData
    const [err, seterr] = useState("")
    const [selectedService, setSelectedService] = useState({})
    const [selectedSlot, setSelectedSlot] = useState({})
    const [selectedEndSlot, setSelectedEndSlot] = useState(null)
    const gradientColor = ['#4a6572', '#3288b1', '#2d576b'];
    const gradientStart = [0, 0];
    const gradientEnd = [0, 0];

    const nextPage = () => {
        if (Object.keys(selectedService).length === 0) {
            seterr("Please Select Service")
            return
        }
        if (Object.keys(selectedSlot).length === 0) {
            seterr("Please Select Start Time")
            return
        }
        if ((selectedEndSlot) == 'Invalid date') {
            seterr("Please Select End Time")
            return
        }
        const appointmentData = {
            ...lastPageData,
            start_time: selectedSlot.startTime,
            end_time: selectedEndSlot,
            service: selectedService
        }
        props.navigation.navigate('ClientSelectionAddition', { appointmentData })
    }

    const hanldeStartTimeSlot = (data, idx) => {
        seterr("")
        if (selectedEndSlot.id < idx || selectedEndSlot.id === idx) {
            setSelectedEndSlot({})
        }
        setSelectedSlot({
            id: idx,
            startTime: data
        })
    }

    const getSlote = () => {
        const { staff } = lastPageData
        dispatch(getSlots(token, moment(lastPageData.date).format("Y-M-D"), 15, staff.id))
    }
    const getService = () => {
        const { staff } = lastPageData
        dispatch(getServices(token, staff.id))
    }

    useEffect(() => {
        getService()
        getSlote()
    }, [])


    useEffect(() => {
        if (err != "") {
            ToastAndroid.show(err, ToastAndroid.SHORT);
        }
    }, [err])

    useEffect(() => {

        if (selectedSlot) {
            const startTime = moment(selectedSlot.startTime, 'h:mm a').format('h:mm A')
            let endTime = startTime
            const serviceTime= selectedService?.duration?.split(" ")||[]
            endTime = moment(endTime, "hh:mm:ss A")
                .add(serviceTime[0], 'minutes')
                .format('LTS');
            setSelectedEndSlot(endTime)
        }

    }, [selectedSlot, selectedService])

    return (
        <View style={styles.container}>
            {services?.length > 0 ? (<View style={styles.serviceViewWrapper}>
                <Headline style={styles.appointmentHeadline}>Available Services</Headline>
                <ScrollView contentContainerStyle={styles.serviceContainer} horizontal={true} showsHorizontalScrollIndicator={false}>
                    {
                        services?.map((data, idx) => <Pressable key={idx}
                            onPress={() => {
                                setSelectedService(data)
                                seterr("")
                            }} >
                            <View style={styles.singleService}>
                                <Image style={{ ...styles.serviceImage, borderColor: selectedService.id === data.id ? props.color.primaryColor : "#f2f2f2", }} source={{ uri: data.image }} />
                                <Text style={styles.serviceText}>{data.name}</Text>
                            </View>
                        </Pressable>)
                    }
                </ScrollView>
            </View>) : <Headline style={styles.appointmentHeadline}>{error?.errors ? error.errors : "No Service Available"}</Headline>}
            {slots?.slot?.length > 0 ? (
                <>
                    <View style={styles.timeSlotView}>
                        <Headline style={styles.appointmentHeadline}>Select Start Time </Headline>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                            {
                                slots?.slot?.map((data, idx) => <LinearGradient key={idx} colors={gradientColor} style={{ ...styles.singleTimeSlot, borderWidth: selectedSlot.id === idx ? 2 : 0, borderColor: selectedSlot.id === idx ? props.color.primaryColor : "" }} start={gradientStart} end={gradientEnd}>
                                    <TouchableOpacity onPress={() => hanldeStartTimeSlot(data, idx)}  >
                                        <Text style={styles.singleTimeSlotText}>{data}</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                                )
                            }
                        </ScrollView>
                    </View>

                    {
                        selectedEndSlot !== "Invalid date" && <View style={styles.timeSlotView}>
                            <Headline style={styles.appointmentHeadline}>End Time </Headline>
                            <TouchableOpacity   >
                                <LinearGradient colors={gradientColor} style={{ ...styles.singleTimeSlot, }} start={gradientStart} end={gradientEnd}>
                                    <TouchableOpacity   >
                                        <Text style={styles.singleTimeSlotText}>{moment(selectedEndSlot, 'h:mm a').format('h:mm A')}</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    }

                </>
            ) : <Headline style={styles.appointmentHeadline}>No Slot Available</Headline>}
            <View style={styles.btnContainer}>
                <Button icon="chevron-right"  mode="contained" style={[styles.nextBtn,{backgroundColor:props.color.primaryColor}]} onPress={nextPage}>
                    Select Client
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

const styles = StyleSheet.create({
    singleTimeEndSlot: {
        borderWidth: 1,
        padding: 10,
        color: "#333",
        fontSize: 16,
        borderColor: "#f2f2f2",
    },
    pressable: {
        borderWidth: 2
    },
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-around",

    },
    btnContainer: {
        flex: 1,
        padding: 10,
        //backgroundColor:"teal",
        alignItems: "flex-end",
        justifyContent: "center"
    },
    appointmentHeadline: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: "center",
        fontWeight:"bold"
    },
    nextBtn: {
        width: wp('90%'),
        marginRight: 10
    },
    serviceViewWrapper: {
        paddingVertical: 20,
        //backgroundColor:"yellow",
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    serviceContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "red"
    },
    singleService: {
        marginHorizontal: 10,
        justifyContent: "space-around",
        alignItems: "center",
    },

    serviceImage: {
        width: wp('30'),
        height: wp('30'),
        resizeMode: "cover",
        borderRadius: wp('30') / 2,
        borderColor: "#f2f2f2",
        borderWidth: 2,
        marginBottom: 5,
    },
    timeSlotView: {
        paddingVertical: 20,
        justifyContent: "center",
        alignItems: "center",
        padding: 20
        //backgroundColor:"green"
    },
    singleTimeSlot: {
        padding: 5,
        paddingHorizontal: 15,
        marginHorizontal: 10,
        alignSelf: "center",
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    singleTimeSlotText: {
        color: "white",
        fontSize: 16
    },
})