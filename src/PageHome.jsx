import styles from "./style.css"
import React from 'react'
import Page from './Page.jsx'
import connection from './common/connection'

class HomePage extends React.Component {
 render() {
   return (
    <Page ref="page" auth={{ profile: this.props.profile, isAuthenticated: this.props.isAuthenticated }}>
       <h1>Home Page</h1>
       <p>Thanks for joining!</p>
     </Page>
   );
 }
}


export default connection(HomePage)
