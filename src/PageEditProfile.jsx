import styles from "./style.css"
import React from 'react'
import XSidebar from './common/XSidebar.jsx'
import Page from './Page.jsx'

export default class PageEditProfile extends React.Component {
 render() {
   return (
    <Page ref="page">
       <h1>Edit Profile</h1>
       <p className={styles.welcomeText}>Thanks for joining!</p>
     </Page>
   );
 }
}
