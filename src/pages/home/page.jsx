import styles from "./style.css"
import React from 'react'
import OurSidebar from '../XSidebar.jsx'


export default class HomePage extends React.Component {
 render() {
   return (
     <div className={styles.content}>
       <h1>Home Page</h1>
       <OurSidebar />
       <p className={styles.welcomeText}>Thanks for joining!</p>
     </div>
   );
 }
}


