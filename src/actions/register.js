import firebaseApp from 'utils/firebase';
import {
    request,
    success,
    failure
} from 'actions/default';
import {
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE
} from 'constants/auth';

const registerRequest = request(REGISTER_REQUEST);
const registerSuccess = success(REGISTER_SUCCESS);
const registerFailure = failure(REGISTER_FAILURE, err => {console.log(err)});

export const register = (email, password) => dispatch => {
    dispatch(registerRequest());
    return firebaseApp.auth().createUserWithEmailAndPassword(email, password)
        .then(user => {
            dispatch(registerSuccess());
            return user;
        })
        .catch(err => dispatch(registerFailure(err)));
};
