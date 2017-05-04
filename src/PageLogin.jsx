
import styles from "./style.css"
import React from 'react'
import Page from './Page.jsx'
import { Link } from 'react-router'
import { apiRequest, login, fetchQuote } from './actions'

export default class LoginPage extends React.Component {

  /**
   * Starts the login process.
   */
  loginUser() {
    window.dispatch(login())
  }

  render() {
    const params = new URLSearchParams(window.location.search)
    const msg = params.get('msg')
    const message =
      (msg === 'permission_denied') ? <h2>Permission denied! Please login.</h2> :
      (this.props.profile.role === 'none') ? <h2>Please login or signup to get started.</h2> :
      (msg === 'logout' && this.props.profile.role === 'none') ? <h2>Logged out successfully.</h2> : 
      null
      

    const action = apiRequest('competition', { endpoint: `competition/${0}` } )
    // const b = login()

    var cache = [];

    // console.log(action, fetchQuote())
    return (
     <Page ref="page" {...this.props}>
        <h1>Welcome to Footcraft!</h1>
        { message }
        { this.props.profile.role === 'none' && <button onClick={this.loginUser.bind(this)}>Login / Signup</button> }

        <p>Index of all pages, for the sake of development convenience</p>
        <p><Link to='home'                           >HomePage</Link></p>
        <p><Link to='competitions'                   >CompetitionListPage</Link></p>
        <p><Link to='competition/0/0'                >CompetitionPage</Link></p>
        <p><Link to='competition/0/eventregistration'>EventRegistration</Link></p>
        <p><Link to='admin/competition/0'            >CompetitionHomeAdmin</Link></p>
        <p><Link to='competition/0/editschedule'     >EditSchedule</Link></p>
        <p><Link to='competition/0/competitorslist'  >SeeCompetitors</Link></p>
        <p><Link to='competition/0/run'              >RunCompetition</Link></p>
        <p><Link to='editprofile'                    >EditProfile</Link></p>
        <p><Link to='editcompetition/0'              >EditCompetition</Link></p>
        <p><Link to='editofficial/0'                 >EditOfficial</Link></p>
        <p><Link to='affiliationpayment/0/0'         >AffiliationPayment</Link></p>        
        <p><Link to='competition/0/regcompetitor/0'  >RegisterCompetitor</Link></p>
        <button onClick={() => this.props.dispatch(action) } />
        <pre>
          {JSON.stringify(this.props, function(key, value) {
              if (typeof value === 'object' && value !== null) {
                  if (cache.indexOf(value) !== -1) {
                      // Circular reference found, discard key
                      return;
                  }
                  // Store value in our collection
                  cache.push(value);
              }
              return value;
          }, 2)}
        </pre>

      </Page>
    );
  }
}
