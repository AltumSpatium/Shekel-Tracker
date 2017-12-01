import firebaseApp from 'utils/firebase';
import {
    success
} from 'actions/default';
import {
    GET_ALL_ACCOUNTS,
    ADD_ACCOUNT,
    UPDATE_ACCOUNT,
    REMOVE_ACCOUNT
} from 'constants/account';

const accountsRef = firebaseApp.database().ref('accounts');
const getAllAccountsSuccess = success(GET_ALL_ACCOUNTS);
const addAccountSuccess = success(ADD_ACCOUNT);
const updateAccountSuccess = success(UPDATE_ACCOUNT);
const removeAccountSuccess = success(REMOVE_ACCOUNT);

export const getAllAccounts = () => dispatch =>
    accountsRef.once('value', snapshot => {
        const accounts = [];
        snapshot.forEach(childSnapshot => {
            const account = {
                id: childSnapshot.key,
                ...childSnapshot.val()
            };
            accounts.push(account);
        });
        return dispatch(getAllAccountsSuccess(accounts));
});

export const addAccount = newAccount => dispatch => dispatch(addAccountSuccess(newAccount));
export const updateAccount = updatedAccount => dispatch => dispatch(updateAccountSuccess(updatedAccount));
export const removeAccount = id => dispatch => dispatch(removeAccountSuccess(id));
