import styles from "./XSidebar.css"
import React from 'react'
import { Link } from 'react-router'
import { login, logoutUser } from '../actions'
import { browserHistory } from 'react-router';

const competitor_links = [
    {
        name: "Competition Information",
        to: "/competition/0/0",
        isTopOfList: true
    },
    {
        name: "Event Registration",
        to: "/competition/0/eventregistration",
        isTopOfList: true
    },
    {
        name: "Edit Payment Method",
        to: "#",
        isTopOfList: true
    },
    {
        name: "Explore Competitions",
        to: "/competitions",
        isTopOfList: false
    }
]

const admin_links = [
    {
        name: "Competition Information",
        to: "/admin/competition/0",
        isTopOfList: true
    },
    {
        name: "Run Competition",
        to: "/competition/0/run",
        isTopOfList: true
    },
    {
        name: "Competitor List",
        to: "/competition/0/competitorslist",
        isTopOfList: true
    },
    {
        name: "Schedule Editor",
        to: "/competition/0/editschedule",
        isTopOfList: true
    },
    {
        name: "Switch Competition",
        to: "/competitions",
        isTopOfList: false
    },
    {
        name: "New Competition",
        to: "/competitions",
        isTopOfList: false
    }
]

export default class OurSidebar extends React.Component {
  constructor (p) {
    super(p)
  }

  /**
   * Starts the login process.
   */
  loginUser() {
    window.dispatch(login())
  }

  /**
   * Logs out the user and takes them
   * to the home page
   */
  logoutUser() {
    window.dispatch(logoutUser())
    browserHistory.push('/?msg=logout')
  }


  render() {
    const isAuthenticated = this.props.profile.role !== 'none'
    const isAdmin = this.props.profile.role === 'admin'

    if (isAdmin) {
    return (
      <div className={styles.nav}>
        
        <div className={styles.circle}>
          <p>EU</p>
        </div>

        <div className={styles.sub_menu + ' ' + styles.sub_menu_top}>
          { isAdmin ? this.generateLinks(admin_links, true) : this.generateLinks(competitor_links, true)}
        </div>

        <div className={styles.sub_menu + ' ' + styles.sub_menu_bottom}>
          { isAdmin ? this.generateLinks(admin_links, false) : this.generateLinks(competitor_links, false)}

          { !isAuthenticated &&
              <a onClick={this.loginUser.bind(this)}>
                  Login
              </a>
          }

          { isAuthenticated &&
              <a onClick={this.logoutUser.bind(this)}>
                  Logout
              </a>
          }
        
        </div>


      </div>
    );
    }
    else {
      return (
      <div className={styles.nav}>
        
        <div className={styles.circle}>
          <p>EU</p>
        </div>

        <div className={styles.sub_menu + ' ' + styles.sub_menu_top}>
          { isAdmin ? this.generateLinks(admin_links, true) : this.generateLinks(competitor_links, true)}
        </div>

        <div className={styles.sub_menu + ' ' + styles.sub_menu_bottom}>
          { isAdmin ? this.generateLinks(admin_links, false) : this.generateLinks(competitor_links, false)}

          { !isAuthenticated &&
              <a onClick={this.loginUser.bind(this)}>
                  Login
              </a>
          }

          { isAuthenticated &&
              <a onClick={this.logoutUser.bind(this)}>
                  Logout
              </a>
          }
        
        </div>


      </div>
    );
    }
  }

  generateLinks(links, top) {
    return links
      .filter(i => i.isTopOfList === top)
      .map((d, i) =>
        <Link to={d.to} className={styles.nav_link} key={i}>{d.name}</Link>
      )
  }
}
