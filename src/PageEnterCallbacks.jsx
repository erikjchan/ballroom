import styles from "./style.css"
import React from 'react'
import Page from './Page.jsx'
import connection from './common/connection'

class PageEnterCallbacks extends React.Component {
  render() {
    return (
     <Page ref="page" auth={{ profile: this.props.profile, isAuthenticated: this.props.isAuthenticated }}>
        <h1>Enter Callbacks</h1>
        <p>TODO!</p>
      </Page>
    )
  }
}

export default connection(PageEnterCallbacks)
