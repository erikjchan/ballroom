import styles from "./style.css"
import React from 'react'
import XSidebar from './common/XSidebar.jsx'
import Page from './Page.jsx'

export default class HomePage extends React.Component {
 render() {
   return (
    <Page ref="page">
       <h1>Home Page</h1>
       <p className={styles.welcomeText}>Thanks for joining!</p>
     </Page>
   );
 }
}


