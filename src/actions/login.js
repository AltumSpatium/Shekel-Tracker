import firebaseApp from 'utils/firebase';
import {
    request,
    success,
    failure
} from 'actions/default';
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT
} from 'constants/auth';

const loginRequest = request(LOGIN_REQUEST);
const loginSuccess = success(LOGIN_SUCCESS);
const loginFailure = failure(LOGIN_FAILURE, () => {});

export const login = (email, password) => dispatch => {
    dispatch(loginRequest());
    return firebaseApp.auth().signInWithEmailAndPassword(email, password)
        .then(user => dispatch(loginSuccess(user)))
        .catch(err => loginFailure(err));
};

export const logout = () => dispatch => dispatch(request(LOGOUT)());
