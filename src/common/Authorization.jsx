import React from 'react';
import connection from './connection'
import { Redirect } from 'react-router'
import { browserHistory } from 'react-router';
import LoginPage from '../PageLogin.jsx'
import { selectCompetition } from '../actions'
import API from './api'

/**
 * Authorizaiton guard for pages.
 * Note, this not only handles authorization, but it also
 * connects the page to redux. It's a little two-in-one
 * connection and authorization wrapper idk ¯\_(ツ)_/¯
 * Note 2, now deals with more things lol
 */
const Authorization = allowedRoles => WrappedComponent => {

  class WithAuthorization extends React.Component {
    constructor(props) {
      super(props)
      this.api = new API(this.props.profile)
    }

    /**
     * @return true if user has permission to view
     * this page, false otherwise.
     */
    hasPermission() {
      if (allowedRoles === Authorization.ALL) return true;

      const roles = this.props.profile 
          && this.props.profile.roles
          && Object.keys(this.props.profile.roles)
      const permission = roles && roles.reduce(
        (acc,role) => allowedRoles.includes(role) || acc, false)

      return permission
    }

    /**
     * @return true if user doesn't have a competitor id
     * associated with it. Means its a new user
     */
    userIsNew() {
      return false;

        // (this.props.profile.app_metadata && this.props.profile.app_metadata.competitor_id) !== undefined ||
        //     (this.props.profile.app_metadata && this.props.profile.app_metadata.competitor_id) !== null
    }

    /**
     * Ensure selected competition isnt lost
     */
    componentDidMount() {
      if (!this.props.selected.competition && localStorage.getItem('competition')) {
        const competition = JSON.parse(localStorage.getItem('competition'))
        this.props.dispatch(selectCompetition(competition))
      }
    }

    componentWillMount() {
      /** This is a new user! Continue the profile setup process */
      if (this.userIsNew()) browserHistory.push('/newuser')

      /** Continue if we have permission */
      if (this.hasPermission()) return;

      /** No permission. Don't allow the user to continue. */
      browserHistory.push('/?msg=permission_denied')
    }
  
    render() { return <WrappedComponent {...this.props} api={this.api}/> }
  }

  return connection(WithAuthorization)
}

Authorization.ALL = Symbol('Auth_ALL')

export default Authorization
