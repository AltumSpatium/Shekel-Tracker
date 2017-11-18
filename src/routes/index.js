import React from 'react';
import { Route } from 'react-router';

import App from 'components/App';
import Income from 'components/Income';
import Expenses from 'components/Expenses';
import Planning from 'components/Planning';
import Accounts from 'components/Accounts';
import Reports from 'components/Reports';

const routes = (
    <div>
        <Route path={App.path} component={App} />
        <Route path={Income.path} component={Income} />
        <Route path={Expenses.path} component={Expenses} />
        <Route path={Planning.path} component={Planning} />
        <Route path={Accounts.path} component={Accounts} />
        <Route path={Reports.path} component={Reports} />
    </div>
);

export default routes;
