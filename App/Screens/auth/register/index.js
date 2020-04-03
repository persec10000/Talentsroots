import React, { Fragment } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  CheckBox,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  Linking,
  Alert
} from 'react-native';
import { connect } from "react-redux";
import DeviceInfo from 'react-native-device-info';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { userRegister, userFacebookRegister } from '../../../services/auth';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  scale,
  moderateScale
} from '../../../commons/responsive_design';
import {
  forgetPwEmail
} from '../../../services/auth/index'
import Icon from "react-native-vector-icons/FontAwesome";
import { RadioButton } from 'react-native-paper';

class RegisterScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      showPassword: false,
      usernameError: false,
      checkUsername: false,
      userNameErrMsg: '',
      userSpecialError: false,
      userSpecialErrorMsg: '',
      email: '',
      emailErrMsg: '',
      emailError: false,
      password: '',
      passwordError: false,
      type: '',
      buyer: false,
      seller: false,
      spaceError: false,
      spaceErrorMsg: '',
      device_id: '',
      spin: false,
      fbspin: false,
      passCapital: false,
      passSpecial: false,
      passNumber: false,
      passChar: false,
      checkPassword: false,
      checked: 'first',
      numberErr: false,
      numberErrMsg: '',
    }
  }
  changeHandler = (key, value, error) => {
    this.setState({
      [key]: value,
      [error]: false,
    })
  }

  checkUserName = (value) => {
    if (!value) {
      this.setState({
        checkUsername: false,
        spaceError: false,
        usernameError: false,
        spaceErrorMsg: '',
        userNameErrMsg: '',
        userSpecialErrorMsg: '',
        userSpecialError: false,
        numberErr: false,
        numberErrMsg: '',
        username: value
      })
      return
    }
    this.setState({ checkUsername: true, username: value })

    const spaceRegex = RegExp(
      /\s/gm
    )

    const specialChar = RegExp(
      /[^a-zA-Z0-9]/gm
    )

    const userNameRegex = RegExp(
      /^(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,20})$/
    )

    const onlyNumber = RegExp(
      /^\d+$/
    )

    if (specialChar.test(value)) {
      this.setState({ userSpecialError: true, userSpecialErrorMsg: "Don't use a special character" })
    }

    if (spaceRegex.test(value)) {
      this.setState({ spaceError: true, spaceErrorMsg: "Don't use a space" })
    }

    if (onlyNumber.test(value)) {
      this.setState({ numberErr: true, numberErrMsg: "Don't use only number" })
    }

    if (value.length < 6) {
      this.setState({
        usernameError: true,
        userNameErrMsg: 'Username must be atleast 6 characters'
      })
    } else if (value.length > 20) {
      this.setState({
        usernameError: true,
        userNameErrMsg: 'Username can not be more than 20 characters'
      })
    } 
    else{ 
      this.setState({
        usernameError: false,
        userNameErrMsg: ''
      })
    }


  }



  checkPassword = (value) => {
    if (!value) {
      this.setState({
        checkPassword: false,
        passCapital: false,
        passChar: false,
        passNumber: false,
        passSpecial: false
      })
    }
    this.setState({ checkPassword: true, password: value })
    const capitalRegex = RegExp(
      /[A-Z]/m
    )
    const oneNumber = RegExp(
      /\d/gm
    )
    const specialChar = RegExp(
      /[^a-zA-Z0-9]/gm
    )

    if (capitalRegex.test(value)) {
      this.setState({ passCapital: true })
    }
    if (oneNumber.test(value)) {
      this.setState({ passNumber: true })
    }
    if (specialChar.test(value)) {
      this.setState({ passSpecial: true })
    }
    if (value.length >= 8) {
      this.setState({ passChar: true })
    }
  }

  onSubmit = async () => {

    if (this.state.username.length < 6) {
      this.setState({
        usernameError: true,
        userNameErrMsg: 'Username must be at least 6 characters'
      })
      return;
    }



    const emailRegex = RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

    // if(!this.state.userSpecialError || !this.state.usernameError || !this.state.onlyNumber){
    //   ToastAndroid.showWithGravityAndOffset(
    //     "Please enter correct Username",
    //     ToastAndroid.LONG,
    //     ToastAndroid.BOTTOM,
    //     25,
    //     50,
    //   );
    //   return;
    // }
    if (!emailRegex.test(this.state.email)) {
      this.setState({
        emailError: true,
        emailErrMsg: 'Invalid Email Address'
      });
      return;
    }
    if (!this.state.passCapital || !this.state.passNumber || !this.state.passSpecial || !this.state.passChar) {
      ToastAndroid.showWithGravityAndOffset(
        "Please enter correct password",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      return;
    };

    this.setState({ spin: true })
    let response = await userRegister(this.state.username, this.state.email, this.state.password, this.state.type)
    if (response.status == 1) {
      this.setState({ spin: false })
      Alert.alert(response.message)
      this.props.navigation.navigate('Login')
    } else {
      this.setState({ spin: false })
      Alert.alert(response.message)
    }
  }

  handleFacebookLogin = () => {
    return new Promise((resolve, reject) => {
      LoginManager.logInWithPermissions(['public_profile', 'email']).then(
        function (result) {
          if (result.isCancelled) {
            reject('Login cancelled')
          } else {
            AccessToken.getCurrentAccessToken().then(
              (data) => {
                const token = data.accessToken;
                console.log(token)
                const PROFILE_REQUEST_PARAMS = {
                  fields: {
                    string: 'id, name,  first_name, last_name, email',
                  },
                };
                const profileRequest = new GraphRequest(
                  '/me',
                  { token, parameters: PROFILE_REQUEST_PARAMS },
                  (error, result) => {
                    if (error) {
                      reject('login info has error: ' + error);
                    } else {
                      resolve(result)
                    }
                  },
                );
                new GraphRequestManager().addRequest(profileRequest).start();
              }
            )
          }
        },
        function (error) {
          reject('Login fail with error: ' + error)
        }
      )
    })
  }


  onFacebookRegister = () => {
    const device_id = this.state.device_id
    const type = this.state.type;
    this.handleFacebookLogin()
      .then(result => {
        (async () => {
          this.setState({ fbspin: true })
          let response = await userFacebookRegister(result, device_id, type)
          console.log(response)
          if (response.status == 1) {
            this.setState({ fbspin: false })
            ToastAndroid.showWithGravityAndOffset(
              response.message,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
            this.props.navigation.navigate('Login')
          } else {
            this.setState({ fbspin: false })
            ToastAndroid.showWithGravityAndOffset(
              response.message,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );

          }
        })();
      })
      .catch(error => {
        alert(error)
      })
  }

  componentDidMount = () => {
    DeviceInfo.getAndroidId().then(androidId => {
      // androidId here
      console.log('android id', androidId);
      this.setState({ device_id: androidId });
    });
    console.disableYellowBox = true;
  }
  render() {
    console.log(this.props.register)
    return (
      <ScrollView style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../../../assets/images/logo_image.png')}
        />
        <View style={styles.header_wrapper}>
          <Text style={styles.header_text}>Register</Text>
        </View>
        <TextInput placeholder="User Name" style={styles.input} onChangeText={(text) => this.checkUserName(text)} value={this.state.username} />
        {this.state.checkUsername &&
          <>{this.state.spaceError ? (
            <Text style={styles.errorText}>
              {this.state.spaceErrorMsg}
            </Text>
          ) : null}
            {this.state.userSpecialError ? (
              <Text style={styles.errorText}>
                {this.state.userSpecialErrorMsg}
              </Text>
            ) : null}
            {this.state.numberErr ? (
              <Text style={styles.errorText}>
                {this.state.numberErrMsg}
              </Text>
            ) : null}
            {this.state.usernameError ? (
              <Text style={styles.errorText}>
                {this.state.userNameErrMsg}
              </Text>
            ) : null}</>
        }

        <TextInput placeholder="Email" style={styles.input} onChangeText={(text) => this.changeHandler('email', text, 'emailError')} value={this.state.email} />
        {this.state.emailError && (
          <Text style={styles.errorText}>
            {this.state.emailErrMsg}
          </Text>
        )}

        {this.state.passwordError && (
          <Text style={styles.errorText}>
            Please enter the password greater than 8 digits
        </Text>
        )}
        <View style={[styles.input, { paddingLeft: 2 }]}>
          <TextInput placeholder="Password" style={{ flex: 5 }} secureTextEntry={this.state.showPassword ? false : true} onChangeText={(text) => this.checkPassword(text)} value={this.state.password} />
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => { this.setState({ showPassword: !this.state.showPassword }) }}>
            {this.state.showPassword ?
              <Icon
                name="eye-slash"
                color='#E0E6EE'
                size={20} /> :
              <Icon
                name="eye"
                color='#E0E6EE'
                size={20} />}
          </TouchableOpacity>
        </View>
        {
          this.state.checkPassword &&
          <>
            <View style={{ flexDirection: 'row' }}>
              {
                this.state.passCapital ?
                  <Icon style={styles.icon} style={styles.icon} name={"check"} size={20} color='green' />
                  :
                  <Icon style={styles.icon} name={'window-close'} size={20} color='red' />
              }

              <Text style={this.state.passCapital ? { color: 'green' } : { color: 'red' }}>At least one capital letter</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              {
                this.state.passNumber ?
                  <Icon style={styles.icon} name={"check"} size={20} color='green' />
                  :
                  <Icon style={styles.icon} name={'window-close'} size={20} color='red' />
              }
              <Text style={this.state.passNumber ? { color: 'green' } : { color: 'red' }}>At least one number </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              {
                this.state.passSpecial ?
                  <Icon style={styles.icon} name={"check"} size={20} color='green' />
                  :
                  <Icon style={styles.icon} name={'window-close'} size={20} color='red' />
              }
              <Text style={this.state.passSpecial ? { color: 'green' } : { color: 'red' }}>At least one Special Character</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              {
                this.state.passChar ?
                  <Icon style={styles.icon} name={"check"} size={20} color='green' />
                  :
                  <Icon style={styles.icon} name={'window-close'} size={20} color='red' />
              }
              <Text style={this.state.passChar ? { color: 'green' } : { color: 'red' }}>Be at least 8 characters</Text>
            </View>
          </>
        }

        <View style={styles.checkbox_wrapper}>
          <View style={styles.checbox_seller}>
            <CheckBox
              value={this.state.seller}
              onValueChange={() => this.setState({ 
                seller: true, 
                buyer: false, 
                type: 0 
              })}
            />
            <Text style={styles.checkbox_text}>Seller</Text>
          </View>
          <View style={styles.checkbox_buyer}>
            <CheckBox
              value={this.state.buyer}
              onValueChange={() => this.setState({ 
                buyer: true, 
                seller: false , 
                type: 1  
              })}
            />
            <Text style={styles.checkbox_text}>Buyer</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.registerButton} onPress={this.onSubmit}>
          {this.state.spin ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.buttonText}>Register</Text>}
        </TouchableOpacity>
        <View style={styles.policyText}>
          <Text style={styles.policy_text}>
            By registering you accept
            <Text style={{ color: 'blue' }} onPress={() => Linking.openURL('https://talentsroot.tribital.ml/terms-of-service')}> Terms of Services</Text> <Text> and</Text>
            <Text style={{ color: 'blue' }} onPress={() => Linking.openURL('https://talentsroot.tribital.ml/privacy-policy')}> Privacy Policy</Text>
          </Text>
        </View>

        <View style={styles.underline} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity
            style={[styles.socialCard, { backgroundColor: 'white' }]}>
            <Image
              style={styles.socialIcon}
              source={require('../../../assets/icons/google.png')} />
            <Text
              style={[styles.socialText, { color: '#7a7d85' }]}
            >
              Continue with Google
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialCard, { backgroundColor: '#4267b2' }]}
            onPress={() => this.fbCheck()}>
            <>
              <Image
                style={styles.socialIcon}
                source={require('../../../assets/icons/facebook.jpg')} />
              <Text
                style={[styles.socialText, { color: 'white' }]}
              >
                Continue with Facebook
                </Text>
            </>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.bottom_text_wrapper} onPress={() => this.props.navigation.navigate("Login")}>
          <Text style={styles.bottom_text}>Are you already registered?</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
};

