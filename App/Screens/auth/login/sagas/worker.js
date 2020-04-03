import {call, put} from 'redux-saga/effects';
import AsyncStorage from '@react-native-community/async-storage';
import {userLogin, FbAuthLogin} from '../../../../services/auth';
import * as types from '../actions';

export function* Login(payload) {
  try {
    const response = yield call(userLogin, payload.payload);
    var username = payload.payload.username
    var password = payload.payload.password
    var device_id = payload.payload.device_id
    // console.log("Device listing",username,password,device_id)
    console.log('login response', response)
    if (response.status == 1) {
      AsyncStorage.setItem('username',username)
      AsyncStorage.setItem('password',password)
      AsyncStorage.setItem('device_id',device_id)
      let userToken = response.data.token;
      let name = response.data.name
      let email = response.data.email
      let profile = response.data.profile
      let user_id = response.data.id
      let user_type = response.data.type
      yield put({type: types.LOGIN_SUCCESS, userToken,name,email,profile,user_id, user_type});
      console.log('Successfully loggedin')
    } else {
      yield put({type: types.LOGIN_FAILURE});
      console.log('Login Failed')
    }
  } catch (error) {
    yield put({type: types.LOGIN_FAILURE});
    console.log('Login Failed')
  }
}

export function* FbLogin(payload) {
  try {
    console.log(payload)
    const response = yield call(FbAuthLogin, payload.payload);
    var username = payload.payload.first_name
    var password = '123'
    var device_id = payload.payload.device_id
    if (response.status == 1) {
      AsyncStorage.setItem('username',username)
      AsyncStorage.setItem('password',password)
      AsyncStorage.setItem('device_id',device_id)
      let userToken = response.data.token;
      let name = response.data.name
      let email = response.data.email
      let profile = response.data.profile
      yield put({type: types.LOGIN_SUCCESS, userToken,name,email,profile});
      console.log('Successfully loggedin')
    } else {
      yield put({type: types.LOGIN_FAILURE});
      console.log('Login Failed')
    }
  } catch (error) {
    yield put({type: types.LOGIN_FAILURE});
    console.log('Login Failed')
  }
}
