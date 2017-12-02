import React, { Component } from 'react';
import { Form, Checkbox, Button, Loader, Dimmer, Segment, Header } from 'semantic-ui-react';

const errorMessages = {
    email: 'Email field must contain a valid email address!',
    password: 'Password must be at least 6 characters long!'
};

class UserForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            isAgree: false,
            emailError: false,
            passwordError: false
        };
    }

    checkValidity(email, password) {
        let emailError = false;
        let passwordError = false;

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
            emailError = true;
        if (password.length < 6) passwordError = true;

        this.setState({emailError, passwordError});
        return !emailError && !passwordError;
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { email, password } = this.state;

        if (this.checkValidity(email, password))
            this.props.onSubmit(email, password);
    }

    onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value });
    }

    isAgreeHandler = () => this.setState({ isAgree: !this.state.isAgree });

    render() {
        const { email, password, isAgree } = this.state;
        const { isLoading, title } = this.props;

        return (
            <Dimmer.Dimmable as={Segment} dimmed={isLoading} className='user-form'>
                <Dimmer active={isLoading} inverted >
                    <Loader active={isLoading}> Wait, please </Loader>
                </Dimmer>

                <Form>
                    <Header as='h3' textAlign='center'>{title}</Header>
                    <Form.Input
                        label='Email'
                        placeholder='Email'
                        name='email'
                        value={email}
                        onChange={this.onChange}
                        error={this.state.emailError}
                    />
                    {this.state.emailError ? <p className='errorMsg'>{errorMessages.email}</p> : ''}
                    <Form.Input
                        label='Password'
                        placeholder='Password'
                        name='password'
                        value={password}
                        type='password'
                        onChange={this.onChange}
                        error={this.state.passwordError}
                    />
                    {this.state.passwordError ? <p className='errorMsg'>{errorMessages.password}</p> : ''}
                    {
                        title === 'Registration' ? (
                            <Form.Field>
                                <Checkbox
                                    checked={isAgree}
                                    onChange={this.isAgreeHandler}
                                    label='I agree to the Terms and Conditions'
                                />
                            </Form.Field>
                        ) : ('')
                    }
                    <Button
                        fluid positive
                        content='Submit'
                        disabled={title === 'Registration' ? !isAgree : false}
                        onClick={this.onSubmit}
                    />
                </Form>
            </Dimmer.Dimmable>
        );
    }
}

export default UserForm;
