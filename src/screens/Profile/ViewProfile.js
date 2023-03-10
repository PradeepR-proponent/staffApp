import * as React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Pressable,
    TextInput,
    Image, ToastAndroid
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { FontAwesome5 } from "react-native-vector-icons";
import * as ImagePicker from 'expo-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import * as FileSystem from 'expo-file-system';
import { connect, useDispatch, useSelector } from "react-redux";
import { baseURL } from '../../constants'
import axios from "axios";
import { RadioButton } from 'react-native-paper';
import { LoadUser, setUser } from "../../actions";





async function UpdateProfile(data, token) {
    try {
        return await axios.post(`${baseURL}/staff/updateProfile`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    } catch (error) {
        return error?.response
    }
}

async function UpdateProfileData(userToken, data) {
    try {
        return await axios.post(`${baseURL}/staff/update`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Authorization': `Bearer ${userToken}`
            }
        });
    } catch (error) {
        return error.response
    }
}




function Profile(props) {


    const dispatch = useDispatch()
    const { user, token } = useSelector(state => state.Auth)
    const [isLoading, setIsLoading] = React.useState(false)
    const [image, setImage] = React.useState(null);
    const [first_name, onChangeFirstName] = React.useState(null)
    const [email, onChangeEmail] = React.useState(null)
    const [gender, setGender] = React.useState('Male')
    const [phone, onChangePhone] = React.useState('');

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });
        if (!result.cancelled) {
            // uri: Platform.OS === 'android' ? result.uri : result.uri.replace('file://', '')
            const profile = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
            UpdateProfile(profile, token).then((response) => {
                if (response?.status == 200) {
                    dispatch(setUser(response.data.data))
                    ToastAndroid.show("Profile Picture Updated Successfully", ToastAndroid.SHORT)
                }
            }).catch((error) => {
                console.log(error.response)
            })
        }
    }
    // return
    // dispatch(LoadUser(token))

    const UpdateMyProfile = () => {
        if (!first_name) {
            console.log('Please enter first name')
            return
        }

        if (!email) {
            console.log('Please enter email id.')
            return
        }

        if (!gender) {
            console.log('Please select your gender')
            return
        }

        if (!phone) {
            console.log(`Enter phone number`);
            return
        }

        const data = {
            name: first_name,
            email: email,
            phone: phone,
            gender: gender,
        }
        setIsLoading(true)
        UpdateProfileData(token, data).then(async (response) => {
            setIsLoading(false)
            if (response?.status == 200) {
                dispatch(setUser(response.data.data))
                ToastAndroid.show("Profile Updated Successfully", ToastAndroid.SHORT)
            } else {
                console.log('Please fill all required fields.')
            }
        }).catch((error) => {

            console.log(error)
        })
    }

    React.useEffect(() => {
        if (user) {
            onChangeEmail(user.email)
            onChangePhone(user.phone)
            onChangeFirstName(user.name)
            setGender(user.gender)
        }
    }, [user])
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollStyle}>
                <Spinner
                    visible={isLoading}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
                <View style={[styles.headerBacground, { backgroundColor: props.color.primaryColor }]}>
                    <Pressable onPressIn={pickImage}  >
                        <View style={styles.picoutline}>
                            <Image
                                resizeMode="cover"
                                style={styles.pic}
                                source={image ? image : { uri: user.staff_profile }}
                            />
                        </View>
                    </Pressable>
                    <Pressable onPressIn={pickImage} style={styles.editIcon}>
                        <FontAwesome5 name="user-edit" style={styles.camera} />
                    </Pressable>
                </View>
                <View style={styles.MasterView}>
                    <View style={styles.serviceCol}>
                        <View style={styles.from}>
                            <View style={styles.from_group}>
                                <Icon
                                    style={styles.icons}
                                    size={16}
                                    color="#70757a"
                                    name="user"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor="#70757a"
                                    placeholder="First Name"
                                    value={first_name}
                                    onChangeText={onChangeFirstName}
                                />
                            </View>

                            <View style={styles.from_group}>
                                <Icon
                                    style={styles.icons}
                                    size={16}
                                    color="#70757a"
                                    name="at-sign"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor="#70757a"
                                    placeholder="Email Id"
                                    value={email}
                                    onChangeText={onChangeEmail}
                                />
                            </View>
                            <View style={styles.from_group}>
                                <Icon
                                    style={styles.icons}
                                    size={16}
                                    color="#70757a"
                                    name="phone"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor="#70757a"
                                    placeholder="Contact No."
                                    value={phone}
                                    onChangeText={onChangePhone}
                                />

                            </View>


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


                        </View>
                        <Pressable onPressIn={UpdateMyProfile} style={[styles.button, { backgroundColor: props.color.primaryColor }]} disabled={isLoading}>
                            <Text style={styles.buttonText}>Save</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile)


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    camera: {
        position: "absolute",
        top: -40,
        right: -60,
        fontSize: 20,
        color: '#FFD700',
        borderRadius: 30,
        padding: 8,
        backgroundColor: "#fff",
    },
    editIcon: {
        position: "relative",
    },
    inputWrapper: {
        flex: 3
    }, gender: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "white",
        padding: 10
    },
    MasterView: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    serviceCol: {
        width: "100%",
        padding: 10,
    },
    scrollStyle: {
        height: "auto",
    },
    pic: {
        height: 120,
        width: 120,
        borderRadius: 100
    },
    picoutline: {
        height: 130,
        width: 130,
        backgroundColor: "#ffffff",
        borderRadius: 110,
        padding: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        marginLeft: 'auto',
        marginRight: 'auto',
        overflow: 'hidden',
        position: "relative",

    },
    userName: {
        fontSize: 16,
        color: 'black',
        marginTop: 15,
        marginBottom: 5,
        width: "100%",
        textAlign: "center",
        fontWeight: "bold"
    },
    from: {
        marginVertical: 10,
    },
    from_group: {
        position: "relative",
        marginBottom: 15,
        borderBottomWidth: 1,
        borderColor: "#70757a",
    },
    input: {
        fontSize: 16,
        color: "#70757a",
        width: "100%",
        paddingLeft: 35,
        paddingBottom: 5
    },
    icons: {
        position: "absolute",
        left: 5,
        top: 6,
    },
    icon: {
        position: "absolute",
        left: -25,
        top: 6,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: "#70757a",
        paddingLeft: 5,
        paddingBottom: 5,
    },
    button: {
        backgroundColor: '#FFD700',
        width: 150,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingVertical: 5,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 16,
        color: "black",
        marginTop: 1,
        marginBottom: 5,
        width: "100%",
        textAlign: "center",
    },
    headerBacground: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    spinnerTextStyle: {
        color: '#FFF'
    }
});
