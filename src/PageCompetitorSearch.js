import React from 'react'
import Page from './Page.jsx'
import {Button, IconButton } from 'react-toolbox/lib/button';

export default class PageCompetitorSearch extends React.Component {

  showError() {
    this.refs.page.errorNotif('Oh no, something bad happened!')()
  }

  render() {
    return (
     <Page ref="page">
        <h1>Home Page</h1>
        <p>Thanks for joining!</p>
        <Button icon='bookmark' label="Test Error" onClick={this.showError.bind(this)}/>
      </Page>
    );
  }
}


