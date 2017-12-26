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
    getAllIncomes,
    addIncome,
    updateIncome,
    removeIncome,
    clearIncomes
} from 'actions/income';

import 'react-table/react-table.css';
import 'styles/Income.css';

class Income extends Component {
    static path = '/income';

    constructor(props) {
        super(props);

        this.state = {
            addWindow: false,
            editWindow: false,
            removeWindow: false,
            incomeId: null
        };

        this.user = localStorage['stUser'] ? JSON.parse(localStorage['stUser']) : {};

        this.toggleModalWindow = toggleModalWindow.bind(this);
        this.addIncome = this.addIncome.bind(this);
        this.editIncome = this.editIncome.bind(this);
        this.removeIncome = this.removeIncome.bind(this);
    }

    componentDidMount() {
        this.recordsRef = firebaseApp.database().ref('records/' + this.user.uid);

        let newItems = false;
        this.recordsRef.on('child_added', snapshot => {
            if (!newItems) return;

            const newIncome = {
                id: snapshot.key,
                ...snapshot.val()
            };

            this.props.addIncome(newIncome);
        });
        this.recordsRef.on('child_changed', snapshot => {
            const updatedIncome = {
                id: snapshot.key,
                ...snapshot.val()
            };

            this.props.updateIncome(updatedIncome);
        });
        this.recordsRef.on('child_removed', snapshot => {
            this.props.removeIncome(snapshot.key);
        });
        this.props.getAllIncomes()
            .then(() => { newItems = true });
    }

    componentWillUnmount() {
        this.recordsRef.off();
        this.props.clearIncomes();
    }

    addIncome(newRecord) {
        newRecord.type = 'income';
        newRecord.planning = 'false';
        this.recordsRef.push(newRecord);
        this.toggleModalWindow('addWindow', 'incomeId');
    }

    editIncome(income) {
        const id = this.state.incomeId;
        this.recordsRef.child(id).update(income);
        this.toggleModalWindow('editWindow', 'incomeId');
    }

    removeIncome() {
        const id = this.state.incomeId;
        this.recordsRef.child(id).remove();
        this.toggleModalWindow('removeWindow', 'incomeId');
    }

    render() {
        const incomes = this.props.incomes.map(item => {
            item.displayMoney = `${Number(item.money)} ${item.currency}`;
            item.actions = (
                <ActionsButtons 
                    onEditClick={() => this.toggleModalWindow('editWindow', 'incomeId', item.id)}
                    onRemoveClick={() => this.toggleModalWindow('removeWindow', 'incomeId', item.id)} />
            );
            return item;
        });
        const getIncome = id => {
            return incomes.filter(item => item.id === id)[0];
        };

        return (
            <div className='Income'>
                <Header as='h1' textAlign='center'>Income</Header>
                <div className='add-record-panel'>
                    <Button
                        positive
                        className='add-record-button'
                        onClick={() => this.toggleModalWindow('addWindow', 'incomeId')}>Add New Record</Button>
                </div>
                <ReactTable
                    data={incomes}
                    columns={tableHeaders.INCOME}
                    defaultPageSize={10}
                    className='-striped -highlight'
                />

                <RecordWindow 
                    isOpen={this.state.addWindow}
                    headerText='Add new record'
                    submitText='Add'
                    onSubmit={this.addIncome}
                    onCancel={() => this.toggleModalWindow('addWindow', 'incomeId')}
                    recordType='income'
                    allowFutureDate={false}
                />

                <RecordWindow 
                    isOpen={this.state.editWindow}
                    headerText='Edit income'
                    submitText='Edit'
                    onSubmit={this.editIncome}
                    onCancel={() => this.toggleModalWindow('editWindow', 'incomeId')}
                    recordType='income'
                    allowFutureDate={false}
                    values={getIncome(this.state.incomeId)}
                />

                <Modal
                    open={this.state.removeWindow}
                    onClose={() => this.toggleModalWindow('removeWindow', 'incomeId')}
                    size='mini'
                    dimmer='inverted'>
                    <Modal.Header>Confirm income deletion</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to remove this income?</p>
                        <div style={{textAlign: 'center'}}>
                            <Button negative onClick={this.removeIncome}>Remove</Button>
                            <Button onClick={() => this.toggleModalWindow('removeWindow', 'incomeId')}>Cancel</Button>
                        </div>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    incomes: state.income.incomes
});

const mapDispatchToProps = dispatch => ({
    getAllIncomes: () => dispatch(getAllIncomes()),
    addIncome: newIncome => dispatch(addIncome(newIncome)),
    updateIncome: updatedIncome => dispatch(updateIncome(updatedIncome)),
    removeIncome: id => dispatch(removeIncome(id)),
    clearIncomes: () => dispatch(clearIncomes())
});

export default connect(mapStateToProps, mapDispatchToProps)(Income);
