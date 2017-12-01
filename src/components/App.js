import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, Button } from 'semantic-ui-react';
import { login, logout } from 'actions/auth';
import { linkSet } from 'constants/default';

import 'styles/App.css';

class App extends Component {
    static path = '/';

    componentWillMount() {
        let user = localStorage['stUser'];
        if (user) {
            //const { email, password } = JSON.parse(user);
            user = JSON.parse(user);
            //if (email && password) {
            if (user) {
                //this.props.login(email, password);
            }
        }
    }

    logout = () => {
        const { logout, history } = this.props;
        history.push('/');
        logout();
    }

    render() {
        let { user, logout } = this.props;

        user = JSON.parse(localStorage['stUser']);
        const links = user ? linkSet.USERS_LINKS : linkSet.GUESTS_LINKS;
        return (
            <div className='App'>
                <Menu>
                    <Menu.Item header>Shekel Tracker</Menu.Item>
                    {
                        links.map((link, index) => (
                            <Link to={link.path} key={index}>
                                <Menu.Item name={link.name}>{link.name}</Menu.Item>
                            </Link>
                        ))
                    }
                    {
                        user ? (
                            <Menu.Menu position='right'>
                                <Button
                                    negative
                                    color='teal'
                                    icon='log out'
                                    className='logout-button'
                                    onClick={logout}
                                />
                            </Menu.Menu>
                        ) : ''
                    }

                </Menu>
                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLoading: state.auth.isLoading,
    user: state.auth.user,
});

const mapDispatchToProps = dispatch => ({
    login: (...userData) => dispatch(login(...userData)),
    logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
