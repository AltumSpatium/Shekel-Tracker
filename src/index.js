import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import { createBrowserHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store/configureStore';

import App from './components/App';

import './styles/index.css';

const store = configureStore();
const history = syncHistoryWithStore(createBrowserHistory(), store);

render(
    <Provider store={store}>
        <Router history={history}>
            <Route path={App.path} component={App} />
        </Router>
    </Provider>,
    document.getElementById('root')
);
