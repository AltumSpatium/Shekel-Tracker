import React, { Component } from 'react';
import { Header, Button, Modal } from 'semantic-ui-react';
import ReactTable from 'react-table';
import { tableHeaders } from 'constants/default';
import ActionsButtons from 'components/shared/ActionsButtons';
import RecordWindow from 'components/shared/RecordWindow';
import firebaseApp from 'utils/firebase';
import toggleModalWindow from 'utils/toggleModalWindow';
import { connect } from 'react-redux';
import {
    getAllExpenses,
    addExpense,
    updateExpense,
    removeExpense,
    clearExpenses
} from 'actions/expenses';

import 'styles/Expenses.css';

// TODO: Add processing of planned expenses

const user = localStorage['stUser'] ? JSON.parse(localStorage['stUser']) : {}; // FIX DAT

class Expenses extends Component {
    static path = '/expenses';

    constructor(props) {
        super(props);

        this.state = {
            addWindow: false,
            editWindow: false,
            removeWindow: false,
            expenseId: null
        };

        this.toggleModalWindow = toggleModalWindow.bind(this);
        this.addExpense = this.addExpense.bind(this);
        this.editExpense = this.editExpense.bind(this);
        this.removeExpense = this.removeExpense.bind(this);
    }

    componentDidMount() {
        this.recordsRef = firebaseApp.database().ref('records/' + user.uid);

        let newItems = false;
        this.recordsRef.on('child_added', snapshot => {
            if (!newItems) return;

            const newExpense = {
                id: snapshot.key,
                ...snapshot.val()
            };

            this.props.addExpense(newExpense);
        });
        this.recordsRef.on('child_changed', snapshot => {
            const updatedExpense = {
                id: snapshot.key,
                ...snapshot.val()
            };

            this.props.updateExpense(updatedExpense);
        });
        this.recordsRef.on('child_removed', snapshot => {
            this.props.removeExpense(snapshot.key);
        });
        this.props.getAllExpenses()
            .then(() => { newItems = true });
    }

    componentWillUnmount() {
        this.recordsRef.off();
        this.props.clearExpenses();
    }

    addExpense(newRecord) {
        newRecord.type = 'expense';
        newRecord.planning = false;
        this.recordsRef.push(newRecord);
        this.toggleModalWindow('addWindow', 'expenseId');
    }

    editExpense(expense) {
        const id = this.state.expenseId;
        this.recordsRef.child(id).update(expense);
        this.toggleModalWindow('editWindow', 'expenseId');
    }

    removeExpense() {
        const id = this.state.expenseId;
        this.recordsRef.child(id).remove();
        this.toggleModalWindow('removeWindow', 'expenseId');
    }

    render() {
        const expenses = this.props.expenses.map(item => {
            item.displayMoney = `${item.money} ${item.currency}`;
            item.actions = (
                <ActionsButtons 
                    onEditClick={() => this.toggleModalWindow('editWindow', 'expenseId', item.id)}
                    onRemoveClick={() => this.toggleModalWindow('removeWindow', 'expenseId', item.id)} />
            );
            return item;
        });
        const getExpense = id => {
            return expenses.filter(item => item.id === id)[0];
        };

        return (
            <div className='Expenses'>
                <Header as='h1' textAlign='center'>Expenses</Header>
                <div className='add-record-panel'>
                    <Button
                        negative
                        className='add-record-button'
                        onClick={() => this.toggleModalWindow('addWindow', 'expenseId')}>Add New Record</Button>
                </div>
                <ReactTable
                    data={expenses}
                    columns={tableHeaders.EXPENSES}
                    defaultPageSize={10}
                    className='-striped -highlight'
                />

                <RecordWindow 
                    isOpen={this.state.addWindow}
                    headerText='Add new record'
                    submitText='Add'
                    onSubmit={this.addExpense}
                    onCancel={() => this.toggleModalWindow('addWindow', 'expenseId')}
                    recordType='expenses'
                    allowFutureDate={false}
                />

                <RecordWindow 
                    isOpen={this.state.editWindow}
                    headerText='Edit expense'
                    submitText='Edit'
                    onSubmit={this.editExpense}
                    onCancel={() => this.toggleModalWindow('editWindow', 'expenseId')}
                    recordType='expenses'
                    allowFutureDate={false}
                    values={getExpense(this.state.expenseId)}
                />

                <Modal
                    open={this.state.removeWindow}
                    onClose={() => this.toggleModalWindow('removeWindow', 'expenseId')}
                    size='mini'
                    dimmer='inverted'>
                    <Modal.Header>Confirm expense deletion</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to remove this expense?</p>
                        <div style={{textAlign: 'center'}}>
                            <Button negative onClick={this.removeExpense}>Remove</Button>
                            <Button onClick={() => this.toggleModalWindow('removeWindow', 'expenseId')}>Cancel</Button>
                        </div>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    expenses: state.expenses.expenses
});

const mapDispatchToProps = dispatch => ({
    getAllExpenses: () => dispatch(getAllExpenses()),
    addExpense: newExpense => dispatch(addExpense(newExpense)),
    updateExpense: updatedExpense => dispatch(updateExpense(updatedExpense)),
    removeExpense: id => dispatch(removeExpense(id)),
    clearExpenses: () => dispatch(clearExpenses())
});

export default connect(mapStateToProps, mapDispatchToProps)(Expenses);
