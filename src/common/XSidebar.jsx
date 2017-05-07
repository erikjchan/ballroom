import styles from "./XSidebar.css"
import React from 'react'
import { Link } from 'react-router'
import { login, logoutUser } from '../actions'
import { browserHistory } from 'react-router';

export default class OurSidebar extends React.Component {
  constructor (p) { super(p) }

  /**
   * Starts the login process.
   */
  loginUser() {
    window.dispatch(login())
  }

  /**
   * Logs out the user and takes them
   * to the home page
   */
  logoutUser() {
    window.dispatch(logoutUser())
    browserHistory.push('/?msg=logout')
  }

  /** Returns the links at the top of the sidebar */
  getTopLinks() {
    const competition_selected = !!this.props.selected.competition
    const competition_id = this.props.selected.competition && this.props.selected.competition.id
    const isAdmin = this.props.profile.role === 'admin'

    console.log(isAdmin, competition_selected)
    return [

      <Link key={0} to={"/competitions"}>
        Explore Competitions
      </Link>,

      competition_selected &&
      <span key={1}><h5>
        {this.props.selected.competition.Name}
      </h5></span>,

      !isAdmin && competition_selected &&
      <Link key={2} to={`/competition/${competition_id}/0`}>
        - Competition Information
      </Link>,

      !isAdmin && competition_selected &&
      <Link key={4} to={`/competition/${competition_id}/eventregistration`}>
        - Event Registration
      </Link>,

      isAdmin && competition_selected &&
      <Link key={5} to={`/admin/competition/${competition_id}`}>
        - Competition Information
      </Link>,

      isAdmin && competition_selected &&
      <Link key={6} to={`/competition/${competition_id}/competitorslist`}>
        - Competitor List
      </Link>,

      isAdmin && competition_selected &&
      <Link key={7} to={`/competition/${competition_id}/editschedule`}>
        - Schedule Editor
      </Link>,

      isAdmin && competition_selected &&
      <Link key={8} to={`/affiliationpayment/0/0`}>
        - Affiliation Payment
      </Link>,

      isAdmin && competition_selected &&
      <Link key={9} to={`/competition/${competition_id}/regcompetitor/0`}>
        - Register Competitor
      </Link>

    ]
  }

  /** Returns the links at the bottom of the sidebar */
  getBottomLinks() {
    const competition_selected = !!this.props.selected.competition
    const competition_id = this.props.selected.competition && this.props.selected.competition.id
    const isAdmin = this.props.profile.role === 'admin'
    const isAuthenticated = this.props.profile.role !== 'none'

    return [

      isAdmin &&
      <Link key={8} to="admin/competitions">
        Manage Competitions
      </Link>,

      competition_selected &&
      <Link key={2} to='/editprofile'>
        Edit Profile
      </Link>,


      // Login / Logout 

      !isAuthenticated &&
      <a key={9} onClick={this.loginUser.bind(this)}>
        Login / Signup
      </a>,

      isAuthenticated &&
      <a key={10} onClick={this.logoutUser.bind(this)}>
        Logout
      </a>
    ]
  }


  render() {
    console.log(this.props)
    const isAuthenticated = this.props.profile.role !== 'none'
    const isAdmin = this.props.profile.role === 'admin'

      return (
        <div className={styles.nav}>
          <div className={styles.circle}>
            <p>EU</p>
          </div>
  
          <div className={styles.sub_menu + ' ' + styles.sub_menu_top}>
            {this.getTopLinks()}
          </div>
  
          <div className={styles.sub_menu + ' ' + styles.sub_menu_bottom}>
            {this.getBottomLinks()}
          </div>
        </div>
      )
  }
}
