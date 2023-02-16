import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, Image, StyleSheet, ToastAndroid } from 'react-native';
import { TextInput, Headline, Button, } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { connect, useDispatch, useSelector } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { toggleTheme, saveUserToken, userLogin } from '../../actions';

function Home(props) {

    const dispatch = useDispatch();
    const { error, isAuthenticated } = useSelector(state => state.Auth)

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rightIcon, setRightIcon] = useState('eye')
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [err, setError] = useState('');


    const handlePasswordVisibility = () => {
        if (rightIcon === 'eye') {
            setRightIcon('eye-off');
            setPasswordVisibility(!passwordVisibility);
        } else if (rightIcon === 'eye-off') {
            setRightIcon('eye');
            setPasswordVisibility(!passwordVisibility);
        }
    };

    const logInUser = () => {
        setError("")
        dispatch(userLogin({ email: username, password: password }))
    }

    const handleNextPage = () => {
        setError("")
        props.navigation.navigate('ForgetPassword', { email: username })
    }

    useEffect(() => {
        if (error?.user) {
            setUsername(error.user.email)
            setError("Invalid Credentials")
        }

    }, [error])


    useEffect(() => {
        if (isAuthenticated) {
            ToastAndroid.show('Logged in successfully!', ToastAndroid.SHORT);
        }
    }, [isAuthenticated])

    useEffect(() => {
        if (err != "") {
            ToastAndroid.show(err, ToastAndroid.SHORT);
            setError("")
        }
    }, [err])



    const onChangeUserName = (name) => {
        setError("")
        setUsername(name)
    }

    const onPasswordChange = (pass) => {
        setError("")
        setPassword(pass)
    }
    return (
        <ScrollView style={styles.screenWrapper}>
            <StatusBar backgroundColor="white" barStyle={'dark-content'} />
            <View style={styles.imageWrapper}>
                <Image style={styles.topImage} source={require('../../../assets/login.png')} />
            </View>

            <View style={styles.loginWrapper}>

                <Headline style={styles.heading}>Welcome</Headline>
                <TextInput
                    style={styles.loginInput}
                    label='Username'
                    mode='outlined'
                    value={username}
                    onChangeText={onChangeUserName}
                    theme={{ colors: { primary: props.color.primaryColor } }}
                />
                <TextInput
                    style={styles.loginInput}
                    label='Password'
                    mode='outlined'
                    value={password}
                    secureTextEntry={passwordVisibility}
                    right={<TextInput.Icon onPressIn={handlePasswordVisibility} name={rightIcon} />}
                    onChangeText={onPasswordChange}
                    theme={{ colors: { primary: props.color.primaryColor } }}
                />
                <Button labelStyle={styles.labelText} style={[styles.loginBtn,{backgroundColor:props.color.primaryColor} ] } icon="key"
                    mode="contained" onPress={logInUser}>
                    Sign In
                </Button>
                <Button style={[styles.forgetPass,{color:props.color.primaryColor}]} uppercase={false}  mode="text" onPress={handleNextPage}>
                   <Text style={[{color:props.color.primaryColor}]} > Forgot Password? </Text>
                </Button>
            </View>
        </ScrollView>
    );
}



const styles = StyleSheet.create({
    screenWrapper: {
        height: hp('100%'),
        backgroundColor: '#fff',
    },
    heading: {
        marginVertical: 20,
        textAlign: "center",
        fontSize: 30,
    },
    imageWrapper: {
        flex: 1,
        height: hp('30%'),
        width: wp('100%'),
        flexBasis: 0,
    },
    topImage: {
        width: wp('100%'),
        height: hp('30%'),
        resizeMode: "cover",
    },
    loginWrapper: {
        padding: 40,
        height: hp('70%'),
        width: wp('100%'),
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
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
        justifyContent: "center",
        alignItems: "center"
    },
    loginInput: {
        marginVertical: 10,
        width: wp('80%'),
        backgroundColor: "white"
    },
    loginBtn: {
        marginVertical: 10,
        width: wp('80%'),
    },
    forgetPass: {
        padding: 0,
        width: wp('80%'),
    },
    labelText: {
        fontSize: 16,
        flex: 1,
        width: wp('80%'),
    }
});

function mapStateToProps(state) {
    return {
        color: state.Theme.colorData,
        auth: state.Auth,
    }
}

function mapDispatchToProps(dispatch) {
    return ({
        toggleTheme: color => dispatch(toggleTheme(color)),
        saveUserToken: token => dispatch(saveUserToken(token)),
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

