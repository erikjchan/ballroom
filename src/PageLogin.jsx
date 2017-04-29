
import styles from "./style.css"
import React from 'react'
import Page from './Page.jsx'
import { Link } from 'react-router'
import connection from './common/connection'

class LoginPage extends React.Component {
  render() {
    return (
     <Page ref="page" auth={{ profile: this.props.profile, isAuthenticated: this.props.isAuthenticated }}>
        <h1>Login Page</h1>
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
        <pre>
          {JSON.stringify(this.props, null, 2)}
        </pre>
      </Page>
    );
  }
}

export default connection(LoginPage)