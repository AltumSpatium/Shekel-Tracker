import React from 'react';
import { Route } from 'react-router';

import App from '../components/App';

const Sample = () => (<p>Sample component</p>)

const routes = (
    <div>
        <Route path={App.path} component={App} />
        <Route path="/income" component={Sample} />
        <Route path="/expenses" component={Sample} />
        <Route path="/planning" component={Sample} />
        <Route path="/accounts" component={Sample} />
    </div>
);

export default routes;
