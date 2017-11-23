import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from 'actions/login'

import 'styles/Login.css';

class Login extends Component {
    static path = '/login';

    constructor(props) {
        super(props);

        this.state= {
            email: '',
            password: ''
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();
        const { email, password } = this.state;
        this.props.login(email, password)
            .then(() => this.props.history.push('/'));
    }

    onChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value})
    }

    render() {
        const { email, password } = this.state;

        return (
            <div className="Login">
                <div className="">
                    <h3>Log in</h3>
                    <form className="" onSubmit={e => this.onSubmit(e)}>
                        <input type="text" name="email" value={email} onChange={e => this.onChange(e)} /><br />
                        <input type="password" name="password" value={password} onChange={e => this.onChange(e)} /><br />
                        <button>Submit</button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loggingIn: state.login.loggingIn
});

const mapDispatchToProps = dispatch => ({
    login: (...userData) => dispatch(login(...userData))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
