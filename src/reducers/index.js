import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from 'reducers/auth';
import account from 'reducers/account';
import income from 'reducers/income';
import expenses from 'reducers/expenses';
import planning from 'reducers/planning';

export default combineReducers({
    routing: routerReducer,
    auth,
    account,
    income,
    expenses,
    planning
});
