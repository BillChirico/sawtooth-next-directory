/* Copyright 2019 Contributors to Hyperledger Sawtooth

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
----------------------------------------------------------------------------- */


import React, { Component } from 'react';
import {
  Button,
  Container,
  Form,
  Label,
  Image,
  Input,
  Menu,
  Transition } from 'semantic-ui-react';
import PropTypes from 'prop-types';


/**
 *
 * @class         LoginForm
 * @description   Component encapsulating the login form
 *
 */
class LoginForm extends Component {

  static propTypes = {
    authSource:     PropTypes.string,
    setAuthSource:  PropTypes.func,
    submit:         PropTypes.func.isRequired,
  };


  state = {
    activeIndex: 0, username: '', password: '',
    validUsername:  null,
    validPassword:  null,
    validEmail:     null,
    resetEmail:     '',
  };


  /**
   * Called whenever Redux state changes. Set password field
   * focus manually after transition.
   * @param {object} prevProps Props before update
   * @param {object} prevState State before update
   */
  componentDidUpdate (prevProps, prevState) {
    const { activeIndex } = this.state;
    if (prevState.activeIndex === 0 && activeIndex === 1)
      setTimeout(() => this.passwordRef.focus(), 300);
  }


  /**
   * Handle form change event
   * @param {object} event Event passed by Semantic UI
   * @param {string} name  Name of form element derived from
   *                       HTML attribute 'name'
   * @param {string} value Value of form field
   */
  handleChange = (event, { name, value }) => {
    this.setState({ [name]: value });
    this.validate(name, value);
  }


  /**
   * Set current view
   * @param {number} index View index
   */
  setFlow = (index) => {
    this.setState({ activeIndex: index });
  }


  /**
   * Validate login form input
   * @param {string} name  Name of form element derived from
   *                       HTML attribute 'name'
   * @param {string} value Value of form field
   */
  validate = (name, value) => {
    name === 'username' &&
      this.setState({ validUsername: value.length > 0 });
    name === 'password' &&
      this.setState({ validPassword: value.length > 0 });
    name === 'resetEmail' &&
      this.setState({ validEmail: /\S+@\S+\.\S+/.test(value) });
  }


  /**
   * Render auth source menu
   * @returns {JSX}
   */
  renderMenu () {
    const { authSource, setAuthSource } = this.props;
    return (
      <div>
        <Menu
          compact
          inverted
          id='next-login-auth-source-menu'>
          <Menu.Item
            name='next'
            active={authSource === 'next'}
            onClick={() => setAuthSource('next')}>
            NEXT
          </Menu.Item>
          <Menu.Item
            name='ldap'
            active={authSource === 'ldap'}
            onClick={() => setAuthSource('ldap')}>
            AD
          </Menu.Item>
        </Menu>
      </div>
    );
  }


  /**
   * Render entrypoint
   * @returns {JSX}
   */
  render () {
    const { submit, authSource } = this.props;
    const {
      activeIndex,
      username,
      password,
      resetEmail,
      validUsername,
      validPassword,
      validEmail } = this.state;

    const hide = 0;
    const show = 300;

    return (
      <div className='form-inverted'>
        <Transition
          visible={activeIndex === 0}
          animation='fade up'
          duration={{ hide, show }}>
          <div id='next-login-form-1'>
            {this.renderMenu()}
            <Form id='next-username-form' onSubmit={() => this.setFlow(1)}>
              <Form.Field>
                <Input
                  id='next-username-input'
                  autoFocus
                  placeholder='Username'
                  error={validUsername === false}
                  name='username'
                  type='text'
                  value={username}
                  onChange={this.handleChange}/>
              </Form.Field>
              <Container textAlign='center'>
                <Form.Button
                  content='Next'
                  disabled={!validUsername}
                  icon='right arrow'
                  labelPosition='right'/>
              </Container>
            </Form>
          </div>
        </Transition>
        <Transition
          visible={activeIndex === 1}
          animation='fade down'
          duration={{ hide, show }}>
          <div id='next-login-form-2'>
            <Form id='next-password-form'
              onSubmit={() => submit(username, password, authSource)}>
              <Container
                textAlign='center'
                id='next-login-form-avatar-container'>
                <Image
                  avatar
                  src='http://i.pravatar.cc/150'
                  size='tiny'/>
              </Container>
              <Form.Button
                id='next-login-form-back-button'
                content='Back'
                type='button'
                icon='left arrow'
                labelPosition='left'
                onClick={() => this.setFlow(0)}/>
              <Form.Field id='next-login-form-password'>
                <Input
                  ref={ref => this.passwordRef = ref}
                  error={validPassword === false}
                  name='password'
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={this.handleChange}/>
                <Label>
                  <Button
                    id='next-login-form-forgot-password'
                    className='link'
                    type='button'
                    onClick={() => this.setFlow(2)}>
                  Forgot Password?
                  </Button>
                </Label>
              </Form.Field>
              <Container textAlign='center'>
                <Form.Button
                  content='Login'
                  disabled={!validPassword}
                  icon='right arrow'
                  labelPosition='right'/>
              </Container>
            </Form>
          </div>
        </Transition>
        <Transition
          visible={activeIndex === 2}
          animation='fade up'
          duration={{ hide, show }}>
          <div>
            <Form id='next-login-form-reset-password'
              onSubmit={() => this.setFlow(0)}>
              <Form.Field >
                <Form.Button
                  id='next-login-reset-email-back-button'
                  content='Back'
                  type='button'
                  icon='left arrow'
                  labelPosition='left'
                  onClick={() => this.setFlow(1)}/>
                <Input
                  autoFocus
                  name='resetEmail'
                  type='text'
                  placeholder='Email'
                  value={resetEmail}
                  onChange={this.handleChange}/>
              </Form.Field>
              <Container textAlign='center'>
                <Form.Button
                  content='Reset Password'
                  disabled={!validEmail}
                  icon='right arrow'
                  labelPosition='right'/>
              </Container>
            </Form>
          </div>
        </Transition>
      </div>
    );
  }
}


export default LoginForm;
