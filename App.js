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
    checkPermission();
    createNotificationListeners();
    
  }, [props])
  
  
  let socket = SocketIOClient('https://socket.tribital.ml?user_id=' + props.id);
  socket.on('connect', () => {
      console.log('connected in app at https://socket.tribital.ml?user_id=' + props.id)
  });

  socket.on('connect_error', (err) => { console.log("SOCKET CONNECTION ERR ----", err) })

  //1
  checkPermission = async() => {
    console.log("in check permission.........")
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }
  
    //3
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

  createNotificationListeners = async() => {
    console.log("creating notification listeners+++++++++++++++++++++++++")
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    notificationListener = firebase.notifications().onNotification((notification) => {
      console.log(">>>>>>>>>>>>>>>>>>>>>>ListenerTop",title, body)
        const { title, body } = notification;
        showAlert(title, body);
    });
  
    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        console.log(">>>>>>>>>>>>>>>>>>>>>>Listener",title, body)
        showAlert(title, body);
    });
  
    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
        console.log(">>>>>>>>>>>>>>>>>>>>>>Open",title, body)
        showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
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
  console.log(">?>?>?>?>?>?>?>?>?>",socket)
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
