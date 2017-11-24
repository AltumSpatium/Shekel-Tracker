import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import register from 'reducers/register';
import login from 'reducers/login';

export default combineReducers({
    routing: routerReducer,
    register,
    login
});
