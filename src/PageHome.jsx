import styles from "./style.css"
import React from 'react'
import Page from './Page.jsx'

// home
export default class HomePage extends React.Component {
 render() {
   return (
    <Page ref="page" {...this.props}>
       <h1>Home Page</h1>
       <p>Thanks for joining!</p>
     </Page>
   );
 }
}