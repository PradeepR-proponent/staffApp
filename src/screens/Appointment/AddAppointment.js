import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Pressable, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { connect, useDispatch, useSelector } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Headline, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { addAppointment } from '../../actions/appoinmentsActions';
import { useEffect } from 'react';
import { getStaffs } from '../../actions/appDataActions';

const staffData = [
    {
        id: 1,
        image: require('../../../assets/staff.png'),
        name: "Jones"
    },
    {
        id: 4,
        image: require('../../../assets/staff.png'),
        name: "Roul"
    },
    {
        id: 2,
        image: require('../../../assets/staff.png'),
        name: "Natasha"
    }, {
        id: 3,
        image: require('../../../assets/staff.png'),
        name: "Jenifer"
    }

]

var moment = require('moment');

function AddAppointment(props) {

    const dispatch = useDispatch();
    const { user, token, loading, } = useSelector(state => state.Auth)
    const { staffs } = useSelector(state => state.AppData)

    const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [selectedStaff, setSelectedStaff] = useState({})

    const nextPage = () => {
        if (!staffData || !date) return
        const appointmentData = { staff: Object.keys(selectedStaff).length !== 0 ? selectedStaff : user, date: date, }
        props.navigation.navigate('SelectServiceAndTime', { appointmentData })
    }

    const getAllStaff = (userToken, currentDate) => {
        dispatch(getStaffs(userToken, currentDate))
    }

    useEffect(() => {
        getAllStaff(token, date)
    }, [date])




    return (
        <ScrollView style={styles.container}>
            <View style={{ ...styles.calendarView, marginTop: user.role == 1 || user.role == 2 ? 10 : 50 }}>
                <Headline style={styles.appointmentHeadline}>Choose Appointment Date</Headline>
                <Calendar

                    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                    minDate={new Date()}
                    // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                    maxDate={'2067-05-30'}
                    // Handler which gets executed on day press. Default = undefined
                    onDayPress={(day) => {
                        let date = moment(new Date(day.timestamp)).format('YYYY-MM-DD');
                        setDate(date);
                    }}
                    // Handler which gets executed on day long press. Default = undefined
                    onDayLongPress={(day) => { console.log(day) }}
                    // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                    monthFormat={'MMMM yyyy'}
                    // Handler which gets executed when visible month changes in calendar. Default = undefined
                    onMonthChange={(month) => { console.log('month changed', month) }}
                    // Hide month navigation arrows. Default = false
                    hideArrows={false}
                    // Replace default arrows with custom ones (direction can be 'left' or 'right')
                    //renderArrow={(direction) => (<Arrow/>)}
                    // Do not show days of other months in month page. Default = false
                    hideExtraDays={true}
                    // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                    // day from another month that is visible in calendar page. Default = false
                    disableMonthChange={true}
                    // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                    firstDay={1}
                    // Hide day names. Default = false
                    hideDayNames={false}
                    // Show week numbers to the left. Default = false
                    showWeekNumbers={false}
                    // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                    onPressArrowLeft={substractMonth => substractMonth()}
                    // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                    onPressArrowRight={addMonth => addMonth()}
                    // Disable left arrow. Default = false
                    disableArrowLeft={false}
                    // Disable right arrow. Default = false
                    disableArrowRight={false}
                    // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                    disableAllTouchEventsForDisabledDays={true}

                    markedDates={{
                        [date]: { selected: true },
                    }}

                    theme={{
                        backgroundColor: '#ffffff',
                        calendarBackground: '#ffffff',
                        textSectionTitleColor: '#b6c1cd',
                        textSectionTitleDisabledColor: '#d9e1e8',
                        selectedDayBackgroundColor: props.color.primaryColor,
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: props.color.primaryColor,
                        dayTextColor: '#2d4150',
                        textDisabledColor: '#d9e1e8',
                        dotColor: '#00adf5',
                        selectedDotColor: '#ffffff',
                        arrowColor: 'orange',
                        disabledArrowColor: '#d9e1e8',
                        monthTextColor: props.color.primaryColor,
                        indicatorColor: props.color.primaryColor,
                        textDayFontFamily: 'monospace',
                        textMonthFontFamily: 'monospace',
                        textDayHeaderFontFamily: 'monospace',
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 16
                    }}
                />
            </View>


            {loading &&
                <Text>Loading ....</Text>

            }

            {user.role == 1 || user.role == 2 ? (<View style={styles.staffViewWrapper}>
                <Headline style={[styles.appointmentHeadline]}>Available Staff</Headline>
                <ScrollView contentContainerStyle={styles.staffContainer} horizontal={true} showsHorizontalScrollIndicator={false}>
                    {
                        staffs?.map((data, idx) => <Pressable key={idx} onPress={() => setSelectedStaff(data)} >
                            <View style={[styles.singleStaffWrapper, { borderColor: selectedStaff.id === data.id ? props.color.primaryColor : "lightgray", borderWidth: selectedStaff.id === data.id ? 2 : 1 }]}>
                                <Image style={styles.staffImage} source={{ uri: data.pic }} />
                                <Text style={styles.staffText}>{data.name}</Text>
                            </View>
                        </Pressable>)
                    }
                </ScrollView>
            </View>) : null
            }
            <View style={{ ...styles.btnContainer, marginTop: user.role == 1 || user.role == 2 ? 0 : 100 }}>
                <Button icon="chevron-right"  mode="contained" style={[styles.nextBtn,{backgroundColor:props.color.primaryColor}]}
                    onPress={nextPage}>
                    Select Service and time
                </Button>
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
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAppointment)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    appointmentHeadline: {
        fontSize: 16,
        margin: 0,
        textAlign: "center",
        fontWeight:"bold"
    },
    calendarView: {
        backgroundColor: "white"
    },
    staffViewWrapper: {
        paddingVertical: 10
    },
    staffContainer: {
        alignItems: "center",
        justifyContent: "space-between",
    },
    singleStaffWrapper: {
        backgroundColor: "white",
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 3,
        justifyContent: "space-around",
        alignItems: "center",
        padding: 20,
    },
    staffImage: {
        width: wp('20'),
        height: wp('20'),
        resizeMode: "cover",
        borderRadius: 70 / 2,
        borderColor: "#f2f2f2",
        borderWidth: 2,
        marginBottom: 20,
    },
    staffText: {
        color: "#000",
    },
    btnContainer: {
        flex: 1,
        paddingHorizontal: 10,
        padding: 10,
        alignItems: "center"
    },
    nextBtn: {
        width: wp('90%')
    }
})
