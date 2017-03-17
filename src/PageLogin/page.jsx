import React from 'react'
import { browserHistory } from 'react-router'
import Page from '../Page.jsx'
import {Button, IconButton } from 'react-toolbox/lib/button';

export default class LoginPage extends React.Component {
  signUp() {
    browserHistory.push('/home');
  }
  
  render() {
    return (
      <Page ref="page">
        <h1>Login Page</h1>
        {JSON.stringify(this.props.params)}
        <p>Create an account to get started!</p>

        <Button raised primary onClick={this.signUp}>Sign up</Button>
      </Page>
    );
  }
}

