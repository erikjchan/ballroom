import styles from "./XSidebar.css"
import React from 'react'
import { Link } from 'react-router'

export default class OurSidebar extends React.Component {
  constructor (p) {
    super(p)
    this.state = {sidebarOpen: false, sidebarDocked: false};
  }

  onSetSidebarOpen(open) {
    this.setState({sidebarOpen: open});
  }

  render() {
    var sidebarContent = <b>Sidebar content</b>;

    return (
      <div className = {styles.nav}>
        <div className = {styles.circle}>
          <p>EU</p>
        </div>
        <ul className= {styles.sub_menu}>
          <li className={styles.nav_sub}>
            <Link to="/editprofile" className={styles.nav_link}>Edit Profile</Link>
          </li>
          <li className={styles.nav_sub}>
            <Link to="/competitions" className={styles.nav_link}>See Competitions</Link>
          </li>
          <li className={styles.nav_sub}>
            <Link to="/competition/0/0/" className={styles.nav_link}>Competition Page</Link>
          </li>
          <li className={styles.nav_sub}>
            <Link to="#" className={styles.nav_link}>Logout</Link>
          </li>
        </ul>
      </div>
    );
  }
}
