import React,{useState} from 'react';
import {View,Text,StatusBar,Image,StyleSheet} from 'react-native';
import {TextInput,Headline,Button} from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { connect,} from 'react-redux';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {toggleTheme,saveUserToken,} from '../../actions';
import { baseURL } from '../../constants'
import axios from 'axios';




function ForgetPassword(props){

    const userName  = props.route.params.email;

const [stepCount, setsteps] = useState(1);
const [email, setEmail] = useState(userName);
const [Otp, setOtp] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [token, setToken] = useState('');
const [newPassword,setNewPassword ] = useState('');
const [confirmPassword,setConfirmPassword ] = useState('');

const [rightIcon, setRightIcon] = useState('eye')
const [confirmIcon,setConfirmIcon ] = useState('eye')
const [passwordVisibility, setPasswordVisibility] = useState(true);
const [confirmVisibility, setConfirmVisibility] = useState(true);

    async function sendOtp ()  {
        setLoading(true)
        setError("")
            try {
                const config = {
                    method: 'POST',
                    url:`${baseURL}/staff/forgotPassword`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Connection':`keep-alive`
                    },
                    data:{email : userName}
                }
                const {data }= await axios.request(config)
                console.log(data)
            if(data.status){
                setToken(data.token)
                setLoading(false)
                setsteps(2)
            }

            } catch (error) {
                setLoading(false)
                setError("Server Not Responding")
            }
    }

    const verifyOtp =async()=>  {
        setLoading(true)
        setError("")
            try {
                const config = {
                    method: 'post',
                    url:`${baseURL}/staff/verifyOTP`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        'Connection':`keep-alive`
                    },
                    data:{otp:Otp}
                }
                const {data }= await axios.request(config)
            if(data.status){
                setLoading(false)
                setsteps(3)
            }

            } catch (error) {
                setLoading(false)
                setError("Invalid OTP")
            }
    }

    const updatePassword=async ()=>{
            try {
                setLoading(true)
                setError("")
                    if(newPassword === confirmPassword){
                        const config = {
                            method: 'post',
                            url:`${baseURL}/staff/changePassword`,
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                                'Accept': '*/*',
                                'Connection':`keep-alive`
                            },
                            data:{
                                "new_password": newPassword,
                                "confirm_password": confirmPassword
                            }
                        }
                        const {data }= await axios.request(config)
                                if(data.status){
                                    setError("")
                                    setLoading(false)
                                    props.navigation.navigate("Login")
                                }
                    }
            } catch (error) {
                setLoading(false)
                setError("Server Not Responding")

            }
    }

    const handlePasswordVisibility = () => {
        if (rightIcon === 'eye') {
          setRightIcon('eye-off');
          setPasswordVisibility(!passwordVisibility);
        } else if (rightIcon === 'eye-off') {
          setRightIcon('eye');
          setPasswordVisibility(!passwordVisibility);
        }
    };

    const handleConfirmPasswordVisibility = () => {
        if (confirmIcon === 'eye') {
            setConfirmIcon('eye-off');
            setConfirmVisibility(!confirmVisibility);
        } else if (confirmIcon === 'eye-off') {
          setConfirmIcon('eye');
          setConfirmVisibility(!confirmVisibility);
        }
    };

    const StepOne=()=>{
        return (
            <View style={styles.loginWrapper}>
            <Headline style={styles.heading}>Confirm Email</Headline>
            {error !==""&& <Text style={{color:"red"}} >{error}</Text> }
            <TextInput
                style={styles.loginInput}
                label='Username'
                mode='outlined'
                value={email}
                onChangeText={text =>setEmail(text) }
                theme={{ colors: { primary: props.color.primaryColor}}}
            />
          
            <Button labelStyle={styles.labelText} style={[styles.loginBtn,{backgroundColor:props.color.primaryColor}]}  mode="contained" onPress={sendOtp}>
         { !loading?'Send OTP':"Please wait ... "}
            </Button>
            <Button style={styles.forgetPass} uppercase={false}  mode="text"
             onPress={()=>{ setError("")
             props.navigation.navigate('Login')}}>
                <Text style={{color:props.color.primaryColor}}>
                   Go Back
                </Text>
                    </Button>
        </View>  
        )
    }

    const StepTwo=()=>{
        return (
            <View style={styles.loginWrapper}>
            <Headline style={styles.heading}>Verify OTP</Headline>
            <Text>(OTP Successfully Sent to your Email)</Text>
            <TextInput
                style={styles.loginInput}
                label='Enter OTP'
                mode='outlined'
                value={Otp}
                onChangeText={o => setOtp(o)}
                theme={{ colors: { primary: props.color.primaryColor}}}
            />
          
            <Button labelStyle={styles.labelText} style={styles.loginBtn} color={props.color.primaryColor} mode="contained" onPress={ verifyOtp}>
             verify
            </Button>
            <Button style={styles.forgetPass} uppercase={false} color={props.color.primaryColor} mode="text"
                 onPress={()=>  { 
                    setError("")
                    setsteps(1)}}>
                   Go Back
             </Button>
            {error !=""  && 
            <Text style={{color:"red"}} >{error}</Text>
            }
        </View>  
        )
    }

    const StepThree=()=>{
    return(
        <View style={styles.loginWrapper}>
        <Headline style={styles.heading}>Set New Password</Headline>
        <TextInput
                            style={styles.loginInput}
                            label='New Password'
                            mode='outlined'
                            value={newPassword}
                            secureTextEntry={passwordVisibility}
                            right={<TextInput.Icon onPressIn={handlePasswordVisibility} name={rightIcon} />}
                            onChangeText={password => setNewPassword(password)}
                            theme={{ colors: { primary: props.color.primaryColor}}}
                        />
        <TextInput
                            style={styles.loginInput}
                            label='Confirm Password'
                            mode='outlined'
                            value={confirmPassword}
                            secureTextEntry={confirmVisibility}
                            right={<TextInput.Icon onPressIn={handleConfirmPasswordVisibility} name={confirmIcon} />}
                            onChangeText={password => setConfirmPassword(password)}
                            theme={{ colors: { primary: props.color.primaryColor}}}
                        />          
        <Button labelStyle={styles.labelText} style={styles.loginBtn} color={props.color.primaryColor} mode="contained" onPress={updatePassword}>
       { !loading?'Update':"please wait ..."}
        </Button>
        <Button style={styles.forgetPass} uppercase={false} color={props.color.primaryColor} mode="text"
         onPress={()=>console.log("e")}>
               Go Back
        </Button>
        <Text style={{color:"red"}} >{error}</Text>

    </View> 
    )
    }


    const steps=(step)=>{
            switch (step) {
                case 1:
                   return <StepOne/> 
                case 2:
                    return <StepTwo/> 
                    case 3:
                        return <StepThree/> 
            }
    }


    return(
        <ScrollView style={styles.screenWrapper}>
            <StatusBar backgroundColor="white" barStyle={'dark-content'} />
                <View style={styles.imageWrapper}>
                    <Image style={styles.topImage} source={require('../../../assets/login.png')}/>
                </View>
            {steps(stepCount)}
        </ScrollView>
    );
}



