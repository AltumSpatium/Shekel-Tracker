import { 
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
} from 'constants/auth';

const initialState = {
    registering: false,
    error: ''
};

const register = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_REQUEST:
            return { ...state, registering: true };
        case REGISTER_SUCCESS:
            return { ...state, registering: false };
        case REGISTER_FAILURE:
            return { ...state, registering: false, error: 'Registration error' };
        default:
            return state;
    }
};

export default register;
