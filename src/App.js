import React, { Component } from 'react'
import {Switch, Route} from 'react-router-dom'
import NavBar from './components/NavBar'
import NotFound from './components/NotFound'
import HomePage from './components/HomePage';
import {LoginPage, SignUp} from './components/Auth'

class App extends Component {

  render() {
    return (
      <div className="App">
        <NavBar></NavBar>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/login' component={LoginPage} />
          <Route exact path='/signup' component={SignUp} />
          <Route component={NotFound}/>
        </Switch>
      </div>
    );
  }
}

export default App;
