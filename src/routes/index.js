import React from 'react';
import { Switch, Redirect } from 'react-router';
import PublicRoute from 'routes/PublicRoute';
import PrivateRoute from 'routes/PrivateRoute';

import App from 'components/App';
import Income from 'components/Income';
import Expenses from 'components/Expenses';
import Planning from 'components/Planning';
import Accounts from 'components/Accounts';
import Reports from 'components/Reports';

import Register from 'components/Register';
import Login from 'components/Login';

const routes = (
    <Switch>
        <PublicRoute exact path={Register.path} component={Register} />
        <PublicRoute exact path={Login.path} component={Login} />
        <Redirect exact from={App.path} to={Income.path} />
        <App>
            <PrivateRoute path={Income.path} component={Income} />
            <PrivateRoute path={Expenses.path} component={Expenses} />
            <PrivateRoute path={Planning.path} component={Planning} />
            <PrivateRoute path={Accounts.path} component={Accounts} />
            <PrivateRoute path={Reports.path} component={Reports} />
        </App>
    </Switch>
);

export default routes;
