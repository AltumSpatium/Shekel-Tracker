import React from 'react';
import { Route } from 'react-router';

import App from '../components/App';
import Income from '../components/Income';
import Expenses from '../components/Expenses';
import Planning from '../components/Planning';
import Accounts from '../components/Accounts';

const routes = (
    <div>
        <Route path={App.path} component={App} />
        <Route path={Income.path} component={Income} />
        <Route path={Expenses.path} component={Expenses} />
        <Route path={Planning.path} component={Planning} />
        <Route path={Accounts.path} component={Accounts} />
    </div>
);

export default routes;
