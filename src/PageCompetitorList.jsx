/* 
 * COMPETITOR LIST  
 *
 * This page allows admins to search through all of the competitors
 * which are registered for their competition and access edit 
 * pages for those competitors.
 */

import React from 'react'
import XSidebar from './common/XSidebar.jsx'
import * as Table from 'reactabular-table';
import {Button, IconButton } from 'react-toolbox/lib/button';
import { Snackbar } from 'react-toolbox/lib/snackbar';
import lib from './common/lib.js'
import Box from './common/Box.jsx'


import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Page from './Page.jsx'
import CompetitorList from './PageCompetitorList/competitors.jsx';
import style from './style.css';

// competition/:competition_id/competitorslist
class CompetitorsList extends React.Component {

 render() {
  return (
    <Page ref="page" {...this.props}>
      <div id={style.titleContainer}>
        <h1>List of Competitors</h1>
        <div id={style.buttonsContainer}>
          <div id={style.saveChanges} 
              onClick={
                (rowData) => {window.location.href = "/organizationpayment/" + this.props.params.competition_id + "/" + rowData.id}}>See Organization Payments
            </div>
        </div>
      </div>
      <Box admin={true} title="Competitors"
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

export default DragDropContext(HTML5Backend)(CompetitorsList)
