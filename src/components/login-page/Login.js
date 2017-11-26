import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { login } from 'actions/auth'
import UserForm from 'components/shared/UserForm';

import 'styles/Login.css';

class Login extends Component {
    static path = '/login';

    onSubmit = (email, password) => {
        const { login, history } = this.props;
        login(email, password);
        // .then(() => this.props.history.push('/'));
        history.push('/income');
    }

    render() {
        return (
            <div className="Login">
                <p>
                    New to Shekel Tracker?
                    <Link to={'/register'}> Create an account. </Link>
                </p>
                <UserForm
                    title='Login'
                    isLoading={this.props.isLoading}
                    onSubmit={this.onSubmit}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLoading: state.auth.isLoading
});

const mapDispatchToProps = dispatch => ({
    login: (...userData) => dispatch(login(...userData))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
