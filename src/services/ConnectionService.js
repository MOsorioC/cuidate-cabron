import { authHeader } from '../helpers'

class ConnectionService {
  logout = () => {
    localStorage.removeItem('user')
  }

  get = (path) => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    }

    return fetch(`${process.env.REACT_APP_API_URL}${path}`, requestOptions)
      .then(this.handleResponse)
      .then(response => {
        return response
      })
  }

  post = (path, data) => {
    const requestOptions = {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify(data)
    }

    return fetch(`${process.env.REACT_APP_API_URL}${path}`, requestOptions)
    .then(this.handleResponse)
    .then(response => {
      return response
    })
  }

  put = (path, data) => {
    const requestOptions = {
      method: 'PUT',
      headers: authHeader(),
      body: JSON.stringify(data)
    }

    return fetch(`${process.env.REACT_APP_API_URL}${path}`, requestOptions)
      .then(this.handleResponse)
      .then(response => {
        return response
      })
  }

  delete = (path, data) => {
    const requestOptions = {
      method: 'DELETE',
      headers: authHeader(),
      body: JSON.stringify(data)
    }

    return fetch(`${process.env.REACT_APP_API_URL}${path}`, requestOptions)
      .then(this.handleResponse)
      .then(response => {
        return response
      })
  }

  handleResponse = (response) => {
    return response.text().then(text => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
        if (response.status === 401) {
          // auto logout if 401 response returned from api
          this.logout();
          window.location.href = "/"
        }

        return Promise.reject(data);
      }

      return data;
    });
  }
}


const connectionService = new ConnectionService()

export {connectionService}