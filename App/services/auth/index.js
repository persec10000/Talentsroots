import config from '../../config';

export const userLogin = async request => {
  console.log('login request', request);
  return fetch(config.login, {
    method: 'POST',
    headers: {
      'api-key': 'B3vWg8qq4k2!9qePMh*U&Cu&tbPJ$Fywnk^5LYFUprx9BAetDk5',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: request.username,
      password: request.password,
      device_id: request.device_id,
      device_type: 1
    }),
  })
    .then(response => {
      return response.json();
    })
    .then(json => {
      return json;
    })
    .catch((err)=>{
      console.log("Login err======", err)
    })
};

export const FbAuthLogin = async request => {
  console.log('login request', request);
  return fetch(config.facebookLogin, {
    method: 'POST',
    headers: {
      'api-key': 'B3vWg8qq4k2!9qePMh*U&Cu&tbPJ$Fywnk^5LYFUprx9BAetDk5',
      'Content-Type': 'application/json',
      'auth-token': 'L6g1tajZuQvD6BK93n2mL4pRl84JCsbf'
    },
    body: JSON.stringify({
      facebook_id: request.facebook_id,
      device_type:1,
      email: request.email,
      device_id:request.device_id,
    }),
  })
    .then(response => {
      return response.json();
    })
    .then(json => {
      console.log("response",json)
      return json;
    });
};

export const userRegister = async (username, email, password, type) => {
  return fetch(config.register, {
    method: 'POST',
    headers: {
      'api-key': 'B3vWg8qq4k2!9qePMh*U&Cu&tbPJ$Fywnk^5LYFUprx9BAetDk5',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: username,
      email: email,
      password: password,
      type: type
    }),
  })
    .then(response => {
      return response.json();
    })
    .then(json => {
      console.log("json registration", json)
      return json;
    });
};

export const userFacebookRegister = async (request, device_id, type) => {
  return fetch(config.register, {
    method: 'POST',
    headers: {
      'api-key': 'B3vWg8qq4k2!9qePMh*U&Cu&tbPJ$Fywnk^5LYFUprx9BAetDk5',
      'Content-Type': 'application/json',
      'auth-token': 'L6g1tajZuQvD6BK93n2mL4pRl84JCsbf'
    },
    body: JSON.stringify({
        facebook_id: request.facebook_id,
        name: request.first_name,
        email: request.email,
        username:request.name,
        type: type,
        password: 123,
        device_type:1,
        device_id:device_id,
        first_name: request.first_name,
        last_name: request.last_name,
        profile: `http://graph.facebook.com/${request.facebook_id}/picture?width=500&height=500`
    }),
  })
    .then(response => {
      return response.json();
    })
    .then(json => {
      console.log("json registration", json)
      return json;
    });
};


export const forgetPwEmail = (email) => {
  return fetch(config.forgetPassword, {
    method: 'POST',
    headers: {
      'api-key': 'B3vWg8qq4k2!9qePMh*U&Cu&tbPJ$Fywnk^5LYFUprx9BAetDk5',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
    }),
  })
    .then(response => {
      return response.json();
    })
    .then(json => {
      return json;
    });
}