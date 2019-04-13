import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import { withStyles, Grid, TextField, Button, Card, LinearProgress, Typography } from '@material-ui/core'
import { userActions } from '../../actions/user.actions'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import { userConstants } from '../../constants'
import MySnackbarContent from '../MySnackbarContent'

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

    if (signup) {
      return <Redirect to='/login' />;
    }

    return (
      <Fragment>
        {signupRequest &&
          <LinearProgress color="secondary" />}
        <form autoComplete="off" onSubmit={this.handleSubmit} className={classes.container}>
          <Grid container spacing={8} justify="center" alignItems="center">
            <Card className={classes.card}>
              <Typography variant="h3" align="center" color="textSecondary" paragraph>
                Regístrate
              </Typography>
              <Grid item xs={12}>
                <Grid container spacing={8} alignItems="center" justify="center">
                  <Grid item lg={5}>
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
                  <Grid item lg={5}>
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
                  <Grid item lg={5}>
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
                  <Grid item lg={5}>
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
                    />
                  </Grid>
                  <Grid item lg={5}>
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
                    />
                  </Grid>
                </Grid>
                <Grid container alignItems="center" justify="center">
                  <Grid item lg={6}>
                    <Button variant="contained" color="primary" className={classes.button} type="submit">
                      Crear nueva cuenta
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          {this._renderMessage()}
        </form>
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