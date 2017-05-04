
import React from 'react'
import XSidebar from './common/XSidebar.jsx'
import * as Table from 'reactabular-table';
import {Button, IconButton } from 'react-toolbox/lib/button';
import { Snackbar } from 'react-toolbox/lib/snackbar';
import lib from './common/lib.js'
import Box from './common/BoxAdmin.jsx'


import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Page from './Page.jsx'
import CompetitorList from './PageCompetitorList/competitors.jsx';
import style from './style.css';

// competition/:competition_id/competitorlist
export default class CompetitorsList extends React.Component {

 render() {
  console.log(this.props.location.state);
  return (
    <Page ref="page" auth={{ profile: this.props.profile, isAuthenticated: this.props.isAuthenticated }}>
      <div id={style.titleContainer}>
        <h1>List of Competitors</h1>
        <div id={style.buttonsContainer}>
          <div id={style.saveChanges}>See Organizations</div>
        </div>
      </div>
      <Box title="Competitors"
      content=
      {<div id={style.dragAndDropWrapper}>
        <div id={style.scheduleWrapper}>
          <CompetitorList data={this.props.location.state}/>
        </div>
      </div>}
      />
    </Page>
  );
 }
}

