import React, {Fragment} from 'react';
import { withStyles, Grid, TextField, Button, Card, LinearProgress, Typography } from '@material-ui/core'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { userActions } from '../../actions/user.actions'

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

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.props.dispatch(userActions.logout());

        this.state = {
            email: '',
            password: '',
            submitted: false
        };
    }

    handleChange = name => (e) => {
        /*const { name, value } = e.target;
        this.setState({ [name]: value });*/
        this.setState({ [name]: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({ submitted: true });
        const { email, password } = this.state;
        const { dispatch } = this.props;
        if (email && password) {
            dispatch(userActions.login(email, password));
        }
    }

    render() {
        const { loggingIn, loggingError, error } = this.props

        const { classes } = this.props;

        let errorMessage;

        if(loggingError) {
            errorMessage = <div>{error.message}</div>
        }

        return (
            <Fragment>
                {loggingIn &&
                <LinearProgress color="secondary"/>}
                <form name="form" onSubmit={this.handleSubmit} className={classes.container}>
                    
                    <Grid container spacing={8} justify="center" alignItems="center">
                        <Card className={classes.card}>
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
                                            Crear nueva cuenta
                                        </Button>
                                    </Grid>
                                </Grid>
                                {errorMessage}
                            </Grid>
                        </Card>
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
    const { loggingIn, loggingError, error } = state.authentication;
    return {
        loggingIn,
        loggingError,
        error
    };
}

const connectedLoginPage = connect(mapStateToProps)(LoginPages);
export { connectedLoginPage as LoginPage };