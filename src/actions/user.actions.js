import {userConstants} from '../constants'
import { UserService } from '../services/UserService'

function login(email, password) {
  return dispatch => {
    dispatch(request({ email }));

    UserService.login(email, password)
      .then(user => {
        localStorage.setItem('user', JSON.stringify(user.user));
        dispatch(success(user));
      }
      ).catch(err => {
        dispatch(failure(err));
      })
  };

  function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
  function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
  function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
  UserService.logout();
  return { type: userConstants.LOGOUT };
}

function signup(nombre, apellido, email, password) {
  return dispatch => {
    dispatch(request({ email }))
    
    UserService.signup(nombre, apellido, email, password).then(user => {
      dispatch(success(user))
    }).catch(err => {
      dispatch(failure(err))
    })
  }

  function request(user) { return { type: userConstants.SIGNUP_REQUEST, user } }
  function success(user) { return { type: userConstants.SIGNUP_SUCCESS, user } }
  function failure(error) { return { type: userConstants.SIGNUP_FAILURE, error } }
}

function errorMessage(message, typeError) {
  const error = { success: false, message: message }
  return { type: typeError, error }
}

export const userActions = {
  login,
  logout,
  signup,
  errorMessage
};