import { connectionService } from './ConnectionService'

function login(email, password) {
  const endpoint = '/login'

  return connectionService.post(endpoint, { email, password })
}

function logout() {
  localStorage.removeItem('user')
}

function signup(nombre, apellido, email, password){
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

export {
  UserService
}



