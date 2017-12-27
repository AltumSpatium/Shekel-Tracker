import React, { Component } from 'react';
import { Header, Segment, Dropdown, Form, Button, Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import Chart from 'chart.js';
import moment from 'moment';
import chartConstants from 'constants/reports';
import { getAllIncomes } from 'actions/income';
import { getAllExpenses } from 'actions/expenses';
import { getAllAccounts } from 'actions/account';
import 'utils/chart';

import 'styles/Reports.css';
import 'react-datepicker/dist/react-datepicker.css';

const COLORS = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(255, 159, 64, 0.5)',
];

class Reports extends Component {
    static path = '/reports';

    chart = null;
    categoryChart = null;

    constructor(props) {
        super(props);

        this.state = {
            from: null,
            accounts: [],
            period: null,
            startDate: null,
            endDate: null,
            canBeReported: false,
        };

        this.onChange = this.onChange.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.checkAbilityToReport = this.checkAbilityToReport.bind(this);
        this.createReport = this.createReport.bind(this);
        this.filterByPeriod = this.filterByPeriod.bind(this);
        this.createCategoriesChart = this.createCategoriesChart.bind(this);
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

    onChange(event, data) {
        this.setState({ [data.name]: data.value }, this.checkAbilityToReport);
    }

    onChangeDate(date, name) {
        this.setState({ [name]: date }, this.checkAbilityToReport);
    }

    getOptions(array) {
        return array.map(f => ({ key: f, value: f, text: f }));
    }

    get Accounts() {
        return {
            ids: this.props.Accounts.map(acc => acc.id),
            options: this.props.Accounts.map((acc, i) => ({ key: i, value: acc.id, text: acc.title })),
        }
    }

    checkAbilityToReport() {
        const { from, accounts, period, startDate, endDate } = this.state;
        if (!from
            || !accounts.length
            || (from === 'Expenses' && !period)
            || ((period === 'Date range') && (!startDate || !endDate))) {
            return this.setState({ canBeReported: false });
        }
        return this.setState({ canBeReported: true });
    }

    createCategoriesChart(categoryName) {
        const { from, accounts, period, startDate, endDate } = this.state;
        let categoryRecords = this.props[from];
        categoryRecords = categoryRecords
            .filter(record => accounts.includes(record.account))
            .filter(record => record.category === categoryName);
        categoryRecords = this.filterByPeriod(categoryRecords, period, startDate, endDate);
        categoryRecords = categoryRecords.map(record => ({ name: record.name, money: record.money }))
        const data = {};
        categoryRecords.forEach(record => {
            const newValue = (data[record.name] || 0) + +record.money;
            data[record.name] = newValue;
        });
        const keys = Object.keys(data).sort((a, b) => data[b]-data[a]);
        const values = [];
        keys.forEach(k => values.push(data[k]))

        if (this.categoryChart) { this.categoryChart.destroy(); }
        const ctx = document.getElementById('categoriesChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: keys,
                datasets: [{
                    label: '',
                    data: values,
                    backgroundColor: COLORS,
                    borderWidth: 1,
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }]

                },
            },
        });
        this.categoryChart = chart;
    }

    filterByPeriod(data, period, startDate, endDate) {
        if (!period) { return; }
        const todayDate = moment();
        switch (period) {
            case 'This month': {
                const startDay = todayDate.startOf('month').format('YYYY/MM/DD');
                const endDay = todayDate.endOf('month').format('YYYY/MM/DD');
                data = data.filter(record => record.date >= startDay && record.date <= endDay);
                break;
            }
            case 'This week': {
                const startDay = todayDate.startOf('week').format('YYYY/MM/DD');
                const endDay = todayDate.endOf('week').format('YYYY/MM/DD');
                data = data.filter(record => record.date >= startDay && record.date <= endDay);
                break;
            }
            case 'Date range': {
                data = data.filter(record => record.date >= startDate && record.date <= endDate);
                break;
            }
            case 'All time':
            default: {
                break;
            }
        }
        return data;
    }

    createReport() {
        const { from, accounts, period, startDate, endDate } = this.state;
        let data = this.props[from];
        data = data.filter(record => accounts.includes(record.account));
        if (from === 'Expenses' && period) {
            data = this.filterByPeriod(data, period, startDate, endDate);
        }

        const chartCanvas = document.getElementById('canvas').getContext('2d');

        if (this.chart) { this.chart.destroy(); }
        if (this.categoryChart) { this.categoryChart.destroy(); }

        switch (from) {
            case 'Incomes': {
                const dates = data.map(record => record.date.slice(0, 7))
                    .filter((item, index, arr) => arr.indexOf(item) === index)
                    .sort();

                const incomes = {};
                data.forEach(record => {
                    const acc = record.account;
                    const dateIndex = dates.indexOf(record.date.slice(0, 7));
                    if (!incomes[acc]) {
                        incomes[acc] = [];
                    }
                    const newValue = (incomes[acc][dateIndex] || 0) + +record.money;
                    incomes[acc][dateIndex] = newValue;
                });
                const accounts = Object.keys(incomes);

                const chart = new Chart(chartCanvas, {
                    type: 'bar',
                    data: {
                        labels: dates,
                        datasets: accounts.map((acc, i) => ({
                            label: this.props.Accounts.find(account => account.id === acc).title,
                            data: incomes[acc],
                            backgroundColor: COLORS[i],
                            borderWidth: 1,
                        }))
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                stacked: true,
                                ticks: {
                                    beginAtZero: true
                                }
                            }],
                            xAxes: [{
                                stacked: true,
                                ticks: {
                                    beginAtZero: true
                                }
                            }]

                        },
                    },
                });
                this.chart = chart;
                break;
            }

            case 'Expenses': {
                const expenses = {};
                data.forEach(record => {
                    const newValue = (expenses[record.category] || 0) + +record.money;
                    expenses[record.category] = newValue;
                });

                const chart = new Chart(chartCanvas, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(expenses),
                        datasets: [{
                            data: Object.values(expenses).map(val => val.toFixed(2)),
                            backgroundColor: COLORS,
                        }]
                    },
                    options: {
                        center: {
                            text: Object.values(expenses).reduce((acc, i) => acc + i, 0).toFixed(2) + ' USD'
                        },
                        onClick: (evt, elements) => {
                            document.getElementById('canvas').onclick = (evt) => {
                                var activePoints = chart.getElementsAtEvent(evt);
                                if (activePoints.length) {
                                    const categoryName = chart.data.labels[activePoints[0]._index];
                                    this.createCategoriesChart(categoryName);
                                }
                            }
                        }
                    }
                });
                this.chart = chart;
                break;
            }

            default: {
                break;
            }
        }
    }

    render() {
        const { from, accounts, period, startDate, endDate, canBeReported } = this.state;

        const periodSelection = from === 'Expenses' ? (
            <Form.Field>
                <label>Select date period:</label>
                <Dropdown
                    placeholder='Select period' selection name='period'
                    options={this.getOptions(chartConstants.PERIODS)}
                    value={period} onChange={this.onChange}
                />
            </Form.Field>
        ) : null;

        const daterange = period === chartConstants.DATE_RANGE_PERIOD ? (
            <Form.Field className='datepicker-wrapper'>
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
            </Form.Field>
        ) : null;

        return (
            <Segment className='Reports'>
                <Header as='h1' textAlign='center'>Reports</Header>
                <Grid columns='equal'>
                    <Grid.Column width={4}>
                        <Form>
                            <Form.Field>
                                <label>Select data source:</label>
                                <Dropdown
                                    placeholder='Select source' selection name='from'
                                    options={this.getOptions(chartConstants.FROM)}
                                    value={from} onChange={this.onChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Select accounts:</label>
                                <Dropdown
                                    placeholder='Select accounts' selection multiple name='accounts'
                                    options={this.Accounts.options}
                                    value={accounts} onChange={this.onChange}
                                />
                            </Form.Field>
                            {periodSelection}
                            {daterange}
                        </Form>
                        <Button
                            positive className='chart-create' content='Create report'
                            disabled={!canBeReported}
                            onClick={this.createReport} />
                    </Grid.Column>
                    <Grid.Column>
                        <canvas id='canvas'/>
                        <canvas id='categoriesChart'/>
                    </Grid.Column>
                </Grid>
            </Segment>
        );
    }
}

const mapStateToProps = state => ({
    Incomes: state.income.incomes,
    Expenses: state.expenses.expenses,
    Accounts: state.account.accounts,
});

const mapDispatchToProps = dispatch => ({
    getAllIncomes: () => dispatch(getAllIncomes()),
    getAllExpenses: () => dispatch(getAllExpenses()),
    getAllAccounts: () => dispatch(getAllAccounts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Reports);