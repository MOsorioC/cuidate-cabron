import React, { Component } from 'react';
import ReactMapGL, {NavigationControl} from 'react-map-gl';

const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};

class Map extends Component {

  state = {
    viewport: {
      width:"100%",
      height:400,
      latitude: 19.421949,
      longitude: -99.134391,
      zoom: 5,
    }
  };

  _updateViewport = (viewport) => {
    this.setState({ viewport });
  }

  _onViewportChange = viewport => this.setState({ viewport });

  render() {
    return (
      <ReactMapGL
        mapboxApiAccessToken = {process.env.REACT_APP_MAPBOX_KEY}
        {...this.state.viewport}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onViewportChange={(viewport) => this.setState({ viewport })}
      >
        <div className="nav" style={navStyle}>
          <NavigationControl onViewportChange={this._updateViewport} />
        </div>
      </ReactMapGL>
    );
  }
}

export default Map