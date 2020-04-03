import * as types from './index'

export const profilerequest = (token,user_id) => {
    return{
        type:types.PROFILE_REQUEST,
        payload : {
            token,
            user_id
        }
    }
}

export const editprofilerequest = (data, token) => {
    return{
        type:types.EDIT_PROFILE_REQUEST,
        payload: {data, token}
    }
}
