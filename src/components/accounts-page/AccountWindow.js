import React, { Component } from 'react';
import { Button, Input, Dropdown, Modal } from 'semantic-ui-react';

// TODO: Add validation, add currency support

const accountTypes = [
    {
        text: 'Cash',
        value: 'Cash'
    },
    {
        text: 'Credit card',
        value: 'Credit card'
    },
    {
        text: 'Deposit',
        value: 'Deposit'
    }
];

class AccountWindow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            type: null,
            money: ''
        }

        this.onChange = this.onChange.bind(this);
    }

    onChange(event, data) {
        this.setState({[data.name]: data.value});
    }

    componentWillReceiveProps(newProps) {
        const { values: { title, type, money }={} } = newProps;
        this.setState({title, type, money});
    }

    render() {
        const { headerText, submitText, isOpen, onSubmit, onCancel } = this.props;
        const { title, type, money } = this.state;

        const onSubmitClick = () => {
            onSubmit(this.state);
            this.setState({title: '', type: '', money: ''});
        };
        const onCancelClick = () => {
            this.setState({title: '', type: '', money: ''});
            onCancel();
        };

        return (
            <Modal
                open={isOpen}
                onClose={onCancelClick}
                size='tiny'
                dimmer='inverted'>
                <Modal.Header>{headerText}</Modal.Header>
                <Modal.Content>
                    <div className='account-mw-fields'>
                        <Input 
                            label='Title' placeholder='Account title...' name='title'
                            fluid value={title} onChange={this.onChange} /><br />
                        <Dropdown 
                            placeholder='Select account type' name='type'
                            fluid selection options={accountTypes} value={type}
                            onChange={this.onChange} /><br />
                        <Input
                            label='$' placeholder='Account money...' name='money' type='number'
                            fluid value={money} onChange={this.onChange} /><br />
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <Button positive onClick={onSubmitClick}>{submitText}</Button>
                        <Button onClick={onCancelClick}>Cancel</Button>
                    </div>
                </Modal.Content>
            </Modal>
        );
    }
}

export default AccountWindow;
