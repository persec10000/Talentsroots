import {ToastAndroid} from 'react-native';
import config from '../../config';

export const profile_service = request => {
  return fetch(config.profile, {
    method: 'POST',
    headers: {
      'api-key': 'B3vWg8qq4k2!9qePMh*U&Cu&tbPJ$Fywnk^5LYFUprx9BAetDk5',
      'Content-Type': 'application/json',
      'auth-token': request.token,
    },
    body : JSON.stringify({
      'user_id' : request.user_id
    })
    })
    .then(response => {
      return response.json();
    })
    .then(json => {
      console.log('profile response data', json);
      return json;
    })
};

export const root_details = (token, id) => {
  return fetch(config.rootDetails, {
    method: 'POST',
    headers: {
      'api-key': 'B3vWg8qq4k2!9qePMh*U&Cu&tbPJ$Fywnk^5LYFUprx9BAetDk5',
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify({
      root_id: id,
    }),
  })
    .then(response => {
      return response.json();
    })
    .then(json => {
      console.log('profile response data', json);
      return json;
    });
};

export const edit_profile = (request, token) => {
  console.log('edit_profile',request.preferredLang, request.additionalLang,request.country);
  return fetch(config.editProfile, {
    method: 'POST',
    headers: {
      'api-key': 'B3vWg8qq4k2!9qePMh*U&Cu&tbPJ$Fywnk^5LYFUprx9BAetDk5',
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify({
      name: request.username,
      first_name: request.firstname,
      last_name: request.firstname,
      preffered_language: request.prefferedLanguageId,
      additional_language: request.additionalLanguageId,
      // email: request.email,
      type: 0,
      description: request.profileDesc ? request.profileDesc : '',
      gender: 1,
      phone:request.phone?request.phone:'',
      country: request.country,
      timezone: request.timezone,
      email_notifications: 0,
      mobile_notifications: 0,
      profile: request.profileImage,
    }),
  })
    .then(response => {
      console.log('profile updatesss', response);
      return response.json();
    })
    .then(json => {
      ToastAndroid.show(json.message, ToastAndroid.SHORT);
      console.log('profile update', json);
      return json;
    });
};

export const editEmail = (token, paypal, cashu) => {
  return fetch(config.editProfile, {
    method: 'POST',
    headers: {
      'api-key': 'B3vWg8qq4k2!9qePMh*U&Cu&tbPJ$Fywnk^5LYFUprx9BAetDk5',
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify({
      'paypal_id': paypal,
      'cashu': cashu
    }),
  })
    .then(response => {
      return response.json();
    })
    .then(json => {
      ToastAndroid.show("updated successfully", ToastAndroid.SHORT);
      return json;
    });
};

export const user_profile_service = request => {
  console.log(
    'user profile service',
    config.userProfile + `?id=${request.payload.id}`,
  );
  return fetch(config.userProfile + `?id=${request.payload.id}`, {
    method: 'POST',
    headers: {
      'api-key': 'B3vWg8qq4k2!9qePMh*U&Cu&tbPJ$Fywnk^5LYFUprx9BAetDk5',
      'Content-Type': 'application/x-www-form-urlencoded',
      'auth-token': request.payload.token,
    },
    body: {
      id: request.payload.id,
    },
  })
    .then(response => {
      return response.json();
    })
    .then(json => {
      console.log('profile response data of the other', json);
      return json;
    });
};

export const review_detail = (token, id) => {
  return fetch(config.reviewDetail, {
    method: 'POST',
    headers: {
      'api-key': 'B3vWg8qq4k2!9qePMh*U&Cu&tbPJ$Fywnk^5LYFUprx9BAetDk5',
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify({
      root_id: id,
    }),
  })
    .then(response => {
      return response.json();
    })
    .then(json => {
      console.log('reviewDetail', json);
      return json;
    });
};

export const other_roots_detail = (token, id) => {
  return fetch(config.otherRootsDetail, {
    method: 'POST',
    headers: {
      'api-key': 'B3vWg8qq4k2!9qePMh*U&Cu&tbPJ$Fywnk^5LYFUprx9BAetDk5',
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify({
      id : id,
    }),
  })
    .then(response => {
      return response.json();
    })
    .then(json => {
      console.log('otherRootsDetail', json);
      return json;
    });
};

