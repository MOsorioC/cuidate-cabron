import React, { Component } from 'react'
import Core, {Grid} from '@material-ui/core'
import {Switch, Route} from 'react-router-dom'
import NavBar from './components/NavBar'

import Map from './components/Map'

class App extends Component {

  render() {
    return (
      <div className="App">
        <NavBar></NavBar>
        <Map/>
      </div>
    );
  }
}

export default App;
