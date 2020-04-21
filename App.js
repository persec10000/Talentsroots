import React, {Fragment, useEffect} from 'react';
import {
  Alert,
  AsyncStorage
} from 'react-native';
import {Provider} from 'react-redux'
import 'react-native-gesture-handler'
import {store} from './App/reducers'
import SocketIOClient from 'socket.io-client/dist/socket.io';
import { MenuProvider } from 'react-native-popup-menu';
import firebase  from 'react-native-firebase';
import { connect } from 'react-redux';
import AppStarter from './App/navigation'
const App = (props) => {
  useEffect(() => {
    this.checkPermission();
    this.messageListener();
    async function fetchData() {
      await AsyncStorage.getItem("FCM.BG_MESSAGE")
    }
    fetchData()   
    .then(jsonData => {
        const data = jsonData ? JSON.parse(jsonData) : false;
        console.log("dataaaaaaaaaaaaaaaaaa",data);
        // then do navigation, or whatever you want to the data.
    }).catch(e => console.log(e));
    return () => {
      this.notificationOpenedListener();
    }
  }, [])
    let socket = SocketIOClient('https://socket.talentsroot.com?user_id=' + props.id);
    // let socket = SocketIOClient('https://socket.tribital.ml?user_id=' + props.id);
    global.socket = socket;
    socket.on('disconnect', (res, err) => console.log("result======>",res, err))
  if (props.id){
    socket.on('connect', () => {
        console.log('connected in app at socket.tribital.ml?user_id=' + props.id)
    });
    socket.on('connect_error', (err) => { console.log("SOCKET CONNECTION ERR ----", err) })
  } 

  checkPermission = async() => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }

  getToken = async() => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log("getting token...........", fcmToken)
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
          console.log("token is........", fcmToken)
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }else{
          console.log("can not get token")
        }
    }
  }
  
    //2
  requestPermission = async() => {
    console.log("requesting the permission.........")
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }
 
  messageListener = async () => {
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        console.log("notification====================",notification)
        const { title, body } = notification;
        this.showAlert(title, body);
    });
  
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      console.log("notification2=========================")  
      this.showAlert('Alert', "Alert")
      const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    });
     // const notificationOpen = await firebase.notifications().getInitialNotification();
    firebase.notifications().getInitialNotification()
      .then(payload => {
        console.log("payload=======", payload)
      });
    // if (notificationOpen) {
    //     const { title, body } = notificationOpen.notification;
    //     this.showAlert(title, body);
    // }
  
    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log("I am here",JSON.stringify(message));
    });
  }

  showAlert = (title, body) => {
    Alert.alert(
      title, body,
      [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  } 
  return (
    
      <MenuProvider>        
        <AppStarter screenProps={socket}/>
      </MenuProvider>
    
  );
};

const mapStateToProps = state => {
  return {
      token: state.LoginUser.userToken,
      review: state.addRoot,
      id: state.LoginUser.user_id
  };
};

export default connect(mapStateToProps)(App);
