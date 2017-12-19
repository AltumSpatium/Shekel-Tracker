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
    getAllPlanning,
    addPlanning,
    updatePlanning,
    removePlanning,
    clearPlanning
} from 'actions/planning';

import 'styles/Planning.css';

const user = localStorage['stUser'] ? JSON.parse(localStorage['stUser']) : {}; // FIX DAT

class Planning extends Component {
    static path = '/planning';

    constructor() {
        super();

        this.state = {
            addIncomeWindow: false,
            addExpenseWindow: false,
            editWindow: false,
            removeWindow: false,
            planningId: null,

            recordType: 'income'
        };

        this.recordsRef = firebaseApp.database().ref('records/' + user.uid);

        this.toggleModalWindow = toggleModalWindow.bind(this);
        this.addIncome = this.addIncome.bind(this);
        this.addExpense = this.addExpense.bind(this);
        this.editRecord = this.editRecord.bind(this);
        this.removeRecord = this.removeRecord.bind(this);
    }

    componentDidMount() {
        this.recordsRef = firebaseApp.database().ref('records/' + user.uid);

        let newItems = false;
        this.recordsRef.on('child_added', snapshot => {
            if (!newItems) return;

            const newRecord = {
                id: snapshot.key,
                ...snapshot.val()
            };

            this.props.addPlanning(newRecord);
        });
        this.recordsRef.on('child_changed', snapshot => {
            const updatedRecord = {
                id: snapshot.key,
                ...snapshot.val()
            };

            this.props.updatePlanning(updatedRecord);
        });
        this.recordsRef.on('child_removed', snapshot => {
            this.props.removePlanning(snapshot.key);
        });
        this.props.getAllPlanning()
            .then(() => { newItems = true });
    }

    componentWillUnmount() {
        this.recordsRef.off();
        this.props.clearPlanning();
    }

    addIncome(newRecord) {
        newRecord.type = 'income';
        newRecord.planning = true;
        this.recordsRef.push(newRecord);
        this.toggleModalWindow('addIncomeWindow', 'planningId');
    }

    addExpense(newRecord) {
        newRecord.type = 'expense';
        newRecord.planning = true;
        this.recordsRef.push(newRecord);
        this.toggleModalWindow('addExpenseWindow', 'planningId');
    }

    editRecord(record) {
        const id = this.state.planningId;
        this.recordsRef.child(id).update(record);
        this.toggleModalWindow('editWindow', 'planningId');
    }

    removeRecord() {
        const id = this.state.planningId;
        this.recordsRef.child(id).remove();
        this.toggleModalWindow('removeWindow', 'planningId');
    }

    render() {
        const planning = this.props.planning.map(item => {
            if (item.type === 'income') {
                item.displayMoney = (<div className='cell-money-green'>{`${item.money} ${item.currency}`}</div>);
            } else {
                item.displayMoney = (<div className='cell-money-red'>{`${item.money} ${item.currency}`}</div>);
            }
            item.actions = (
                <ActionsButtons 
                    onEditClick={() => {
                        const recordType = item.type === 'income' ? 'income' : 'expenses';
                        this.setState({recordType});
                        this.toggleModalWindow('editWindow', 'planningId', item.id)
                    }}
                    onRemoveClick={() => this.toggleModalWindow('removeWindow', 'planningId', item.id)} />
            );
            return item;
        });
        const getPlanning = id => {
            return planning.filter(item => item.id === id)[0];
        };

        return (
            <div className='Planning'>
                <Header as='h1' textAlign='center'>Planning</Header>
                <div className='add-record-panel'>
                    <Button
                        positive
                        className='add-record-button'
                        onClick={() => this.toggleModalWindow('addIncomeWindow', 'planningId')}>Add New Income</Button>
                    <br />
                    <Button
                        negative
                        className='add-record-button'
                        onClick={() => this.toggleModalWindow('addExpenseWindow', 'planningId')}>Add New Expense</Button>
                </div>
                <ReactTable
                    data={planning}
                    columns={tableHeaders.PLANNING}
                    defaultPageSize={10}
                    className='-striped -highlight'
                />

                <RecordWindow 
                    isOpen={this.state.addIncomeWindow}
                    headerText='Add new income'
                    submitText='Add'
                    onSubmit={this.addIncome}
                    onCancel={() => this.toggleModalWindow('addIncomeWindow', 'planningId')}
                    recordType='income'
                    allowFutureDate={true}
                />

                <RecordWindow 
                    isOpen={this.state.addExpenseWindow}
                    headerText='Add new expense'
                    submitText='Add'
                    onSubmit={this.addExpense}
                    onCancel={() => this.toggleModalWindow('addExpenseWindow', 'planningId')}
                    recordType='expenses'
                    allowFutureDate={true}
                />

                <RecordWindow 
                    isOpen={this.state.editWindow}
                    headerText='Edit record'
                    submitText='Edit'
                    onSubmit={this.editRecord}
                    onCancel={() => this.toggleModalWindow('editWindow', 'planningId')}
                    recordType={this.state.recordType}
                    allowFutureDate={true}
                    values={getPlanning(this.state.planningId)}
                />

                <Modal
                    open={this.state.removeWindow}
                    onClose={() => this.toggleModalWindow('removeWindow', 'planningId')}
                    size='mini'
                    dimmer='inverted'>
                    <Modal.Header>Confirm record deletion</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to remove this record?</p>
                        <div style={{textAlign: 'center'}}>
                            <Button negative onClick={this.removeRecord}>Remove</Button>
                            <Button onClick={() => this.toggleModalWindow('removeWindow', 'planningId')}>Cancel</Button>
                        </div>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    planning: state.planning.planning
});

const mapDispatchToProps = dispatch => ({
    getAllPlanning: () => dispatch(getAllPlanning()),
    addPlanning: newRecord => dispatch(addPlanning(newRecord)),
    updatePlanning: updatedRecord => dispatch(updatePlanning(updatedRecord)),
    removePlanning: id => dispatch(removePlanning(id)),
    clearPlanning: () => dispatch(clearPlanning())
});

export default connect(mapStateToProps, mapDispatchToProps)(Planning);
