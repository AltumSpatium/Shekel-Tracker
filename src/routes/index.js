import React from 'react';
import { Switch, Redirect } from 'react-router';
import PublicRoute from 'routes/PublicRoute';
import PrivateRoute from 'routes/PrivateRoute';

import App from 'components/App';
import Income from 'components/income-page/Income';
import Expenses from 'components/expenses-page/Expenses';
import Planning from 'components/planning-page/Planning';
import Accounts from 'components/accounts-page/Accounts';
import Reports from 'components/reports-page/Reports';

import Info from 'components/info-page/Info';
import Register from 'components/register-page/Register';
import Login from 'components/login-page/Login';

const routes = (
    <Switch>
        <PublicRoute exact path={Info.path} component={Info} />
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
