import styles from "./base.css"
import React from 'react'
import { Snackbar } from 'react-toolbox/lib/snackbar';
import XSidebar from './common/XSidebar.jsx'
import { connect } from 'react-redux'

/**
 * Standard page layout and utilities all pages might need.
 */
export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sb_active: false,
      sb_label: 'Notification!',
      sb_type: 'warning'
    }

    window.page = this
  }

  handleSnackbarClick = () => {
    this.setState({ sb_active: false });
  };

  handleSnackbarTimeout = () => {
    this.setState({ sb_active: false });
  };

  handleClick = () => {
    this.setState({ sb_active: true });
  };

  errorNotif(msg) { 
    return e => {
    console.error(e)
    this.setState({
      sb_active: true,
      sb_label: msg,
      sb_type: 'warning'
    });

  }}

  render () {
    const { profile, isAuthenticated } = this.props.auth
    const { children } = this.props

    return (
      <section className={styles.container}>
        <XSidebar profile={profile}/>
        <div className={styles.content}>
          {children}
        </div>
        <Snackbar
          action='Dismiss'
          active={this.state.sb_active}
          label={this.state.sb_label}
          timeout={5000}
          onClick={this.handleSnackbarClick}
          onTimeout={this.handleSnackbarTimeout}
          type={this.state.sb_type}
        />
      </section>
    );
  }
}
