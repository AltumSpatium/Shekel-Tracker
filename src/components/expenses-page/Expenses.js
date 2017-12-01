import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { tableHeaders } from 'constants/default';
import ReactTable from 'react-table';

import 'styles/Expenses.css';

const testData = [
    { name: 'Beer', category: 'Alcohol', date: '31/12/2016', money: '10$', account: 'cash', actions: '-' },
    { name: 'Gifts', category: 'Holiday', date: '31/12/2016', money: '50$', account: 'cash', actions: '-' },
]

class Expenses extends Component {
    static path = '/expenses';

    render() {
        return (
            <div className='Expenses'>
                <Header as='h1' textAlign='center'>Expenses page</Header>
                <ReactTable
                    data={testData}
                    columns={tableHeaders.EXPENSES}
                    defaultPageSize={10}
                    className='-striped -highlight'
                />
            </div>
        );
    }
}

export default Expenses;
