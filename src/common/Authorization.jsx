import React from 'react';
import connection from './connection'
import { Redirect } from 'react-router'
import { browserHistory } from 'react-router';
import LoginPage from '../PageLogin.jsx'

/**
 * Authorizaiton guard for pages.
 * Note, this not only handles authorization, but it also
 * connects the page to redux. It's a little two-in-one
 * connection and authorization wrapper idk ¯\_(ツ)_/¯
 */
const Authorization = allowedRoles => WrappedComponent => {

  class WithAuthorization extends React.Component {
    constructor(props) {
      super(props)
    }

    hasPermission() {
      if (allowedRoles === Authorization.ALL) return true;

      const roles = this.props.profile 
          && this.props.profile.roles
          && Object.keys(this.props.profile.roles)
      const permission = roles && roles.reduce(
        (acc,role) => allowedRoles.includes(role) || acc, false)

      return permission
    }

    componentWillMount() {
      if (this.hasPermission()) return;
      browserHistory.push('/?msg=permission_denied')
    }
  
    render() {
      if (this.hasPermission()) {
        return <WrappedComponent {...this.props} />
      } else {
        return <h1> Permission denied </h1>
      }
    }
  }

  return connection(WithAuthorization)
}

Authorization.ALL = Symbol('Auth_ALL')

export default Authorization
