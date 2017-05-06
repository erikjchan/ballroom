
import styles from "./style.css"
import React from 'react'
import Page from './Page.jsx'
import { Link } from 'react-router'

import { apiRequest, login, fetchQuote } from './actions'

export default class LoginPage extends React.Component {
  render() {
    const action = apiRequest('competition', { endpoint: `competition/${0}` } )
    // const b = login()

    // console.log(action, fetchQuote())
    return (
     <Page ref="page" auth={{ profile: this.props.profile, isAuthenticated: this.props.isAuthenticated }}>
        <h1>Login Page</h1>
        <p>Index of all pages, for the sake of development convenience</p>
        <p><Link to='home'                           >HomePage</Link></p>
        <p><Link to='competitions'                   >CompetitionListPage</Link></p>
        <p><Link to='competition/1/1'                >CompetitionPage</Link></p>
        <p><Link to='competition/1/eventregistration'>EventRegistration</Link></p>
        <p><Link to='admin/competition/1'            >CompetitionHomeAdmin</Link></p>
        <p><Link to='competition/1/editschedule'     >EditSchedule</Link></p>
        <p><Link to='competition/1/competitorslist'  >SeeCompetitors</Link></p>
        <p><Link to='competition/1/run'              >RunCompetition</Link></p>
        <p><Link to='editprofile'                    >EditProfile</Link></p>
        <p><Link to='editcompetition/1'              >EditCompetition</Link></p>
        <p><Link to='editofficial/1'                 >EditOfficial</Link></p>
        <p><Link to='affiliationpayment/1/1'           >AffiliationPayment</Link></p>        
        <p><Link to='competition/1/seecompetitor/1'  >SeeCompetitor</Link></p>
        <p><Link to='competition/1/regcompetitor/1'  >RegisterCompetitor</Link></p>
        <p><Link to='querytest'                      >QueryTest</Link></p>        
        <button onClick={() => this.props.dispatch(action) } />
        <pre>
          {JSON.stringify(this.props, null, 2)}
        </pre>

      </Page>
    );
  }
}
