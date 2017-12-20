import React, { Component } from 'react';
import { Header, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { getAllIncomes } from 'actions/income';
import { getAllExpenses } from 'actions/expenses';
import chartConstants from 'constants/reports';
import createChart from 'utils/chart';

import 'styles/Reports.css';
import 'react-datepicker/dist/react-datepicker.css';

class Reports extends Component {
    static path = '/reports';

    constructor(props) {
        super(props);

        this.state = {
            from: null,
            period: null,
            startDate: null,
            endDate: null,
        };

        this.onChange = this.onChange.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.createChart = this.createChart.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
    }

    componentDidMount() {
        this.props.getAllIncomes();
        this.props.getAllExpenses();
    }

    onChange(event, data) {
        this.setState({ [data.name]: data.value }, () => this.createChart());
    }

    onChangeDate(date, name) {
        this.setState({ [name]: date }, () => this.createChart());
    }

    getOptions(array) {
        return array.map(f => ({ key: f, value: f, text: f }));
    }

    createChart() {
        const data = this.props[this.state.from];
        createChart({ ...this.state, data });
    }

    render() {
        const { from, period, startDate, endDate } = this.state;

        const daterange = period === chartConstants.DATE_RANGE_PERIOD ? (
            <div>
                <DatePicker
                    placeholderText='Select start date' className='date-input' dateFormat='YYYY/MM/DD'
                    onChange={(m) => this.onChangeDate(m, 'startDate')}
                    selectsStart selected={startDate} startDate={startDate} endDate={endDate}
                />
                <DatePicker
                    placeholderText='Select end date' className='date-input' dateFormat='YYYY/MM/DD'
                    onChange={(m) => this.onChangeDate(m, 'endDate')}
                    selectsEnd selected={endDate} startDate={startDate} endDate={endDate}
                />
            </div>
        ) : null;

        return (
            <div className='Reports'>
                <Header as='h1' textAlign='center'>Reports</Header>

                <div className='reports-filters'>
                    <Dropdown
                        placeholder='Select source' name='from' selection
                        options={this.getOptions(chartConstants.FROM)}
                        value={from} onChange={this.onChange}
                    />
                    <Dropdown
                        placeholder='Select period' name='period' selection
                        options={this.getOptions(chartConstants.PERIODS)}
                        value={period} onChange={this.onChange}
                    />
                    {daterange}
                </div>

                <div id='chart' className='chart-wrapper' />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    Incomes: state.income.incomes,
    Expenses: state.expenses.expenses,
});

const mapDispatchToProps = dispatch => ({
    getAllIncomes: () => dispatch(getAllIncomes()),
    getAllExpenses: () => dispatch(getAllExpenses()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Reports);