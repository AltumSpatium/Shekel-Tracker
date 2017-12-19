import firebaseApp from 'utils/firebase';
import moment from 'moment';
import {
    success
} from 'actions/default';
import {
    GET_ALL_PLANNING,
    ADD_PLANNING,
    UPDATE_PLANNING,
    REMOVE_PLANNING,
    CLEAR_PLANNING
} from 'constants/planning';

const getAllPlanningSuccess = success(GET_ALL_PLANNING);
const addPlanningSuccess = success(ADD_PLANNING);
const updatePlanningSuccess = success(UPDATE_PLANNING);
const removePlanningSuccess = success(REMOVE_PLANNING);

export const getAllPlanning = () => dispatch => {
    const user = JSON.parse(localStorage['stUser']);
    const recordsRef = firebaseApp.database().ref('records/' + user.uid);
    
    return recordsRef.once('value', snapshot => {
        const planning = [];
        snapshot.forEach(childSnapshot => {
            const record = {
                id: childSnapshot.key,
                ...childSnapshot.val()
            };
            if (new Date(record.date) > moment().toDate())
            planning.push(record);
        });
        return dispatch(getAllPlanningSuccess(planning));
    });
};

export const addPlanning = newRecord => dispatch => dispatch(addPlanningSuccess(newRecord));
export const updatePlanning = updatedRecord => dispatch => dispatch(updatePlanningSuccess(updatedRecord));
export const removePlanning = id => dispatch => dispatch(removePlanningSuccess(id));
export const clearPlanning = () => dispatch => dispatch({type: CLEAR_PLANNING});
