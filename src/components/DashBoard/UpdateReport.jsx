import React, {Component, Fragment} from 'react'
import { ReportServices } from '../../services/ReportServices'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactMapGL, { NavigationControl, Marker, Popup, GeolocateControl } from 'react-map-gl'
import CityInfo from '../Maps/CityInfo'
import CityPin from '../Maps/CityPin'
import { Grid, withStyles, TextField, Button, MenuItem, Typography, LinearProgress} from '@material-ui/core/'
import { MapFeatureService } from '../../services/MapFeatureService';

//helpers
import MySnackbarContent from '../MySnackbarContent'

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
  },
  textField: {
    width: '100%',
  },
  button: {
    marginTop: 16,
    width: '100%'
  },
  menu: {
    width: 200,
  },
  margin: {
    margin: theme.spacing.unit,
  },
});

class UpdateReport extends Component {
  state = {
    viewport: {
      width: "100%",
      height: 400,
      latitude: 19.421949,
      longitude: -99.134391,
      zoom: 5,
    },
    crimeList: [],
    error: false,
    errorMessage: "",
    lat: null,
    lng: null,
    popupInfo: null,
    descripcion: '',
    crimeSelected: '',
    features: null,
    success: false,
    loading:  true,
    report: null
  }

  _updateViewport = (viewport) => {
    this.setState({ viewport })
  }

  _onViewportChange = viewport => {
    this.setState({
      lat: null,
      lng: null,
      popupInfo: null
    })
    this.setState({ viewport })
  }

  getCrimeListFromAPI = () => {
    ReportServices.getCrimeList().then( list => {
      this.setState({
        crimeList: list.crimeCategoryList,
        error: false,
        errorMessage: ""
      })
    }).catch(err => {
      this.setState({
        error: true,
        errorMessage: err.message,
        success: false
      })
    })
  }

  getReportFromAPI = () => {
    const { params } = this.props.match
    
    ReportServices.getReport(params.id).then(response => {
      const { success, report } = response

      if (success) {
        this.setState({
          report: report,
          descripcion: report.descripcion,
          crimeCategoryId: report.crimeCategory._id,
          lat: report.mapFeature.geometry.lat,
          lng: report.mapFeature.geometry.long,
          loading: false,
          error: false,
          crimeSelected: report.crimeCategory._id
        })

        this._getReverseGeocodingFromAPI(report.mapFeature.geometry.lat, report.mapFeature.geometry.long)
      }
    }).catch(err => {
      this.setState({
        error: true,
        errorMessage: err.message,
        success: false
      })
    })
  }

  componentDidMount = () => {
    this.getCrimeListFromAPI()
    this.getReportFromAPI()
  }

  _getReverseGeocodingFromAPI = (lat, long) => {
    MapFeatureService.getReverseGeocoding(lat, long).then(mapfeature => {
      if (mapfeature.features.length > 0) {
        this.setState({
          lat: lat,
          lng: long,
          features: mapfeature.features,
          popupInfo: mapfeature.features
        });
      }
    }).catch(err => {
      this.setState({
        error: true,
        errorMessage: 'No se pudo obtener la información :(',
        success: false
      })
    })
  }

  _onClickHandler = (e) => {
    this._getReverseGeocodingFromAPI(e.lngLat[1], e.lngLat[0])
  }

  _renderPopup() {
    const { popupInfo, lng, lat } = this.state;

    return (popupInfo && lng && lat ) && (
      <Popup tipSize={5}
        anchor="top"
        longitude={this.state.lng}
        latitude={this.state.lat}
        closeOnClick={false}
        onClose={() => this.setState({ popupInfo: null })} >
        <CityInfo info={popupInfo} isFeature={true}/>
      </Popup>
    );
  }

  _renderMarker = () => {
    const { lat, lng } = this.state

    return (lat, lng) && (
      <Marker
        key={`marker-${this.state._id}`}
        longitude={this.state.lng}
        latitude={this.state.lat} >
        <CityPin size={20} />
      </Marker>
    )
  }

