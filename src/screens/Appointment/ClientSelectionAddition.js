
import React, { useState, useEffect } from 'react';
import {
    View, Text, ScrollView, StyleSheet,
    Pressable, ToastAndroid
} from 'react-native';
import { connect, useDispatch, useSelector } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Headline, Button, TextInput, RadioButton } from 'react-native-paper';
import PhoneInput from "react-native-phone-number-input";
import { getClients } from '../../actions/appDataActions';
import { baseURL } from '../../constants'
import axios from 'axios';





function AddAppointment(props) {

    const dispatch = useDispatch()
    const { token } = useSelector(state => state.Auth)
    const { clients } = useSelector(state => state.AppData)

    const otherPageData = props.route.params.appointmentData;
    const [show, setShow] = React.useState(false);
    const [addClient, setAddclient] = React.useState(false);

    //new client details
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, onChangePhone] = React.useState("");
    const [result, setResult] = React.useState(null);
    const [phoneCountry, setPhoneCountry] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [gender, setGender] = React.useState("Male");



    const getClient = (userToken, phone) => {
        dispatch(getClients(userToken, phone))
    }

    const handleResult = (data) => {
        setResult(data)
        setShow(false)
    }

    const handleAddClient = () => {
        const obj = {
            first_name: firstname,
            last_name: lastname,
            gender: gender,
            country_code: phoneCountry.cca2 ? phoneCountry["cca2"] : "1",
            dial_code: phoneCountry.callingCode ? phoneCountry.callingCode[0] : "CA",
            phone: phone,
            email: email
        }
        addNewClient(token, obj)
    }

    const addNewClient = async (userToken, clientData) => {
        setLoading(true)
        setError("")
        try {
            const config = {
                method: 'post',
                url: `${baseURL}/staff/client`,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Authorization': `Bearer ${userToken}`,
                    'Connection': `keep-alive`
                },
                data: clientData
            }
            const { data } = await axios(config)
            if (data.status) {
                setLoading(false)
                ToastAndroid.show('Client added successfully!', ToastAndroid.SHORT);
                const summary = { ...otherPageData, client: data.client_details }
                props.navigation.navigate('AppointmentSummary', { summary })

            }
        } catch (error) {
            setLoading(false)
            ToastAndroid.show('Server not responding!', ToastAndroid.SHORT);
        }
    }

    useEffect(() => {
        getClient(token, phone)
    }, [phone])

    useEffect(() => {
        if (error != "") {
            ToastAndroid.show(error, ToastAndroid.SHORT);
        }
    }, [error])

    useEffect(() => {
        if (phone !== "" && clients?.length > 0) {
            setShow(true)
        } else { setShow(false) }

        setResult(null)
    }, [phone])

    useEffect(() => {
        if (result !== null) {
            setFirstname(result.first_name)
            setLastname(result.last_name)
            setEmail(result.email)
        }
    }, [result])

    useEffect(() => {
        if (clients?.length === 0) {
            setResult(null)
            setFirstname("")
            setLastname("")
            setEmail("")
            setAddclient(true)
        } else {
            setAddclient(false)
        }
    }, [result, phone, clients])

    const nextPage = () => {
        const summary = { ...otherPageData, client: result }
        props.navigation.navigate('AppointmentSummary', { summary })
    }





    return (
        <ScrollView style={styles.container}>
            <View style={styles.existingClientContainer}>
                <Headline style={styles.appointmentHeadline}>{addClient ? 'Add Client' : "Choose Existing Client"}</Headline>
                {/* <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedClient}
                        style={styles.dataPicker}
                        onValueChange={(itemValue, itemIndex) => setSelectedClient(itemValue)}>
                        {
                            clients?.map((data, idx) => <Picker.Item key={idx} label={`${data.first_name} ${data.last_name}`} value={data} />)
                        }
                    </Picker>
                    <View style={styles.additionBtn}>
                        <TouchableOpacity onPress={() => { setAddClient(!addClient) }} style={{ backgroundColor: "black", width: 40, height: 40, borderRadius: 40 / 2 }}>
                            <Text style={{ fontSize: 30, textAlign: "center", color: "white" }}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View> */}

            </View>
            <View style={styles.newClientContainer}>
                <View style={styles.addClientContainer}>
                    <View style={styles.inputWrapper}>
                        <View style={styles.phoneContainer} >
                            <PhoneInput
                                value={phone}
                                defaultCode="CA"
                                layout="first"
                                onChangeText={(text) => onChangePhone(text)}
                                onChangeCountry={(country) => setPhoneCountry(country)}
                                containerStyle={styles.phoneContainerStyle}
                                textInputStyle={styles.textInputStyle}
                                codeTextStyle={styles.codeTextStyle}
                                theme={{ colors: { primary: props.color.secondaryColor } }}
                            />
                        </View>
                        {show && <View style={styles.clientResult} >
                            {
                                clients?.map((data, idx) => <Pressable key={idx} onPress={() => handleResult(data)} >
                                    <Text style={styles.resultText}>{data.first_name} {data.last_name} ({data.phone}) </Text>
                                </Pressable>
                                )}
                        </View>}
                        {
                            !show && result !== null &&
                            <View>
                                {/* <TextInput
         label='Mobile'
         value={mobile}
         style={styles.addClientInput}
         onChangeText={text => { setMobile(text) }}
         theme={{ colors: { primary: props.color.secondaryColor } }}
     /> */}
                                <TextInput
                                    label='First name'
                                    value={firstname}
                                    style={styles.addClientInput}
                                    onChangeText={text => { setFirstname(text) }}
                                    theme={{ colors: { primary: props.color.secondaryColor } }}
                                />
                                <TextInput
                                    label='Last name'
                                    value={lastname}
                                    style={styles.addClientInput}
                                    onChangeText={text => { setLastname(text) }}
                                    theme={{ colors: { primary: props.color.secondaryColor } }}
                                />
                                <TextInput
                                    label='Email'
                                    value={email}
                                    style={styles.addClientInput}
                                    onChangeText={text => { setEmail(text) }}
                                    theme={{ colors: { primary: props.color.secondaryColor } }}
                                />

                                {/* <TextInput
         label='Address'
         value={address}
         style={styles.addClientInput}
         onChangeText={text => { setAddress(text) }}
         theme={{ colors: { primary: props.color.secondaryColor } }}
     /> */}
                            </View>
                        }

                        {addClient &&

                            <View>
                                {/* <TextInput
     label='Mobile'
     value={mobile}
     style={styles.addClientInput}
     onChangeText={text => { setMobile(text) }}
     theme={{ colors: { primary: props.color.secondaryColor } }}
 /> */}
                                <TextInput
                                    label='First name'
                                    value={firstname}
                                    style={styles.addClientInput}
                                    onChangeText={text => { setFirstname(text) }}
                                    theme={{ colors: { primary: props.color.secondaryColor } }}
                                />
                                <TextInput
                                    label='Last name'
                                    value={lastname}
                                    style={styles.addClientInput}
                                    onChangeText={text => { setLastname(text) }}
                                    theme={{ colors: { primary: props.color.secondaryColor } }}
                                />
                                <TextInput
                                    label='Email'
                                    value={email}
                                    style={styles.addClientInput}
                                    onChangeText={text => { setEmail(text) }}
                                    theme={{ colors: { primary: props.color.secondaryColor } }}
                                />
                                <View style={[styles.inputWrapper, styles.gender]}>
                                    <Text>Gender :</Text>

                                    <RadioButton
                                        value={gender}
                                        status={gender === 'Male' ? 'checked' : 'unchecked'}
                                        onPress={() => setGender('Male')}
                                        color={props.color.primaryColor}
                                    />
                                    <Text>Male</Text>
                                    <RadioButton
                                        value={gender}
                                        status={gender === 'Female' ? 'checked' : 'unchecked'}
                                        onPress={() => setGender('Female')}
                                        color={props.color.primaryColor}

                                    />
                                    <Text>Female</Text>

                                </View>
                                {/* <TextInput
     label='Address'
     value={address}
     style={styles.addClientInput}
     onChangeText={text => { setAddress(text) }}
     theme={{ colors: { primary: props.color.secondaryColor } }}
 /> */}


                                {!loading && <View style={styles.additionBtnContainer}>
                                    <Button icon="check-all" mode="contained" onPress={handleAddClient} contentStyle={{}} style={{ backgroundColor: props.color.secondaryColor }}>
                                        Add
                                    </Button>
                                    <Button icon="close-circle-outline" mode="contained" onPress={() => { setAddClient(!addClient) }} contentStyle={{}} style={{ backgroundColor: props.color.secondaryColor }}>
                                        Close
                                    </Button>
                                </View>}
                                {loading && <View style={styles.additionBtnContainer}><Headline style={styles.appointmentHeadline}>Please Wait</Headline>
                                </View>
                                }

                            </View>
                        }
                    </View>
                </View>
            </View>

            {!addClient && <View style={styles.btnContainer}>
                <Button icon="chevron-right"  mode="contained" style={[styles.nextBtn,{backgroundColor:props.color.primaryColor}]}
                    onPress={nextPage}>
                    Continue to summary
                </Button>
            </View>}
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
        flex: 1
    },
    phoneContainer: {
        backgroundColor: "white",
        width: wp('100%'),
        position: "relative",
        zIndex: 20

    },
    gender: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "white",
        padding: 10
    },
    resultText: {
        fontSize: 14,
        width: wp('100%'),
        padding: 10,
        textAlign: 'center',
        borderColor: "lightgray",
        borderWidth: 0.5,
        zIndex: 10
    },
    clientResult: {
        fontSize: 14,
        textAlign: 'right',
        width: wp('100%'),
        backgroundColor: "white",
    },
    phoneContainerStyle: {
        backgroundColor: "white",
        borderBottomWidth: 0.5,
        width: wp('100%'),
        marginBottom: 20,
        borderColor: "lightgray"

    },
    appointmentHeadline: {
        fontSize: 16,
        margin: 0,
        textAlign: "center",
        fontWeight:"bold"
    },

    codeTextStyle: {
        fontSize: 16,
        height: 20,
        top: -2,
        color: '#000000',
    },
    existingClientContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    pickerContainer: {
        flexDirection: "row",
        alignItems: "center",

    },
    newClientContainer: {
        flex: 4,
        paddingTop: 20
    },
    addClientContainer: {
        flex: 1
    },
    dataPicker: {
        width: wp('100%'),
        backgroundColor: "white",


    },
    inputWrapper: {
        flex: 3
    },
    additionBtnContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: 20
    },
    addClientInput: {
        backgroundColor: "white"
    },
    btnContainer: {
        flex: 1,
        paddingHorizontal: 10,
        padding: 10,
        alignItems: "center",
    },
    nextBtn: {
        width: wp('90%')
    }
})