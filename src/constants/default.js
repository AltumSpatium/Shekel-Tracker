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
        { Header: 'Name', accessor: 'name' },
        { Header: 'Category', accessor: 'category' },
        { Header: 'Date', accessor: 'date' },
        { Header: 'Money', accessor: 'money' },
        { Header: 'Account', accessor: 'account' },
        { Header: 'Actions', accessor: 'actions' },
    ],

    EXPENSES: [
        { Header: 'Name', accessor: 'name' },
        { Header: 'Category', accessor: 'category' },
        { Header: 'Date', accessor: 'date' },
        { Header: 'Money', accessor: 'money' },
        { Header: 'Account', accessor: 'account' },
        { Header: 'Actions', accessor: 'actions' },
    ],

    PLANNING: [
        { Header: 'Name', accessor: 'name' },
        { Header: 'Category', accessor: 'category' },
        { Header: 'Date', accessor: 'date' },
        { Header: 'Money', accessor: 'money' },
        { Header: 'Account', accessor: 'account' },
        { Header: 'Actions', accessor: 'actions' },
    ],

    ACCOUNTS: [
        { Header: 'Title', accessor: 'title' },
        { Header: 'Type', accessor: 'type' },
        { Header: 'Date', accessor: 'date' },
        { Header: 'Money', accessor: 'money' },
        { Header: 'Actions', accessor: 'actions' },
    ],
}