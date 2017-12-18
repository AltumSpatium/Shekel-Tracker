import React, { Component } from 'react';
import { Header, Button, Modal } from 'semantic-ui-react';
import ReactTable from 'react-table';
import { tableHeaders } from 'constants/default';
import ActionsButtons from 'components/shared/ActionsButtons';
import RecordWindow from 'components/shared/RecordWindow';
import firebaseApp from 'utils/firebase';
import toggleModalWindow from 'utils/toggleModalWindow';
import { connect } from 'react-redux';

import 'styles/Planning.css';

const user = localStorage['stUser'] ? JSON.parse(localStorage['stUser']) : {}; // FIX DAT

class Planning extends Component {
    static path = '/planning';

    constructor() {
        super();

        this.state = {
            addWindow: false,
            editWindow: false,
            removeWindow: false,
            planningId: null,

            recordType: ''
        };

        this.incomeRef = firebaseApp.database().ref('income/' + user.uid);
        this.expensesRef = firebaseApp.database().ref('expenses/' + user.uid);
    }

    render() {
        return (
            <div className='Planning'>
                Planning page
            </div>
        );
    }
}

export default Planning;
