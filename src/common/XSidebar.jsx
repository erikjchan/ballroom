import styles from "./XSidebar.css"
import React from 'react'
import { Link } from 'react-router'

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
    },
    {
        name: "Logout",
        to: "#",
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
        name: "Event List",
        to: "#",
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
    },
    {
        name: "Logout",
        to: "#",
        isTopOfList: false
    }
]

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
        <div className = {styles.sub_menu_top}>
            {this.props.isAdmin ? this.generateLinks(admin_links, true) : this.generateLinks(competitor_links, true)}
        </div>
        <div className = {styles.sub_menu_bottom}>
            {this.props.isAdmin ? this.generateLinks(admin_links, false) : this.generateLinks(competitor_links, false)}
        </div>
      </div>
    );
  }

  generateLinks(links, top) {
    const list = links
        .filter( i => i.isTopOfList === top)
        .map(
            (d, i) =>
                <li className={styles.nav_sub} key={i}>
                  <Link to={d.to} className={styles.nav_link}>{d.name}</Link>
                </li>
        );
    return (
        <ul className={styles.sub_menu}>
            {list}
        </ul>
    );
  }
}
