import { userConstants } from '../constants';

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : {};

export function authReducer(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.LOGIN_FAILURE:
      return {loggingError: true, error: action.error};
    case userConstants.LOGOUT:
      return {};
    case userConstants.SIGNUP_SUCCESS:
      return { signup: true, user: action.user };
    case userConstants.SIGNUP_FAILURE:
      return { signupError: true, error: action.error };
    case userConstants.SIGNUP_REQUEST:
      return { signupRequest: true, user: action.user };
    default:
      return state
  }
}