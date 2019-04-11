import React, {Component, Fragment} from 'react'
import { ReportServices } from '../../services/ReportServices'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactMapGL, { NavigationControl, Marker, Popup, GeolocateControl } from 'react-map-gl'
import CityInfo from '../Maps/CityInfo'
import CityPin from '../Maps/CityPin'
import { Grid, withStyles, TextField, Button, MenuItem, Typography} from '@material-ui/core/'
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

class NewReport extends Component {
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
    success: false
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

  componentDidMount = () => {
    this.getCrimeListFromAPI()
  }

  _onClickHandler = (e) => {
    MapFeatureService.getReverseGeocoding(e.lngLat[1], e.lngLat[0]).then(mapfeature => {
      if (mapfeature.features.length > 0) {
        this.setState({
          lat: e.lngLat[1],
          lng: e.lngLat[0],
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
      descripcion: this.state.descripcion,
      colonia: this.state.features[0].place_name,
      fechaReporte: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
      anio: date.getFullYear,
      mapFeature: {
        country: this.state.features[5].text,
        region: this.state.features[4].text,
        postCode: this.state.features[2].text,
        district: "",
        place: this.state.features[3].text,
        locality: this.state.features[1].text,
        address: this.state.features[0].text,
        geometry: {
          lat: this.state.lat,
          long: this.state.lng
        }
      },
      crimeCategoryId: this.state.crimeSelected
    }
    //hacemos el request 
    ReportServices.sendReport(data).then(response => {
      this.setState({ 
        error: false,
        errorMessage: "Reporte enviado con exito, gracias ;)",
        lat: null,
        lng: null,
        popupInfo: null,
        descripcion: '',
        crimeSelected: '',
        features: null,
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
    return(
      <Fragment>
        <Grid container spacing={16}>
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
        {this._renderMessage()}
      </Fragment>
    )
  }
}

NewReport.propTypes = {
  classes: PropTypes.object.isRequired,
};

const NewReports = withStyles(styles)(NewReport)

function mapStateToProps(state) {
  const { user } = state.authentication;
  return {
    user
  };
}

//export default connect(mapStateToProps)(NewReports)
const connectedReportPage = connect(mapStateToProps)(NewReports)
export {connectedReportPage as NewReport}