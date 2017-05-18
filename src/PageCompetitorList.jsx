/* 
 * COMPETITOR LIST
 *
 * This page allows admins to search through all of the competitors
 * who are registered for the competition and access edit 
 * pages for those competitors.
 */

import React from 'react'
import XSidebar from './common/XSidebar.jsx'
import * as Table from 'reactabular-table';
import lib from './common/lib.js'
import Box from './common/Box.jsx'
import { browserHistory } from 'react-router';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Page from './Page.jsx'
import CompetitorList from './PageCompetitorList/competitors.jsx';
import style from './style.css';

// competition/:competition_id/competitorslist
class CompetitorsList extends React.Component {

  constructor(props) {
    super(props);
    this.competition_id = (this.props.selected.competition && this.props.selected.competition.id) 
                        || this.props.params.competition_id
  }

  render() {
    return (
      <Page ref = "page" {...this.props}>
        <div id = {style.titleContainer}>
          <h1>List of Competitors</h1>
          <div id = {style.buttonsContainer}>
            <button id = {style.saveChanges} onClick = {() => 
                browserHistory.push(`/organizationpayment/${this.competition_id}/1`)}>
              See Organization Payments
            </button>
          </div>
        </div>
        <Box admin = {true} title = "Competitors"
          content = 
            {<div id={style.dragAndDropWrapper}>
              <div id={style.scheduleWrapper}>
                <CompetitorList {...this.props} competition_id = {this.competition_id} data = {this.props.location.state}/>
              </div>
            </div>}
        />
      </Page>
    );
  }
}

export default DragDropContext(HTML5Backend)(CompetitorsList)
