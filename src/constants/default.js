import React from 'react';

const nameHeader = { Header: 'Name', accessor: 'name' };
const categoryHeader = { Header: 'Category', accessor: 'category' };
const dateHeader = { Header: 'Date', accessor: 'date' };
const moneyHeader = { Header: 'Money', accessor: 'displayMoney' };
const accountHeader = { Header: 'Account', accessor: 'displayAccount' };
const actionsHeader = { 
    Header: 'Actions', accessor: 'actions',
    Cell: props => <div className='actions-cell'>{props.value}</div>
};

export const linkSet = {
    GUESTS_LINKS: [
        { path: '/login', name: 'Login' },
        { path: '/register', name: 'Register' },
    ],

    USERS_LINKS: [
        { path: '/income', name: 'Income' },
        { path: '/expenses', name: 'Expenses' },
        { path: '/planning', name: 'Planning' },
        { path: '/accounts', name: 'Accounts' },
        { path: '/reports', name: 'Reports' },
    ],
};

export const tableHeaders = {
    INCOME: [
        nameHeader,
        categoryHeader,
        dateHeader,
        moneyHeader,
        accountHeader,
        actionsHeader
    ],

    EXPENSES: [
        nameHeader,
        categoryHeader,
        dateHeader,
        moneyHeader,
        accountHeader,
        actionsHeader
    ],

    PLANNING: [
        nameHeader,
        categoryHeader,
        dateHeader,
        moneyHeader,
        accountHeader,
        actionsHeader
    ],

    ACCOUNTS: [
        { Header: 'Title', accessor: 'title' },
        { Header: 'Type', accessor: 'type' },
        moneyHeader,
        actionsHeader
    ]
};
