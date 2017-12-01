import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import ReactTable from 'react-table';
import { tableHeaders } from 'constants/default';

import 'react-table/react-table.css';
import 'styles/Income.css';

const testData = [
    { name: 'pocket money', category: 'mom', date: '30/12/2016', money: '20$', account: 'cash', actions: '-' },
    { name: 'pocket money', category: 'mom', date: '30/12/2016', money: '55$', account: 'cash', actions: '-' },
];

class Income extends Component {
    static path = '/income';

    render() {
        return (
            <div className='Income'>
                <Header as='h1' textAlign='center'>Income page</Header>
                <ReactTable
                    data={testData}
                    columns={tableHeaders.INCOME}
                    defaultPageSize={10}
                    className='-striped -highlight'
                />
            </div>
        );
    }
}

export default Income;