export default RegisterScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logo: {
    marginTop: '2%',
    height: 44,
    width: 44,
    alignSelf: 'center',
  },
  header_wrapper: {
    padding: '3%',
  },
  header_text: {
    textAlign: 'center',
    fontSize: 28,
  },
  input: {
    paddingLeft: 5,
    borderWidth: 1,
    marginVertical: 10,
    borderColor: '#E0E6EE',
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  errorText: {
    color: '#ff0000',
  },
  checkbox_wrapper: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  checbox_seller: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 30,
  },
  checkbox_buyer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox_text: {
    color: '#3C4043',
  },
  registerButton: {
    backgroundColor: '#10A2EF',
    padding: '4%',
    borderRadius: 2,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
  },
  policyText: {
    flexDirection: 'row',
    display: 'flex',
    padding: 5,
    // width: 250
  },
  policy_text: {
    color: '#3C4043'
  },
  underline: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 1,
    marginVertical: '3.5%',
    alignSelf: 'center',
    width: '70%',
    borderColor: '#748F9E'
  },
  facebookButton: {
    backgroundColor: '#4968B4',
    padding: '4%',
    marginVertical: '2%',
    borderRadius: 2,
  },
  googleButton: {
    backgroundColor: '#EE6924',
    padding: '4%',
    marginVertical: '2%',
    borderRadius: 2,
  },
  bottom_text_wrapper: {
    padding: '2%',
    marginBottom: 30,
  },
  bottom_text: {
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  socialCard: {
    flex: 1,
    flexDirection: 'row',
    height: hp(8),
    margin: scale(5),
    padding: scale(10),
    borderRadius: 10,
    borderColor:'#DDD',
    borderWidth:1
  },
  socialIcon: {
    height: null,
    flex: 1,
    resizeMode: 'contain'
  },
  socialText: {
    fontSize: moderateScale(11),
    flex: 3,
    paddingHorizontal: scale(10),
    textAlign: 'center'
  },
  icon: {
    marginRight: 5
  }
});
