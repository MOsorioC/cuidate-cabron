import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import FormLabel from '@material-ui/core/FormLabel'
import MySnackbarContent from '../MySnackbarContent'
import { userConstants } from '../../constants'

import {UserService} from '../../services/UserService'

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
    width: 70,
    height: 70,
    fontSize: 32
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit,
  },
});

class Profile extends Component {

  state = {
    nombre: '',
    apellido: '',
    sexo: '',
    email: '',
    password: '',
    passwordConfirm: '',
    edit: false,
    error: false,
    message: '',
    success: false
  }

  componentDidMount = () => {
    const { user } = this.props
    console.log(user.sexo)
    this.setState({nombre: user.nombre, apellido: user.apellido, email: user.email, sexo: (user.sexo === 'NONE' ? 'other' : user.sexo)})
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  }

  handleChangeButton = () => {
    this.setState({edit: true})
  }

  handleSubmit = (event) => {
    event.preventDefault()

    const { email, password, apellido, nombre, passwordConfirm, sexo } = this.state;
    const { user, dispatch } = this.props

    //hacemos las validaciones
    if (!nombre || nombre.length < 4) {
      this.setState({error: true, message: "Nombre Requerido"})
      return
    }

    if (!apellido || apellido.length < 4) {
      this.setState({error: true, message: "Apellido Requerido"})
      return
    }

    if (!this.validateEmail(email)) {
      this.setState({ error: true, message: "Email no válido" })
      return
    }

    if (password !== passwordConfirm) {
      this.setState({ error: true, message: "las contraseñas deben ser iguales" })
      return
    }

    if (!this.validatePassword(password)) {
      this.setState({ error: true, message: "La contraseña no cumple con las reglas de seguridad básicas" })
      return
    }

    let newSexo = sexo

    if (newSexo === 'other') {
      newSexo = 'NONE'
    }

    //hacemos el guardado
    const body = {
      _id: user._id,
      nombre,
      apellido,
      email,
      password,
      sexo: newSexo,
      accessToken: user.accessToken
    }

    UserService.update(body).then(response => {
      localStorage.setItem('user', JSON.stringify(body));
      dispatch({ type: userConstants.LOGIN_SUCCESS,  user: body})
      this.setState({ error: false, message: response.message, success: true, edit: false, password: '', passwordConfirm: '' })
    }).catch(err => {
      this.setState({error: true, message: err.message, succes:false})
    })

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

    const { classes} = this.props

    const variantMessage = this.state.error ? 'error' : this.state.success ? 'success' : null

    return variantMessage && <MySnackbarContent
      variant={variantMessage}
      className={classes.margin}
      message={this.state.message}
      onClose={() => this.setState({ error: false, message: "", success: false })}
    />
  }

  render() {
    const {classes, user} = this.props

    const {edit} = this.state

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Grid container spacing={8} justify="center" alignItems="center">
          <Grid item xs={12} lg={8} md={8}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4">
              Mi Perfil
            </Typography>
            <Avatar className={classes.avatar}>{(user.nombre[0] + user.nombre[1]).toUpperCase()}</Avatar>
              <form className={classes.form} onSubmit={this.handleSubmit}>
                <Grid container spacing={8} alignItems="center" justify="center">
                  <Grid item xs={12} lg={6}>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="nombre">Nombre</InputLabel>
                      {edit ? 
                      <Input id="nombre" name="nombre" value={this.state.nombre} onChange={this.handleChange('nombre')} autoFocus /> : 
                        <Input id="nombre" name="nombre" value={this.state.nombre} disabled/>}
                      
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="apellido">Apellido</InputLabel>
                      {edit ? 
                      <Input name="apellido" id="apellido" value={this.state.apellido} onChange={this.handleChange('apellido')}/> :
                        <Input name="apellido" id="apellido" value={this.state.apellido} disabled/>}
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={8} alignItems="center" justify="center">
                  <Grid item xs={12} lg={6}>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="email">Email</InputLabel>
                      {
                        edit ?
                          <Input id="email" name="email" autoComplete="email" value={this.state.email} onChange={this.handleChange('email')}/> : 
                          <Input id="email" name="email" value={this.state.email} disabled/>
                      }
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="password">Password</InputLabel>
                      {
                        edit ? 
                          <Input name="password" type="password" id="password" value={this.state.password} onChange={this.handleChange('password')}/> : 
                          <Input name="password" type="password" id="password" value={this.state.password} disabled/>
                      }
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={8} alignItems="center" justify="center">
                  <Grid item xs={12} lg={6}>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="passwordConfirm">Confirm Password</InputLabel>
                      {
                        edit ?
                          <Input id="passwordConfirm" type="password" name="passwordConfirm" value={this.state.passwordConfirm} onChange={this.handleChange('passwordConfirm')} /> :
                          <Input id="passwordConfirm" type="password" name="passwordConfirm" value={this.state.passwordConfirm} disabled />
                      }
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <FormControl margin="normal" required fullWidth>
                      <FormLabel component="legend">Sexo</FormLabel>
                      <RadioGroup
                        aria-label="Gender"
                        name="gender1"
                        className={classes.group}
                        value={this.state.sexo}
                        onChange={this.handleChange('sexo')}
                      >
                        <FormControlLabel value="H" control={<Radio />} label="H" />
                        <FormControlLabel value="M" control={<Radio />} label="M" />
                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container alignItems="center" justify="center">
                  <Grid item lg={6}>
                    {edit ?  
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.submit}>
                        Guardar Cambios
                      </Button> 
                      : 
                      <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        size="large"
                        className={classes.submit}
                        onClick={this.handleChangeButton}>
                          Editar
                      </Button>
                    }
                  </Grid>
                </Grid>
            </form>
          </Paper>
            {this._renderMessage()}
        </Grid>
        </Grid>
        
      </main>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

const profile = withStyles(styles)(Profile);

function mapStateToProps(state) {
  const { user } = state.authentication;
  return {
    user
  };
}

const connectedProfilePage = connect(mapStateToProps)(profile)
export { connectedProfilePage as Profile }