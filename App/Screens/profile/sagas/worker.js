import {call, put} from 'redux-saga/effects';
import * as types from '../actions';
import {profile_service, edit_profile} from '../../../services/profile'




export function* profile(action) {
  try {
    console.log('action',action)
    const response = yield call(profile_service, action.payload);
    
     if (response.status == 1) {
      let profile = response.data;
      
      yield put({type: types.PROFILE_SUCCESS,profile});
    } else {
      yield put({type: types.PROFILE_FAILURE});
    }
  } catch (error) {
    yield put({type: types.PROFILE_FAILURE});
  }
}


export function* editProfile(payload) {
  console.log('Worker edit', payload)
  try {
    
    const response = yield call(edit_profile, payload);
    console.log('response', response)
     if (response.status == 1) {
      console.log('success')
      yield put({type: types.EDIT_PROFILE_SUCCESS});
    } else {
      console.log('failure')
      yield put({type: types.EDIT_PROFILE_FAILURE});
    }
  } catch (error) {
    console.log('failure')
    yield put({type: types.EDIT_PROFILE_FAILURE});
  }
}
