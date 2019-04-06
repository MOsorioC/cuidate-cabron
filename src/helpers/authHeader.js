export function authHeader() {
    // return authorization header with jwt token
  let user = JSON.parse(localStorage.getItem('user'));

  if (user && user.accessToken) {
    return { 'x-access-token': user.accessToken, 'Content-Type': 'application/json' };
  } else {
    return { 'Content-Type': 'application/json' };
  }
}