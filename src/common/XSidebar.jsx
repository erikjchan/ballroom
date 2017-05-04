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
    console.log(this.props)
    const competition_selected = !!this.props.selected.competition
    const competition_id = this.props.selected.competition && this.props.selected.competition.id
    const isAdmin = this.props.profile.role === 'admin'

    console.log(isAdmin, competition_selected)

    return [

      <Link to={"/competitions"} key={2}>
        Explore Competitions
      </Link>,

      competition_selected &&
      <span key={230}><h5>
        {this.props.selected.competition.Name}
      </h5></span>,

      competition_selected &&
      <Link to={`/competition/${competition_id}/0`} key={0}>
        - Competition Information
      </Link>,

      competition_selected &&
      <Link to={`/competition/${competition_id}/eventregistration`} key={1}>
        - Event Registration
      </Link>,


      isAdmin && competition_selected &&
      <Link to={`/admin/competition/${competition_id}`} key={0}>
        - Competition Information
      </Link>,

      isAdmin && competition_selected &&
      <Link to={`/competition/${competition_id}/run`} key={1}>
        - Run Competition
      </Link>,

      isAdmin && competition_selected &&
      <Link to={`/competition/${competition_id}/competitorslist`} key={2}>
        - Competitor List
      </Link>,

      isAdmin && competition_selected &&
      <Link to={`/competition/${competition_id}/editschedule`} key={3}>
        - Schedule Editor
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

      isAdmin && competition_selected &&
      <Link key={0} to='/competition/0/competitorslist' > See Competitors     </Link>,

      isAdmin && competition_selected &&
      <Link key={1} to='/competition/0/run'             > Run Competition     </Link>,

      isAdmin && competition_selected &&
      <Link key={3} to='/editcompetition/0'             > Edit Competition    </Link>,

      isAdmin && competition_selected &&
      <Link key={4} to='/editofficial/0'                > Edit Official       </Link>,

      isAdmin && competition_selected &&
      <Link key={5} to='/affiliationpayment/0/0'        > Affiliation Payment </Link>,

      isAdmin && competition_selected &&
      <Link key={6} to='/competition/0/seecompetitor/0' > See Competitor      </Link>,

      isAdmin && competition_selected &&
      <Link key={7} to='/competition/0/regcompetitor/0' > Register Competitor </Link>,

      isAdmin &&
      <Link key={8} to="/competitions"                  > Manage Competitions </Link>,

      competition_selected &&
      <Link key={2} to='/editprofile'                   > Edit Profile        </Link>,


      // Login / Logout 

      !isAuthenticated &&
      <a onClick={this.loginUser.bind(this)} key={9}>
        Login / Signup
      </a>,

      isAuthenticated &&
      <a onClick={this.logoutUser.bind(this)} key={10}>
        Logout
      </a>
    ]
  }


  render() {
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
    );
  }
}
