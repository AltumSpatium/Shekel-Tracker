import React, { Component } from 'react';
import { Form, Checkbox, Button, Loader, Dimmer, Segment, Header } from 'semantic-ui-react';

class UserForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            isAgree: true,
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { email, password } = this.state;
        this.props.onSubmit(email, password);
    }

    onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value })
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
                        name="email"
                        value={email}
                        onChange={this.onChange}
                    />
                    <Form.Input
                        label='Password'
                        placeholder='Password'
                        name="password"
                        value={password}
                        onChange={this.onChange}
                    />
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
                        disabled={!isAgree}
                        onClick={this.onSubmit}
                    />
                </Form>
            </Dimmer.Dimmable>
        );
    }
}

export default UserForm;