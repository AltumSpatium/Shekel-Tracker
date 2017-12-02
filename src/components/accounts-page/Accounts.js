import React, { Component } from 'react';
import { Header, Button, Modal } from 'semantic-ui-react';
import ReactTable from 'react-table';
import { tableHeaders } from 'constants/default';
import ActionsButtons from 'components/shared/ActionsButtons';
import AccountWindow from 'components/accounts-page/AccountWindow';
import firebaseApp from 'utils/firebase';
import { connect } from 'react-redux';
import {
    getAllAccounts,
    addAccount,
    updateAccount,
    removeAccount,
    clearAccounts
} from 'actions/account';

import 'styles/Accounts.css';

const user = JSON.parse(localStorage['stUser']);
const accountsRef = firebaseApp.database().ref('accounts/' + user.uid);

class Accounts extends Component {
    static path = '/accounts';

    constructor(props) {
        super(props);

        this.state = {
            addWindow: false,
            editWindow: false,
            removeWindow: false,
            accountId: null
        };

        this.toggleModalWindow = this.toggleModalWindow.bind(this);
        this.addAccount = this.addAccount.bind(this);
        this.editAccount = this.editAccount.bind(this);
        this.removeAccount = this.removeAccount.bind(this);
    }

    componentWillMount() {
        let newItems = false;
        accountsRef.on('child_added', snapshot => {
            if (!newItems) return;


            const newAccount = {
                id: snapshot.key,
                ...snapshot.val()
            };
            this.props.addAccount(newAccount);
        });
        accountsRef.on('child_changed', snapshot => {
            const updatedAccount = {
                id: snapshot.key,
                ...snapshot.val()
            };
            this.props.updateAccount(updatedAccount);
        });
        accountsRef.on('child_removed', snapshot => {
            this.props.removeAccount(snapshot.key);
        });
        this.props.getAllAccounts()
            .then(() => { newItems = true });
    }

    componentWillUnmount() {
        accountsRef.off();
        this.props.clearAccounts();
    }

    addAccount(newAccount) {
        accountsRef.push(newAccount);
        this.toggleModalWindow('addWindow', null);
    }

    editAccount(account) {
        const id = this.state.accountId;
        accountsRef.child(id).update(account);
        this.toggleModalWindow('editWindow', null);
    }

    removeAccount() {
        const id = this.state.accountId;
        accountsRef.child(id).remove();
        this.toggleModalWindow('removeWindow', null);
    }

    toggleModalWindow(windowName, accountId) {
        const windowState = this.state[windowName];
        this.setState({[windowName]: !windowState, accountId});
    }

    render() {
        const accounts = this.props.accounts.map(item => {
            item.actions = (
                <ActionsButtons 
                    onEditClick={() => this.toggleModalWindow('editWindow', item.id)}
                    onRemoveClick={() => this.toggleModalWindow('removeWindow', item.id)} />
            );
            return item;
        });
        const getAccount = id => {
            return accounts.filter(item => item.id === id)[0];
        };

        return (
            <div className='Accounts'>
                <Header as='h1' textAlign='center'>Accounts</Header>
                <Button
                    positive
                    className='add-account-button'
                    onClick={() => this.toggleModalWindow('addWindow', null)}>Add New Account</Button>
                <ReactTable
                    data={accounts}
                    columns={tableHeaders.ACCOUNTS}
                    defaultPageSize={10}
                    className='-striped -highlight table'
                />

                <AccountWindow 
                    isOpen={this.state.addWindow}
                    headerText='Add new account'
                    submitText='Add'
                    onSubmit={this.addAccount}
                    onCancel={() => this.toggleModalWindow('addWindow', null)}
                />

                <AccountWindow 
                    isOpen={this.state.editWindow}
                    headerText='Edit account'
                    submitText='Edit'
                    onSubmit={this.editAccount}
                    onCancel={() => this.toggleModalWindow('editWindow', null)}
                    values={getAccount(this.state.accountId)}
                />

                <Modal
                    open={this.state.removeWindow}
                    onClose={() => this.toggleModalWindow('removeWindow', null)}
                    size='mini'
                    dimmer='inverted'>
                    <Modal.Header>Confirm account deletion</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to remove this account?</p>
                        <div style={{textAlign: 'center'}}>
                            <Button negative onClick={this.removeAccount}>Remove</Button>
                            <Button onClick={() => this.toggleModalWindow('removeWindow', null)}>Cancel</Button>
                        </div>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    accounts: state.account.accounts
});

const mapDispatchToProps = dispatch => ({
    getAllAccounts: () => dispatch(getAllAccounts()),
    addAccount: newAccount => dispatch(addAccount(newAccount)),
    updateAccount: updatedAccount => dispatch(updateAccount(updatedAccount)),
    removeAccount: id => dispatch(removeAccount(id)),
    clearAccounts: () => dispatch(clearAccounts())
});

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
