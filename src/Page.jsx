import styles from "./base.css"
import React from 'react'
import { Snackbar } from 'react-toolbox/lib/snackbar';
import XSidebar from './common/XSidebar.jsx'

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
    console.log('asdfasdfasdf?/')
    return () => {
    console.log('ejalskdfjlasdf', msg)
    this.setState({
      sb_active: true,
      sb_label: msg,
      sb_type: 'warning'
    });

  }}

  render () {
    return (
      <section className={styles.container}>

        <XSidebar isAdmin={this.props.isAdmin} />

        <div className={styles.content}>
          {this.props.children}
        </div>

        <Snackbar
          action='Dismiss'
          active={this.state.sb_active}
          label={this.state.sb_label}
          timeout={2000}
          onClick={this.handleSnackbarClick}
          onTimeout={this.handleSnackbarTimeout}
          type={this.state.sb_type}
        />
      </section>
    );
  }
}