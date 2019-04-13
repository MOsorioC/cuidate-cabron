import { connectionService } from './ConnectionService'

function login(email, password) {
  /*const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  };

  return fetch(`${process.env.REACT_APP_API_URL}/login`, requestOptions).then(handleResponse).then( user => {
    return user;
  })*/
  const endpoint = '/login'

  return connectionService.post(endpoint, { email, password })
}

function logout() {
  localStorage.removeItem('user')
}

function signup(nombre, apellido, email, password){
  /*const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, apellido, email, password })
  }

  return fetch(`${process.env.REACT_APP_API_URL}/signup`, requestOptions).then(handleResponse).then(user => {
    return user
  })*/
  const endpoint = '/signup'

  return connectionService.post(endpoint, { nombre, apellido, email, password })
}

function update(data) {
  const endpoint = '/user/'

  return connectionService.put(endpoint, data)
} 

const UserService = {
  login,
  signup,
  logout,
  update
}


function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        window.location.href = "/"
      }
      
      return Promise.reject(data);
    }

    return data;
  });
}

export {
  UserService
}



