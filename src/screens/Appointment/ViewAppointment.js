import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ImageBackground, StyleSheet, Image, ScrollView } from 'react-native';
import { connect, useDispatch, useSelector } from 'react-redux';
import { toggleTheme, removeUserToken } from '../../actions';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Agenda } from 'react-native-calendars';
import { FAB, Portal } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { getAppointment } from '../../actions/appoinmentsActions';



var moment = require('moment');

function SingleAgendaView({ data }) {

    return (
        <View style={styles.singleAgenda}>
            <View style={styles.agendaData}>
                <View style={styles.singleAgendaData}>
                    <View style={styles.singlAgendaTextData}>
                        <Text style={styles.agendaTime}>{data.start_time} - {data.end_time}</Text>
                        <Text style={styles.agendaName}>{data.client.name}</Text>
                        <Text style={styles.agendaServices}>{data.service[0].name}</Text>
                    </View>
                    <View style={styles.singleAgendaImageData}>
                        <Image source={{ uri: data.service[0].img }} style={styles.agendaImage} />
                    </View>
                </View>
            </View>
        </View>
    );
}

function SingleEmptyAgendaDateView(props) {
    return (
        <View style={styles.singleAgenda}>
            <View style={styles.agendaData}>
                <View style={styles.singleAgendaData}>
                    <View style={styles.singlAgendaTextData}>
                        <Text style={styles.agendaName}>No Appointment for this date </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}



function ViewAppointment(props) {

    const dispatch = useDispatch()
    const { appointment } = useSelector(state => state.AppointmentReducer)
    const { token, user } = useSelector(state => state.Auth)

    const isFocused = useIsFocused();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAppointment, setShowAppointment] = useState([]);


    const [fabOpen, setFabOpen] = useState(false);
    const _onStateChange = () => setFabOpen(!fabOpen);

    useEffect(() => {
        if (token !== null) {
            dispatch(getAppointment(token, moment(selectedDate.dateString).format('Y-MM-DD')))
        }
    }, [selectedDate])

    useEffect(() => {
        if (appointment.data) {
            if (selectedDate.dateString) {
                setShowAppointment(appointment.data.filter((a) => a.date === moment(selectedDate.dateString).format('Y-MM-DD')))
            } else {
                setShowAppointment(appointment.data.filter((a) => a.date === moment(selectedDate).format('Y-MM-DD')))
            }
        }
    }, [appointment, selectedDate])


    return (
        <View style={styles.container}>
            <Text style={[styles.dateheader,{backgroundColor:props.color.primaryColor}]} >{selectedDate?.dateString ? moment(selectedDate.dateString).format('DD MMMM') : moment(selectedDate).format('DD MMMM')}</Text>
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
                            { icon: 'calendar-edit', label: 'Update/Delete Appointment', onPress: () => { props.navigation.navigate('Appointment', { screen: "UpdateAppointment" }) } },
                            { icon: 'plus', label: 'Add Appointment', onPress: () => { props.navigation.navigate('Book', { screen: "AddAppointment" }) } },
                        ] : [
                            { icon: 'plus', label: 'Add Appointment', onPress: () => { props.navigation.navigate('Book', { screen: "AddAppointment" }) } },
                            { icon: 'calendar-edit', label: 'Update/Delete Appointment', onPress: () => { props.navigation.navigate('Appointment', { screen: "UpdateAppointment" }) } },
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

            <Agenda
                // The list of items that have to be displayed in agenda. If you want to render item as empty date
                // the value of date key has to be an empty array []. If there exists no value for date key it is
                // considered that the date in question is not yet loaded

                items={{ [moment(selectedDate.dateString).format('Y-MM-DD')]: showAppointment, }}
                // items={{ [moment(selectedDate.dateString).format('Y-M-D')]: appointment?.data }}
                // Callback that gets called when items for a certain month should be loaded (month became visible)
                loadItemsForMonth={(month) => {
                }}
                // Callback that fires when the calendar is opened or closed
                // onCalendarToggled={(calendarOpened) =>setIsShowing(calendarOpened)}
                // Callback that gets called on day press
                onDayPress={(day) => {
                    setSelectedDate(day)
                }}
                // Callback that gets called when day changes while scrolling agenda list
                onDayChange={(day) => { console.log('day changed') }}
                // Initially selected day
                selected={selectedDate?.timestamp ? selectedDate.timestamp : selectedDate}

                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                minDate={'2020-06-10'}
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                maxDate={'2067-06-30'}
                showsVerticalScrollIndicator={true}
                // enableSwipeMonths={true}
                // renderHeader={date => <Text>hola</Text>   }
                // Max amount of months allowed to scroll to the past. Default = 50
                pastScrollRange={0}
                // Max amount of months allowed to scroll to the future. Default = 50
                futureScrollRange={1}
                // Specify how each item should be rendered in agenda
                renderItem={(item, firstItemInDay) => {
                    return (<SingleAgendaView data={item} />);
                }}
                // Specify how each date should be rendered. day can be undefined if the item is not first in that day.
                renderDay={(day, item) => {
                    let month = selectedDate ? moment(selectedDate.timestamp).format('MMM') : moment(day).format('MMM');
                    const days = selectedDate ? moment(selectedDate.timestamp).format('DD') : moment(day).format('MMM');
                    return (
                        <View style={styles.singleAgendaDate}>
                            <View style={styles.agendaDateData}>
                                <Text style={styles.agendaDateText}>{days}</Text>
                                <Text style={styles.agendaDayText}>{month}</Text>   
                            </View>
                        </View>
                    )
                }}
                // Specify how empty date content with no items should be rendered
                renderEmptyDate={(day) => { return (<SingleEmptyAgendaDateView />); }}
                // Specify how agenda knob should look like
                renderKnob={() => { return (<Ionicons name="ios-arrow-down" size={20} color={"black"} />); }}
                // Specify what should be rendered instead of ActivityIndicator
                renderEmptyData={() => {
                    return (
                        <View style={styles.emptyData}>
                            <Image style={styles.emptyImage} source={require('../../../assets/empty.png')} />
                            <Text style={{ color: props.color.primaryColor }}>No appointment available</Text>
                        </View>
                    );
                }}
                // Specify your item comparison function for increased performance
                rowHasChanged={(r1, r2) => {
                    return r1.text !== r2.text
                }}
                // Hide knob button. Default = false
                hideKnob={false}
                // By default, agenda dates are marked if they have at least one item, but you can override this if needed

                // If disabledByDefault={true} dates flagged as not disabled will be enabled. Default = false
                disabledByDefault={false}
                // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
                onRefresh={() => console.log('refreshing...')}
                // Set this true while waiting for new data from a refresh
                refreshing={false}
                // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView.
                refreshControl={null}
                // Agenda theme
                theme={{
                    calendarBackground: props.color.primaryColor,
                    textSectionTitleColor: '#333',
                    textSectionTitleDisabledColor: '#d9e1e8',
                    selectedDayBackgroundColor: '#ffffff',
                    selectedDayTextColor: props.color.primaryColor,
                    todayTextColor: props.color.secondaryColor,
                    dayTextColor: '#333',
                    textDisabledColor: '#333',
                    dotColor: '#00adf5',
                    selectedDotColor: '#ffffff',
                    arrowColor: 'orange',
                    disabledArrowColor: '#d9e1e8',
                    monthTextColor: 'black',
                    indicatorColor: 'blue',
                    textDayFontWeight: '400',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '300',
                    agendaDayTextColor: '#000',
                    agendaDayNumColor: 'green',
                    agendaTodayColor: 'red',
                    agendaKnobColor: 'blue',
                    'stylesheet.calendar.header': {
                        header: { flexDirection: 'row', justifyContent: 'center', paddingLeft: 0, paddingRight: 0, marginTop: 6, alignItems: 'center' }
                    }
                }}
                // Agenda container style
                style={{
                }}
            />

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
    scrollView: {
        borderWidth: 1

    },
    dateheader: {
        color: "#333",
        textAlign: "center",
        fontWeight:'bold',
        fontSize:16
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

    },
    singleAgendaDate: {
        justifyContent: "space-around",
        padding: 10,
        width: wp('15%')
    },
    agendaDateData: {
        flex: 1,
        alignItems: "center"
    },
    agendaData: {
        flex: 1,
    },
    agendaDateText: {
        fontSize: 25,
        textAlign: "center",
        color: "#424242"
    },
    agendaDayText: {
        fontSize: 14,
        textAlign: "center",
        color: "#424242"
    },
    singleAgendaData: {
        flexDirection: "row",
        justifyContent: "space-between",

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
    singleAgendaImageData: {

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
    emptyData: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    emptyImage: {

        width: wp('30%'),
        height: hp('20%'),
        resizeMode: "contain"
    },
    fabGroup: {
        paddingBottom: 50
    },

});
