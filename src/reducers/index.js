import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from 'reducers/auth';
import account from 'reducers/account';

export default combineReducers({
    routing: routerReducer,
    auth,
    account
});
