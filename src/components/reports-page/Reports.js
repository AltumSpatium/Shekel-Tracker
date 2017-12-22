import React, { Component } from 'react';
import { Header, Segment, Dropdown, Form, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import ChartsPanel from './ChartsPanel';
import chartConstants from 'constants/reports';
import { getAllAccounts } from 'actions/account';

import 'styles/Reports.css';
import 'react-datepicker/dist/react-datepicker.css';

class Reports extends Component {
    static path = '/reports';

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
            || (from === 'Incomes' && !period)
            || ((period === 'Date range') && (!startDate || !endDate))) {
            return this.setState({ canBeReported: false });
        }
        return this.setState({ canBeReported: true });
    }

    render() {
        const { from, accounts, period, startDate, endDate, canBeReported } = this.state;

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

                <Form>
                    <Form.Group widths='equal'>
                        <Form.Field>
                            <Dropdown
                                placeholder='Select source' selection name='from'
                                options={this.getOptions(chartConstants.FROM)}
                                value={from} onChange={this.onChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Dropdown
                                placeholder='Select accounts' selection multiple name='accounts'
                                options={this.Accounts.options}
                                value={accounts} onChange={this.onChange}
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Field>
                            <Dropdown
                                placeholder='Select period' selection name='period'
                                options={this.getOptions(chartConstants.PERIODS)}
                                value={period} onChange={this.onChange}
                            />
                        </Form.Field>
                        {daterange}
                    </Form.Group>
                </Form>
                <ChartsPanel canBeReported={canBeReported} />
            </Segment>
        );
    }
}

const mapStateToProps = state => ({
    Accounts: state.account.accounts
});

const mapDispatchToProps = dispatch => ({
    getAllAccounts: () => dispatch(getAllAccounts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Reports);