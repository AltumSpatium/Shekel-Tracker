import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { getAllIncomes } from 'actions/income';
import { getAllExpenses } from 'actions/expenses';
import { getAllAccounts } from 'actions/account';
import chartConstants from 'constants/reports';
import createChart from 'utils/chart';

class ChartsPanel extends Component {
    constructor(props) {
        super(props);
        this.createReport = this.createReport.bind(this);
    }

    componentWillMount() {
        const {
            Incomes, Expenses, Accounts,
            getAllIncomes, getAllExpenses, getAllAccounts
        } = this.props;
        if (!Incomes.length) { getAllIncomes(); }
        if (!Expenses.length) { getAllExpenses(); }
        if (!Accounts.length) { getAllAccounts(); }
    }

    createReport() {
        // const data = this.props[this.state.from];
        // createChart({ ...this.state, data, accountNames: this.props.Accounts });
    }

    render() {
        return (
            <div>
                <Button
                    positive className='centered' content='Create report'
                    disabled={!this.props.canBeReported}
                    onClick={this.createReport} />
                <div id='chart' className='chart-wrapper' />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    Incomes: state.income.incomes,
    Expenses: state.expenses.expenses,
    Accounts: state.account.accounts
});

const mapDispatchToProps = dispatch => ({
    getAllIncomes: () => dispatch(getAllIncomes()),
    getAllExpenses: () => dispatch(getAllExpenses()),
    getAllAccounts: () => dispatch(getAllAccounts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChartsPanel);