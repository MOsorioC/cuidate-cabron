import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { ReportServices } from '../../services/ReportServices'
import PropTypes from 'prop-types'
import ReactMapGL, { NavigationControl, Marker, Popup, GeolocateControl } from 'react-map-gl'
import CityInfo from '../Maps/CityInfo'
import CityPin from '../Maps/CityPin'
import { Grid, withStyles, Fade, Typography, LinearProgress } from '@material-ui/core/'

//helpers
import MySnackbarContent from '../MySnackbarContent'

//STYLES
const navStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
};

const geolocateStyle = {
  position: 'relative',
  top: 0,
  left: 0,
  margin: 10
};

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 50
  }
});

class IndexPage extends Component {

  state = {
    viewport: {
      width: "100%",
      height: 500,
      latitude: 19.421949,
      longitude: -99.134391,
      zoom: 5,
    },
    error: false,
    errorMessage: "",
    popupInfo: null,
    features: null,
    reportList: [],
    loading: true
  }

  /**
   * Map Properties
   */
  _updateViewport = (viewport) => this.setState({ viewport })

  _onViewportChange = viewport => this.setState({ viewport })

  _renderPopup() {
    const { popupInfo } = this.state;

    return (popupInfo) && (
      <Popup tipSize={5}
        anchor="top"
        longitude={popupInfo.mapFeature.geometry.long}
        latitude={popupInfo.mapFeature.geometry.lat}
        closeOnClick={false}
        onClose={() => this.setState({ popupInfo: null })} >
        <CityInfo info={popupInfo} isFeature={false} />
      </Popup>
    );
  }

  _renderMarker = () => {

    if (!this.state.loading) {
      return this.state.reportList.map(report => {
        return (
          <Marker
            key={`marker-${report._id}`}
            longitude={report.mapFeature.geometry.long}
            latitude={report.mapFeature.geometry.lat} >
            <CityPin size={20} onClick={() => this.setState({ popupInfo: report })} />
          </Marker>
        )
      })
    }
    
  }

  _renderReactMap = () => {
    if (!this.state.loading) {
      return (
        <ReactMapGL
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY}
          {...this.state.viewport}
          mapStyle="mapbox://styles/mapbox/light-v10"
          onViewportChange={(viewport) => this.setState({ viewport })}>

          {this._renderMarker()}
          {this._renderPopup()}
          <div className="nav" style={navStyle}>
            <GeolocateControl
              style={geolocateStyle}
              onViewportChange={this._onViewportChange}
              positionOptions={{ enableHighAccuracy: true }}
              trackUserLocation={true}
            />
            <NavigationControl onViewportChange={this._updateViewport} />
          </div>
        </ReactMapGL>
      )
    }
  }
  // End Map Stuff

  _getReportList = () => {
    ReportServices.getAll().then(mapFeatureList => {
      this.setState({ reportList: mapFeatureList.reportList, loading: false})
    }).catch(err => {
      this.setState({error: true, errorMessage: err.message})
    })
  }
  componentDidMount = () => {
    setTimeout(this._getReportList(), 5000) 
  }

  _renderMessage = () => {
    const { classes } = this.props

    const variantMessage = this.state.error ? 'error' : this.state.success ? 'success' : null

    return variantMessage && <MySnackbarContent
      variant={variantMessage}
      className={classes.margin}
      message={this.state.errorMessage}
      onClose={() => this.setState({ error: false, errorMessage: "", success: false })}
    />
  }

  render() {
    //const {classes, user} = this.props

    const {loading} = this.state
    return (
      <Fragment>
        <Grid item lg={12} xs={12}>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Reportes de nuestra comunidad
          </Typography>
          <Fade
            in={loading}
            style={{
              transitionDelay: loading ? '800ms' : '0ms',
            }}
            unmountOnExit
          >
            <LinearProgress color="secondary" />
          </Fade>
          
          {this._renderReactMap()}
          
        </Grid>
        {this._renderMessage()}
      </Fragment>
    )
  }
}

IndexPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

const IndexPages = withStyles(styles)(IndexPage)

function mapStateToProps(state) {
  const { user } = state.authentication;
  return {
    user
  };
}

const connectedIndexPage = connect(mapStateToProps)(IndexPages)
export { connectedIndexPage as IndexPage }