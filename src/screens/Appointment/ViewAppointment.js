import React, { useState, useEffect } from 'react';
import { View, Text,  StyleSheet, Image, } from 'react-native';
import { connect, useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../actions';
import { AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FAB, Portal } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { getAppointment } from '../../actions/appoinmentsActions';
import DateTimePicker from '@react-native-community/datetimepicker';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { FlatList } from 'react-native-gesture-handler';



var moment = require('moment');

function SingleAgendaView({ data }) {

    return (
        <View style={styles.singleAgenda}>
            <View style={styles.dateArea}>
                <Text style={styles.dateText} >{moment(data.date).format('DD')}</Text>
                <Text style={styles.dateText}>{moment(data.date).format('MMMM')}</Text>
            </View>
            <View >
                <Text style={styles.agendaTime}>{data.start_time} - {data.end_time}</Text>
                <Text style={styles.agendaName}>{data.client.name}</Text>
                <Text style={styles.agendaServices}>{data.service[0].name}</Text>
            </View>
            <View >
                <Image source={{ uri: data.service[0].img }} style={styles.agendaImage} />
            </View>
        </View>
    );
}

function ViewAppointment(props) {

    const dispatch = useDispatch()
    const { appointment } = useSelector(state => state.AppointmentReducer)
    const { token, user } = useSelector(state => state.Auth)

    const isFocused = useIsFocused();
    const [showAppointment, setShowAppointment] = useState([]);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());

    const [fabOpen, setFabOpen] = useState(false);
    const _onStateChange = () => setFabOpen(!fabOpen);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    useEffect(() => {
        if (token !== null) {
            dispatch(getAppointment(token, moment(date).format('Y-MM-DD')))
        }
    }, [date])

    useEffect(() => {
        if (appointment.data) {
            setShowAppointment(appointment.data.filter((a) => a.date === moment(date).format('Y-MM-DD')))
        }
    }, [appointment, date])


    return (
        <View style={styles.container}>
            {isFocused && (<Portal>
                <FAB.Group
                    open={fabOpen}
                    visible={true}
                    style={styles.fabGroup}
                    fabStyle={[{ backgroundColor: props.color.secondaryColor }, styles.addBtnContainer]}
                    icon={fabOpen ? 'calendar-today' : 'plus'}
                    actions={
                        user.role === 3 ? [
                            { icon: 'calendar-remove', label: 'Add Unavailability', onPress: () => { props.navigation.navigate('Appointment', { screen: "AddUnavailability" }) } },
                            { icon: 'calendar-edit', label: 'Update Appointment', onPress: () => { props.navigation.navigate('Appointment', { screen: "UpdateAppointment" }) } },
                            { icon: 'plus', label: 'Add Appointment', onPress: () => { props.navigation.navigate('Book', { screen: "AddAppointment" }) } },
                        ] : [
                            { icon: 'plus', label: 'Add Appointment', onPress: () => { props.navigation.navigate('Book', { screen: "AddAppointment" }) } },
                            { icon: 'calendar-edit', label: 'Update Appointment', onPress: () => { props.navigation.navigate('Appointment', { screen: "UpdateAppointment" }) } },
                        ]
                    }
                    onStateChange={_onStateChange}
                    onPress={() => {
                        if (fabOpen) {
                            // do something if the speed dial is open
                        }
                    }}
                />
            </Portal>)}
            <View style={{ ...styles.datePickerContainer }}>
                <Pressable onPress={() => setShow(true)} style={[styles.datepicker, { borderColor: props.color.primaryColor }]} >
                    <AntDesign name='calendar' color={props.color.primaryColor} style={{ marginRight: 10 }} size={20} />
                    <Text style={[styles.dateText, { color: props.color.primaryColor, }]}>
                        {moment(date).format('DD MMM YYYY')}
                    </Text>
                </Pressable>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={'date'}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                )}
            </View>
            <View style={{ ...styles.datePickerContainer, marginTop: 20 }}>
                <FlatList
                    data={showAppointment}
                    renderItem={({ item }) => <SingleAgendaView data={item} />}
                    keyExtractor={(item, idx) => `${idx}`}
                />
            </View>
            {
                showAppointment.length === 0 &&
                <View style={styles.nodata}>
                    <AntDesign name='calendar' style={{ marginRight: 10 }} size={30} color="#FFC000" />
                    <Text style={[styles.agendaName, { color: "#FFC000" }]}>No Appointment for this date </Text>
                </View>
            }
        </View>
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
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewAppointment)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
  
    nodata:{
        marginTop:50,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    datePickerContainer: {
        width: wp('100%'),
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    datepicker: {
        borderWidth: 1,
        width: wp('70%'),
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        marginTop: 20,
        borderRadius: 20
    },
    dateArea: {
        marginRight: 10,
        },
    dateText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFC000"
    },
    singleAgenda: {
        backgroundColor: "#fff",
        padding: 10,
        flexGrow: 1,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

    },
   
    agendaData: {
        flex: 1,
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    agendaTime: {
        fontSize: 14,
        color: "#424242"
    },
    agendaName: {
        fontSize: 18,
        color: "#424242"
    },
    agendaServices: {
        fontSize: 14
    },
  
    agendaImage: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        borderWidth: 1,
        borderColor: "#f2f2f2"
    },
    addBtnContainer: {
        marginBottom: 40,
        zIndex: 100,
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
   
   
    fabGroup: {
        paddingBottom: 50
    },

});
