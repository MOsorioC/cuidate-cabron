import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import { withStyles, Grid, TextField, Button, Card, LinearProgress, Typography } from '@material-ui/core'
import { userActions } from '../../actions/user.actions'
import { connect } from 'react-redux'
import { userConstants } from '../../constants'
import MySnackbarContent from '../MySnackbarContent'
import { Link } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'

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
  card: {
    width: '60%',
    padding: 20,
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  }
});

class SignUp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      passwordConfirm: ''
    };
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  }
  
  handleSubmit = (event) => {
    event.preventDefault();
    
    const { email, password, apellido, nombre, passwordConfirm } = this.state;

    const { dispatch } = this.props;

    //hacemos las validaciones
    if (!nombre || nombre.length < 4) {
      dispatch(userActions.errorMessage("Nombre requerido", userConstants.SIGNUP_FAILURE))
      return
    }

    if (!apellido || apellido.length < 4) {
      dispatch(userActions.errorMessage("Apellido requerido", userConstants.SIGNUP_FAILURE))
      return
    }

    if (!this.validateEmail(email)) {
      dispatch(userActions.errorMessage("Email no válido", userConstants.SIGNUP_FAILURE))
      return
    }

    if (password !== passwordConfirm) {
      dispatch(userActions.errorMessage("Las contraseñas no coinciden", userConstants.SIGNUP_FAILURE))
      return
    }

    if (!this.validatePassword(password)) {
      dispatch(userActions.errorMessage("La contraseña no cumple con las reglas de seguridad básicas", userConstants.SIGNUP_FAILURE))
      return
    }

    dispatch(userActions.signup(nombre, apellido, email, password))
  }

  validateEmail = (email) => {
    var reg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return reg.test(String(email).toLowerCase());
  }

  validatePassword = (password) => {
    var reg = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/);
    return reg.test(password)
  }

  _renderMessage = () => {
    
    const { classes,
      signupError,
      error} = this.props

    const variantMessage = signupError ? 'error' : null

    return variantMessage && <MySnackbarContent
      variant={variantMessage}
      className={classes.margin}
      message={error.message}
    />
  }


  render() {
    const { classes } = this.props;

    const { signupRequest, signup } = this.props

    

    return (
      <Fragment>
        {signupRequest &&
          <LinearProgress color="secondary" />}
        {!signup ? <form autoComplete="off" onSubmit={this.handleSubmit} className={classes.container}>
          <Grid container spacing={8} justify="center" alignItems="center">
            <Paper className={classes.paper}>
              <Typography variant="h3" align="center" color="textSecondary" paragraph>
                Regístrate
              </Typography>
              <Grid item xs={12}>
                <Grid container spacing={8} alignItems="center" justify="center">
                  <Grid item lg={5} xs={12}>
                    <TextField
                      required
                      id="nombre"
                      label="Nombre"
                      value={this.state.nombre}
                      className={classes.textField}
                      onChange={this.handleChange('nombre')}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item lg={5} xs={12}>
                    <TextField
                      required
                      id="apellido"
                      label="Apellidos"
                      value={this.state.apellido}
                      className={classes.textField}
                      onChange={this.handleChange('apellido')}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={8} alignItems="center" justify="center">
                  <Grid item lg={5} xs={12}>
                    <TextField
                      required
                      id="email"
                      label="Email"
                      value={this.state.email}
                      className={classes.textField}
                      onChange={this.handleChange('email')}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={8} alignItems="center" justify="center">
                  <Grid item lg={5} xs={12}>
                    <TextField
                      required
                      id="password"
                      label="Password"
                      value={this.state.password}
                      className={classes.textField}
                      onChange={this.handleChange('password')}
                      type="password"
                      margin="normal"
                      variant="outlined"
                      helperText="Debe contener al menos 8 digitos, 1 Mayúscula, 1 número y 1 caracter especial"
                    />
                  </Grid>
                  <Grid item lg={5} xs={12}>
                    <TextField
                      required
                      id="passwordConfirm"
                      label="Password Confirm"
                      value={this.state.passwordConfirm}
                      className={classes.textField}
                      onChange={this.handleChange('passwordConfirm')}
                      type="password"
                      margin="normal"
                      variant="outlined"
                      helperText="Debe contener al menos 8 digitos, 1 Mayúscula, 1 número y 1 caracter especial"
                    />
                  </Grid>
                </Grid>
                <Grid container alignItems="center" justify="center">
                  <Grid item lg={6} xs={12}>
                    <Button variant="contained" color="primary" className={classes.button} type="submit">
                      Crear nueva cuenta
                    </Button>
                  </Grid>
                  <Grid item lg={12} xs={12}>
                    <Link to={'/signup'}>
                      <Typography variant="h7" align="center" color="primary" paragraph>
                        ¿tienes una cuenta? inicia sesión
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          {this._renderMessage()}
        </form>: 
          <Grid container spacing={16} justify="center" alignItems="center" className={classes.content}>
            <Paper className={classes.paper}>
              <Grid item xs={6} justify="center" alignItems="center">
                <Typography variant="h5" align="center" color="secondary" paragraph>
                  Te enviamos un correo de correo de confirmación para que puedas acceder al sitio ;)
              </Typography>
                <Link to={'/'}>
                  <Typography variant="h6" align="center" color="primary" paragraph>
                    Ir al sitio principal
                  </Typography>
                </Link>
              </Grid>
            </Paper>
        </Grid>
      }
      </Fragment>
    )
  }
}

SignUp.propTypes = {
  classes: PropTypes.object.isRequired,
};

const signUpPage = withStyles(styles)(SignUp)

function mapStateToProps(state) {
  const { signup, signupError, error, signupRequest } = state.authentication;
  return {
    signup,
    signupError,
    error,
    signupRequest
  };
}

const conectedSignUpPage = connect(mapStateToProps)(signUpPage);
export {conectedSignUpPage as SignUp}