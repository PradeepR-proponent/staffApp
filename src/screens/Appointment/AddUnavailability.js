import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, FlatList, TextInput, ToastAndroid
} from 'react-native';
import { connect, useDispatch, useSelector } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Button, List } from 'react-native-paper';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { baseURL } from '../../constants'
import axios from 'axios';
import { getUnavailability } from '../../actions/appDataActions';
import { AntDesign } from '@expo/vector-icons'

const Item = (props) => {
    return (
        <List.Item
            title={props.title}
            style={{ backgroundColor: "whitesmoke", borderColor: "lightgray", borderWidth: 1, margin: 10 }}
            descriptionStyle={{ marginTop: 10 }}
            // titleStyle={{color:"white"}}
            description={props.description}
            left={props => <List.Icon {...props} icon="clock-outline" />}
        // right={props => <TouchableOpacity icon="close"  mode="contained" onPress={() => console.log('Pressed')}>
        //     <List.Icon {...props} color="#c41c00" icon="close-circle-outline" />
        // </TouchableOpacity>}
        />
    );
}


function AddUnavailability(props) {


    const dispatch = useDispatch()
    const { token, user } = useSelector(state => state.Auth)
    const { holidays } = useSelector(state => state.AppData)
    //function states
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [remark, setRemark] = useState('');
    const [loading, setLoading] = useState(false);
    const [holiday, setAddholiday] = useState(false);
    const [error, setError] = useState('');

    const onChange = (event, selectedDate) => {
        setShow(Platform.OS === 'ios');
        setDate(selectedDate);
    };

    const updateAppointments = async (userToken, holidayData) => {
        try {
            const config = {
                method: 'post',
                url: `${baseURL}/staff/holiday`,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Authorization': `Bearer ${userToken}`,
                    'Connection': `keep-alive`
                },
                data: holidayData
            }
            const { data } = await axios(config)
            if (data.status) {
                setLoading(false)
                dispatch(getUnavailability(token))
                setAddholiday(false)
                setRemark("")
            }
            if (data.errors) {
                setLoading(false)
                ToastAndroid.show(data.errors, ToastAndroid.SHORT)
                return
            }
        } catch (error) {
            setLoading(false)
            ToastAndroid.show("Server not responding", ToastAndroid.SHORT)
        }
    }


    const addAppointment = () => {
        if (moment(date).format("Y-M-D") === moment(new Date()).format("Y-M-D")) {
            ToastAndroid.show("You can't be off today", ToastAndroid.SHORT)
            return
        }
        setLoading(true)
        setError("")
        updateAppointments(token, { staff_id: user.id, date: moment(date).format("Y-M-D"), remark })
    }

    useEffect(() => {
        const getStaffHolidays = () => {
            dispatch(getUnavailability(token))
        }
        getStaffHolidays()
    }, [])

    const handleGoback = () => {
        setRemark("")
        setAddholiday(!holiday)
    }
    return (
        <View style={styles.container}>
            <View style={styles.btns} >
                {!holiday && <Text style={styles.holidayTitle}>My Holidays</Text>}
                <View style={{ width: 150 }}>
                    <Button icon={() => <AntDesign name={holiday ? 'left' : "plus"} color={"#ffffff"} />} mode="contained"
                        onPress={handleGoback} contentStyle={{}} style={{ backgroundColor: props.color.secondaryColor }}>
                        {!holiday ? "Add New" : " Go Back"}
                    </Button>
                </View>
            </View>

            {!holiday && <View style={styles.unavailabilityList}>
                {error !== "" && <View style={styles.updationBtnContainer}>
                    <Text style={[styles.updationLabel, { color: "red" }]}>{error}</Text>
                </View>}
                <FlatList
                    data={holidays}
                    renderItem={({ item }) => <Item title={item.remark} date={item.date} description={item.date} id={item.id} />}
                    keyExtractor={item => `${item.id}`}
                />
            </View>
            }

            {
                holiday &&
                <View style={styles.addUnavailability}>
                    <Text style={styles.updationLabel}>Select Date :</Text>
                    <View style={styles.datePickerContainer}>
                        <Button icon="calendar" mode="outlined" onPress={() => { setShow(true) }} labelStyle={[styles.datePickerLabelStyle, { color: props.color.secondaryColor }]} contentStyle={styles.datePickerBtnContent} style={[styles.datePickerBtnStyle, { borderColor: props.color.secondaryColor }]}>
                            {moment(date).format('DD MMM YYYY')}
                        </Button>
                        {show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={'date'}
                                is24Hour={true}
                                display="default"
                                onChange={onChange}
                                minimumDate={new Date()}
                            />
                        )}

                    </View>
                    <Text style={styles.updationLabel}>Remark :</Text>
                    <View >
                        <TextInput
                            label='Remark'
                            value={remark}
                            onChangeText={text => setRemark(text)}
                            theme={{ colors: { primary: props.color.secondaryColor } }}
                            style={[styles.inputBox, { borderColor: props.color.secondaryColor }]}
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                    {!loading ? <View style={styles.updationBtnContainer}>
                        <Button icon="plus" mode="contained" onPress={addAppointment} contentStyle={{}} style={{ backgroundColor: props.color.secondaryColor }}>
                            Add
                        </Button>
                    </View> : <Text style={styles.updationLabel}>Please Wait</Text>}
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
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUnavailability)

const styles = StyleSheet.create({

    btns: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        width: "100%"
    },

    holidayTitle: {
        fontWeight: "bold",
        fontSize: 20
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "space-around",
    },
    inputBox: {
        marginTop: 20,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10
    },
    addUnavailability: {
        flex: 1,
        padding: 20,
    },
    datePickerContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    datePickerBtnContent: {
        justifyContent: "space-around",
    },
    datePickerBtnStyle: {
        width: wp('90%'),
        borderWidth: 1
    },
    datePickerLabelStyle: {
        fontSize: 18
    },
    updationDataInnerContainer: {
        justifyContent: "space-around",
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        paddingHorizontal: 20
    },

    updationLabel: {
        color: "#333"
    },
    updationData: {
        flex: 1
    },
    unavailabilityList: {
        flex: 1
    },
    updationBtnContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        flex: 1,
        alignItems: "center",
    },
});