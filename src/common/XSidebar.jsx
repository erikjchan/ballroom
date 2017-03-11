import styles from "./XSidebar.css"
import React from 'react'

export default class OurSidebar extends React.Component {
  constructor (p) {
    super(p)
    this.state = {sidebarOpen: false, sidebarDocked: false};
  }

  onSetSidebarOpen(open) {
    this.setState({sidebarOpen: open});
  }

  componentWillMount() {
    var mql = window.matchMedia(`(min-width: 800px)`);
    mql.addListener(this.mediaQueryChanged);
    this.setState({mql: mql, sidebarDocked: mql.matches});
  }

  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  }

  mediaQueryChanged() {
    this.setState({sidebarDocked: this.state.mql.matches});
  }

  render() {
    var sidebarContent = <b>Sidebar content</b>;

    return (
      <div>
        <div className = {styles.nav}>
        <div className = {styles.circle}>
          <p>EU</p>
        </div>
        <ul className= {styles.sub_menu}>
          <li className={styles.nav_sub}><a className={styles.nav_link} >Edit Profile</a></li>
          <li className={styles.nav_sub}><a className={styles.nav_link} >See Competitions</a></li>
          <li className={styles.nav_sub}><a className={styles.nav_link} >Competition Page</a></li>
          <li className={styles.nav_sub}><a className={styles.nav_link} >Logout</a></li>
        </ul>
      </div>

      </div>
    );
  }
}
