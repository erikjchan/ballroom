import React from 'react';
import connection from './connection'
/**
 * Authorizaiton guard for pages.
 * Note, this not only handles authorization, but it also
 * connects the page to redux. It's a little two-in-one
 * connection and authorization wrapper idk ¯\_(ツ)_/¯
 */
const Authorization = allowedRoles => WrappedComponent => {

  class WithAuthorization extends React.Component {
    constructor(props) { super(props) }
  
    render() {
      const roles = this.props.profile 
          && this.props.profile.roles
          && Object.keys(this.props.profile.roles)
      const permission = roles && roles.reduce(
        (acc,role) => allowedRoles.includes(role) || acc, false)

      if (permission) {
        return <WrappedComponent {...this.props} />
      } else {
        return <h1>Permission denied.</h1>
      }
    }
  }

  return connection(WithAuthorization)
}

export default Authorization
