
import styles from "./style.css"
import React from 'react'
import Page from './Page.jsx'
import { Link } from 'react-router'

export default class HomePage extends React.Component {
 render() {
   return (
    <Page ref="page">
       <h1>Login Page</h1>
       <p>Index of all pages, for the sake of deve lopment convenience</p>
        <Link to='home'                           >HomePage</Link>
        <Link to='competition/0/eventregistration'>EventRegistration</Link>
        <Link to='competition/0/editschedule'     >EditSchedule</Link>
        <Link to='competition/0/run'              >RunCompetition</Link>
        <Link to='competition/0/0'                >CompetitionPage</Link>
        <Link to='competitions'                   >CompetitionListPage</Link>
        <Link to='admin/competition/0'            >CompetitionHomeAdmin</Link>
        <Link to='editprofile'                    >EditProfile</Link>
     </Page>
   );
 }
}