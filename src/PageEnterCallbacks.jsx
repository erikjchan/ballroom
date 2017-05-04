import styles from "./style.css"
import React from 'react'
import Page from './Page.jsx'


export default class PageEnterCallbacks extends React.Component {
  render() {
    return (
     <Page ref="page" {...this.props}>
        <h1>Enter Callbacks</h1>
        <p>TODO!</p>
      </Page>
    )
  }
}