
import styles from "./style.css"
import React from 'react'
import Page from './Page.jsx'
import { Link } from 'react-router'

export default class HomePage extends React.Component {
 render() {
   return (
    <Page ref="page">
       <h1>Login Page</h1>
       <p>Index of all pages, for the sake of development convenience</p>
        <li><Link to='home'                           >HomePage</Link></li>
        <li><Link to='competitions'                   >CompetitionListPage</Link></li>
        <li><Link to='competition/0/0'                >CompetitionPage</Link></li>
        <li><Link to='competition/0/eventregistration'>EventRegistration</Link></li>
        <li><Link to='admin/competition/0'            >CompetitionHomeAdmin</Link></li>
        <li><Link to='competition/0/editschedule'     >EditSchedule</Link></li>
        <li><Link to='competition/0/competitorslist'  >SeeCompetitors</Link></li>
        <li><Link to='competition/0/run'              >RunCompetition</Link></li>
        <li><Link to='editprofile'                    >EditProfile</Link></li>
        <li><Link to='editcompetition/0'              >EditCompetition</Link></li>
        <li><Link to='editofficial/0'                 >EditOfficial</Link></li>
     </Page>
   );
 }
}