const styles= StyleSheet.create({
    screenWrapper:{
        height:hp('100%'),
        backgroundColor: '#fff',
    },
    heading:{
        marginVertical:20,
        textAlign:"center",
        fontSize:20,
    },
    imageWrapper:{
        flex: 1,
        height:hp('30%'),
        width:wp('100%'),
        flexBasis: 0,
    },
    topImage:{
        width:wp('100%'),
        height:hp('30%'),
        resizeMode:"cover",
    },
    loginWrapper:{
        padding:40,
        height:hp('70%'),
        width:wp('100%'),
        borderTopLeftRadius:40,
        borderTopRightRadius:40,
        marginTop:-10,
        backgroundColor:"#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
        flexGrow: 1,
        justifyContent:"center",
        alignItems:"center"
    },
    loginInput:{
        marginVertical:10,
        width:wp('80%'),
        backgroundColor:"white"
    },
    loginBtn:{
        marginVertical:10,
        width:wp('80%'),
    },
    forgetPass:{
        padding:0,
        width:wp('80%'),
    },
    labelText:{
        fontSize:16,
        flex:1,
        width:wp('80%'),
    }
});

function mapStateToProps(state) {
    return {
        color: state.Theme.colorData,
        auth: state.Auth,
    }
}

function mapDispatchToProps(dispatch) {
    return({
        toggleTheme:color => dispatch(toggleTheme(color)),
        saveUserToken: token => dispatch(saveUserToken(token)),
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassword)

