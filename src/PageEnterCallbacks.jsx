import styles from "./style.css"
import React from 'react'
import Page from './Page.jsx'

export default class HomePage extends React.Component {
  render() {
    return (
     <Page ref="page">
        <h1>Enter Callbacks</h1>
        <p>TODO!</p>
      </Page>
    )
  }
}

