import {userConstants} from '../constants'
import { UserService } from '../services/UserService'

function login(email, password) {
  return dispatch => {
    dispatch(request({ email }));

    UserService.login(email, password)
      .then(user => {
        dispatch(success(user));
      }
      ).catch(err => {
        dispatch(failure(err));
        //console.log(err)
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
      console.log(success)
      dispatch(success(user))
    }).catch(err => {
      dispatch(failure(err))
    })
  }

  function request(user) { return { type: userConstants.SIGNUP_REQUEST, user } }
  function success(user) { return { type: userConstants.SIGNUP_SUCCESS, user } }
  function failure(error) { return { type: userConstants.SIGNUP_FAILURE, error } }
}

export const userActions = {
  login,
  logout,
  signup
};