import * as types from "../actions"

const initialState = {
    fetching:false,
    profiledata:null,
    error:false,
    editing: false,
    editsuccess: false,
    editerror: false
}

export default function userProfile(state=initialState,action){
    switch(action.type){
        case types.PROFILE_REQUEST:
            return {...state,fetching:true,error:false,}
        case types.PROFILE_SUCCESS:
            return {...state,fetching:false,profiledata:action.profile,error:false}
        case types.PROFILE_FAILURE:
            return {...state,fetching:false,profiledata:null,error:true}
        case types.EDIT_PROFILE_REQUEST:
            return {...state,editing:true,editerror:false,}
        case types.EDIT_PROFILE_SUCCESS:
            return {...state,editing:false,editsuccess: true,editerror:false}
        case types.EDIT_PROFILE_FAILURE:
            return {...state,editing:false,editsuccess:null,editerror:true}
        default:
            return state;
    }
}