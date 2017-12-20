import {
    GET_ALL_PLANNING,
    ADD_PLANNING,
    UPDATE_PLANNING,
    REMOVE_PLANNING,
    CLEAR_PLANNING
} from 'constants/planning';

const initialState = {
    planning: []
};

const planning = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_PLANNING:
            return { ...state, planning: action.payload };
        case ADD_PLANNING:
            const planning = state.planning.slice();
            planning.push(action.payload);
            return { ...state, planning };
        case UPDATE_PLANNING:
            const updatedRecord = action.payload;
            return { ...state, planning: state.planning.map(
                item => item.id === updatedRecord.id ? updatedRecord : item) };
        case REMOVE_PLANNING:
            const id = action.payload;
            return { ...state, planning: state.planning.filter(item => item.id !== id) };
        case CLEAR_PLANNING:
                return { ...state, planning: [] };
        default:
            return state;
    }
};

export default planning;
