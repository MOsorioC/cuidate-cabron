import React, {Fragment} from 'react';
import { withStyles, Grid, TextField, Button, LinearProgress, Typography } from '@material-ui/core'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { userActions } from '../../actions/user.actions'
import { Redirect } from 'react-router-dom'
import { userConstants } from '../../constants'
import MySnackbarContent from '../MySnackbarContent'
import Paper from '@material-ui/core/Paper'
import { Link } from 'react-router-dom'

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
    margin: {
        margin: theme.spacing.unit,
    },
    paper: {
        marginTop: theme.spacing.unit * 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    }
});

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.props.dispatch(userActions.logout());

        this.state = {
            email: '',
            password: '',
            submitted: false,
            error: false, errorMessage: "", success: false
        };
    }

    handleChange = name => (e) => {
        this.setState({ [name]: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({ submitted: true });
        const { email, password } = this.state;
        const { dispatch } = this.props;
        if (email && password) {
            dispatch(userActions.login(email, password))
        } else {
            const error = { success: false, message: "Favor de llenar todos los campos" }
            dispatch({ type: userConstants.LOGIN_FAILURE, error})
        }
    }

    _renderMessage = () => {
        const { classes, loggingError, error } = this.props

        const variantMessage = loggingError ?  'error' : null

        return variantMessage && <MySnackbarContent
            variant={variantMessage}
            className={classes.margin}
            message={error.message}
        />
    }

    render() {
        const { loggingIn, loggedIn } = this.props

        const { classes } = this.props;

        if (loggedIn) {
            return <Redirect to='/user/dashboard' />;
        }

        return (
            <Fragment>
                {loggingIn &&
                <LinearProgress color="secondary"/>}
                <form name="form" onSubmit={this.handleSubmit} className={classes.container}>
                    <Grid container spacing={8} justify="center" alignItems="center">
                        <Paper className={classes.paper}>
                        <Typography variant="h3" align="center" color="textSecondary">
                            Inicia Sesión
                        </Typography>
                        <Grid item xs={12} lg={12}>
                            <Grid container spacing={8} alignItems="center" justify="center">
                                <Grid item lg={12} xs={12}>
                                    <TextField
                                        required
                                        id="email"
                                        label="Email"
                                        value={this.state.email}
                                        className={classes.textField}
                                        onChange={this.handleChange('email')}
                                        margin="normal"
                                        variant="outlined"
                                        type="email"
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={8} alignItems="center" justify="center">
                                <Grid item lg={12} xs={12}>
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
                            </Grid>
                            <Grid container alignItems="center" justify="center">
                                <Grid item lg={6} xs={12}>
                                    <Button variant="contained" color="primary" className={classes.button} type="submit">
                                        Acceder
                                    </Button>
                                </Grid>
                                <Grid item lg={12} xs={12}>
                                    <Link to={'/signup'}>
                                        <Typography variant="h7" align="center" color="primary" paragraph>
                                            ¿no tienes cuenta? regístrate
                                        </Typography>
                                    </Link>
                                </Grid>
                            </Grid>
                            {this._renderMessage()}
                        </Grid>
                        </Paper>
                    </Grid>

                </form>
                
            </Fragment>
        );
    }
}

LoginPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

const LoginPages = withStyles(styles)(LoginPage)


function mapStateToProps(state) {
    const { loggingIn, loggingError, error, loggedIn } = state.authentication;
    return {
        loggingIn,
        loggingError,
        loggedIn,
        error
    };
}

const connectedLoginPage = connect(mapStateToProps)(LoginPages);
export { connectedLoginPage as LoginPage };