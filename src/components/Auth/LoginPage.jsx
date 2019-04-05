import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../../actions/user.actions';

import LinearProgress from '@material-ui/core/LinearProgress'

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

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
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
        const { email, password, submitted } = this.state;
        const { loggingIn, loggingError, error } = this.props


        let errorMessage;
        if(loggingError) {
            errorMessage = <div>{error.message}</div>
        }
        return (
            <div className="col-md-6 col-md-offset-3">
                {loggingIn &&
                <LinearProgress color="secondary"/>}
                <h2>Login</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !email ? ' has-error' : '')}>
                        <label htmlFor="email">Email</label>
                        <input type="text" className="form-control" name="email" value={email} onChange={this.handleChange} />
                        {submitted && !email &&
                            <div className="help-block">Email is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                        {submitted && !password &&
                            <div className="help-block">Password is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Login</button>
                    </div>
                    {errorMessage}
                </form>
                
            </div>
        );
    }
}


function mapStateToProps(state) {
    const { loggingIn, loggingError, error } = state.authentication;
    return {
        loggingIn,
        loggingError,
        error
    };
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as LoginPage };