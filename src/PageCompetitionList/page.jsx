
import styles from "./style.css"
import React from 'react'
import XSidebar from '../common/XSidebar.jsx'

export default class HomePage extends React.Component {
 render() {
   return (
     <div className={styles.content}>
       <h1>Home Page</h1>
       <XSidebar />
       <p className={styles.welcomeText}>Your Competitions, Other Competitions</p>
     </div>
   );
 }
}


