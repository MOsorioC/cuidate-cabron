import React, { Component } from 'react'
import ReactMapGL, { NavigationControl} from 'react-map-gl'
import {MapFeatureService as _mapFeatureService} from '../../services/MapFeatureService'

const HEATMAP_SOURCE_ID = "mapfeatures-source";

const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};

class HeatMap extends Component {

  constructor(props) {
    super(props);

    this.state = {
      viewport: {
        width: "100%",
        height: 500,
        latitude: 19.421949,
        longitude: -99.134391,
        zoom: 4,
        bearing: 0,
        pitch: 0
      },
      mapFeatures: null
    };

    this._mapRef = React.createRef();
    this._handleMapLoaded = this._handleMapLoaded.bind(this);
  }

  _mkFeatureCollection = (features) => ({ "type": "FeatureCollection", features });

  _mkHeatmapLayerPoint = (source) => {
    return {
      "id": "heatmap-point",
      "type": "circle",
      "source": source,
      "minzoom": 7,
      "paint": {
        // Size circle radius by earthquake magnitude and zoom level
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          7, [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            1, 1,
            6, 4
          ],
          16, [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            1, 5,
            6, 50
          ]
        ],
        // Color circle by earthquake magnitude
        "circle-color": [
          "interpolate",
          ["linear"],
          ["get", "mag"],
          1, "rgba(33,102,172,0)",
          2, "rgb(103,169,207)",
          3, "rgb(209,229,240)",
          4, "rgb(253,219,199)",
          5, "rgb(239,138,98)",
          6, "rgb(178,24,43)"
        ],
        "circle-stroke-color": "white",
        "circle-stroke-width": 1,
        // Transition from heatmap to circle layer by zoom level
        "circle-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          7, 0,
          8, 1
        ]
      }
    }
  }

  _mkHeatmapLayer = (id, source) => {
    const MAX_ZOOM_LEVEL = 9;
    return {
      id,
      source,
      maxzoom: MAX_ZOOM_LEVEL,
      type: 'heatmap',
      paint: {
        // Increase the heatmap weight based on frequency and property magnitude
        // Increase the heatmap weight based on frequency and property magnitude
        "heatmap-weight": [
          "interpolate",
          ["linear"],
          ["get", "mag"],
          0, 0,
          6, 1
        ],
        // Increase the heatmap color weight weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        "heatmap-intensity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0, 1,
          9, 3
        ],
        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        // Begin color ramp at 0-stop with a 0-transparancy color
        // to create a blur-like effect.
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0, "rgba(33,102,172,0)",
          0.2, "rgb(103,169,207)",
          0.4, "rgb(209,229,240)",
          0.6, "rgb(253,219,199)",
          0.8, "rgb(239,138,98)",
          1, "rgb(178,24,43)"
        ],
        // Adjust the heatmap radius by zoom level
        "heatmap-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0, 2,
          9, 20
        ],
        // Transition from heatmap to circle layer by zoom level
        "heatmap-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          7, 1,
          9, 0
        ],
      }
    }
  };

  _onViewportChange = viewport => this.setState({ viewport });

  _updateViewport = (viewport) => {
    this.setState({ viewport });
  }

  _getMap = () => {
    return this._mapRef.current ? this._mapRef.current.getMap() : null;
  }

  _handleMapLoaded = event => {
    const map = this._getMap();

    _mapFeatureService.getMapFeatures().then(mapfeature => {
      
      this.setState({ mapFeatures: mapfeature.mapFeatures})

      map.addSource(HEATMAP_SOURCE_ID, { type: "geojson", data: mapfeature.mapFeatures})
      map.addLayer(this._mkHeatmapLayer("heatmap-layer", HEATMAP_SOURCE_ID), 'waterway-label');
      map.addLayer(this._mkHeatmapLayerPoint(HEATMAP_SOURCE_ID), 'waterway-label');
    }).catch(error => {
      console.log(error)
    })    
    
  }

  _setMapData = features => {
    const map = this._getMap();
    map && map.getSource(HEATMAP_SOURCE_ID).setData(this._mkFeatureCollection(features));
  }

  render() {

    const { viewport } = this.state;

    return (
        <ReactMapGL
          ref={this._mapRef}
          {...viewport}
          mapStyle="mapbox://styles/mapbox/light-v10"
          onViewportChange={this._onViewportChange}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY}
          onLoad={this._handleMapLoaded}
        >
          <div className="nav" style={navStyle}>
            <NavigationControl onViewportChange={this._updateViewport} />
          </div>
        </ReactMapGL>
    );
  }
}

export default HeatMap