  handleChange = name => (e) => {
    this.setState({ [name]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    //limpiamos los mensajes que pudieran generarse
    this.setState({error: false, errorMessage: "", success: false})
    //empezamos con el desmadre
    if (!this.state.crimeSelected) {
      this.setState({ error: true, errorMessage: "Debes seleccionar una categoría", success: false })
      return
    }

    if (!this.state.descripcion || this.state.descripcion.length < 10) {
      this.setState({ error: true, errorMessage: "la descripción debe tener un mínimo de 50 caracteres", success: false })
      return
    }

    //validamos el mapa
    if (!this.state.features) {
      this.setState({ error: true, errorMessage: "Por favor selecciona un punto en el mapa", success: false })
      return
    }

    //creamos el model para el request
    const date = new Date()

    const data = {
      reportId: this.state.report._id,
      descripcion: this.state.descripcion,
      colonia: this.state.features[0].place_name,
      fechaReporte: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
      anio: date.getFullYear,
      mapFeature: {
        _id: this.state.report.mapFeature._id,
        country: '',
        region: '',
        postCode: '',
        district: '',
        place: '',
        locality: '',
        address: this.state.features[0].place_name,
        geometry: {
          lat: this.state.lat,
          long: this.state.lng
        }
      },
      crimeCategoryId: this.state.crimeSelected
    }

    //RECORREMOS LOS FEATURES
    this.state.features.forEach(feature => {
      
      switch(feature.place_type[0]) {
        case 'country': 
          data.mapFeature.country = feature.text
          break;
        case 'region':
          data.mapFeature.region = feature.text
          break;
        case 'place':
          data.mapFeature.place = feature.text
          break;
        case 'locality':
          data.mapFeature.locality = feature.text
          break;
        case 'address':
          data.mapFeature.address = feature.place_name
          break;
        case 'postcode':
          data.mapFeature.postCode = feature.text
          break;
        default:
          break;
      }
    })

    //hacemos el request 
    ReportServices.update(data).then(response => {

      console.log(response)

      this.setState({ 
        error: false,
        errorMessage: "Reporte enviado con exito, gracias ;)",
        success: true
      })
    }).catch(error => {
      this.setState({error: true, errorMessage: error.message, success:false})
    })

  }

  _renderMessage = () => {
    const { classes } = this.props

    const variantMessage = this.state.error ?  'error' : this.state.success ? 'success' : null

    return variantMessage && <MySnackbarContent
      variant={variantMessage}
      className={classes.margin}
      message={this.state.errorMessage}
      onClose={() => this.setState({ error: false, errorMessage: "", success: false })}
      />
  }



  render() {
    const {classes} = this.props
    const {loading} = this.state
    return(
      <Fragment>
        {loading && <LinearProgress color="secondary" />}
        {!loading && <Grid container spacing={16}>
          <Grid item lg={5} xs={12}>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              ¿Qué te pasó?
            </Typography>
            <form name="form" onSubmit={this.handleSubmit}>
              <TextField
                required
                id="descripcion"
                label="Descripcion"
                value={this.state.descripcion}
                className={classes.textField}
                onChange={this.handleChange('descripcion')}
                margin="normal"
                variant="outlined"
                multiline />

              <TextField
                required
                id="crimeSelected"
                select
                label="Selecciona una categoría"
                className={classes.textField}
                value={this.state.crimeSelected}
                onChange={this.handleChange('crimeSelected')}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu,
                  },
                }}
                helperText="Selecciona una categoría ;)"
                margin="normal"
                variant="outlined">
                {this.state.crimeList && this.state.crimeList.map(option => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name + ' / ' + option.category}
                  </MenuItem>
                ))}
              </TextField>
              <Grid container alignItems="center" justify="center">
                <Grid item lg={6}>
                  <Button variant="contained" color="primary" className={classes.button} type="submit">
                    Reportar
                  </Button>
                </Grid>
              </Grid>

            </form>
          </Grid>
          <Grid item lg={7} xs={12}>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Selecciona el punto haciendo click
            </Typography>
            <ReactMapGL
              mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_KEY}
              {...this.state.viewport}
              mapStyle="mapbox://styles/mapbox/streets-v10"
              onViewportChange={(viewport) => this.setState({ viewport })}
              onClick={this._onClickHandler}>

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
          </Grid>
        </Grid>
        }
        {this._renderMessage()}
      </Fragment>
    )
  }
}

UpdateReport.propTypes = {
  classes: PropTypes.object.isRequired,
};

const UpdateReports = withStyles(styles)(UpdateReport)

function mapStateToProps(state) {
  const { user } = state.authentication;
  return {
    user
  };
}

const connectedReportPage = connect(mapStateToProps)(UpdateReports)
export { connectedReportPage as UpdateReport}