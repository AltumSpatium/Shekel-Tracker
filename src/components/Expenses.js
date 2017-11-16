import React, { Component } from 'react';

import '../styles/Expenses.css';

class Expenses extends Component {
    static path = '/expenses';

    render() {
        return (
            <div className="Expenses">
                Expenses page
            </div>
        );
    }
}

export default Expenses;
