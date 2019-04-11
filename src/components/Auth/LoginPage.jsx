import React, {Fragment} from 'react';
import { withStyles, Grid, TextField, Button, LinearProgress, Typography } from '@material-ui/core'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { userActions } from '../../actions/user.actions'
import { Redirect } from 'react-router-dom'
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
    },
    margin: {
        margin: theme.spacing.unit,
    },
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
                        <Typography variant="h3" align="center" color="textSecondary" paragraph>
                            Inicia Sesión
                        </Typography>
                        <Grid item xs={12}>
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
                                        type="email"
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
                            </Grid>
                            <Grid container alignItems="center" justify="center">
                                <Grid item lg={6}>
                                    <Button variant="contained" color="primary" className={classes.button} type="submit">
                                        Acceder
                                    </Button>
                                </Grid>
                            </Grid>
                            {this._renderMessage()}
                        </Grid>
                        
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