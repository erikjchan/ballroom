//import React from "react";
//import ReactDOM from 'react-dom';
import styles from "./style.css";
//import '../include/react-sidebar';
//import Sidebar from '../include/react-sidebar/src/sidebar';
//import MaterialTitlePanel from '../include/react-sidebar/example/src/material_title_panel';
//import SidebarContent from './sidebar_content';

//export default Sidebar;

//export default class HomePage extends React.Component {
//  render() {
//    return (
//      <div className={styles.content}>
//        <h1>Home Page</h1>
//        <p className={styles.welcomeText}>Thanks for joining!</p>
//      </div>
//    );
//  }
//}

var React = require('react');
var Sidebar = require('react-sidebar').default;
var App = React.createClass({
  getInitialState() {
    return {sidebarOpen: false, sidebarDocked: false};
  },

  onSetSidebarOpen: function(open) {
    this.setState({sidebarOpen: open});
  },

  componentWillMount: function() {
    var mql = window.matchMedia(`(min-width: 800px)`);
    mql.addListener(this.mediaQueryChanged);
    this.setState({mql: mql, sidebarDocked: mql.matches});
  },

  componentWillUnmount: function() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  },

  mediaQueryChanged: function() {
    this.setState({sidebarDocked: this.state.mql.matches});
  },

  render: function() {
    var sidebarContent = <b>Sidebar content</b>;

    return (
      <Sidebar sidebar={sidebarContent}
               open={this.state.sidebarOpen}
               docked={this.state.sidebarDocked}
               onSetOpen={this.onSetSidebarOpen}>

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

      </Sidebar>
    );
  }
});

module.exports = App;
