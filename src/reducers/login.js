import { 
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT
} from 'constants/auth';

const initialState = {
    loggingIn: false,
    user: {},
    error: ''
};

const login = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return { ...state, loggingIn: true };
        case LOGIN_SUCCESS:
            localStorage['stUser'] = JSON.stringify(action.payload);
            return { ...state, user: action.payload, loggingIn: false };
        case LOGIN_FAILURE:
            return { ...state, loggingIn: false, error: 'Logging error' };
        case LOGOUT:
            localStorage.removeItem('stUser');
            return state;
        default:
            return state;
    }
};

export default login;
