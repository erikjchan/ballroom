/* 
 * EDIT SCHEDULE
 *
 * This page allows admins to alter the default schedule of the competition by
 * dragging and dropping the rounds. It also allows admins to create and remove 
 * rounds.
 */

import React from 'react'
import XSidebar from './common/XSidebar.jsx'
import * as Table from 'reactabular-table';
import {Button, IconButton } from 'react-toolbox/lib/button';
import { Snackbar } from 'react-toolbox/lib/snackbar';
import lib from './common/lib.js';
import Box from './common/BoxAdmin.jsx'

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Page from './Page.jsx';
import DragAndDropTable from './PageEditSchedule/schedule.jsx';
import style from './style.css';

// competition/:competition_id/editschedule
class EditSchedule extends React.Component {

 render() {
  return (
    <Page ref="page" {...this.props}>
      <div id={style.titleContainer}>
        <h1>Schedule Editor</h1>
        <div id={style.buttonsContainer}>
          <div id={style.saveChanges} onClick={
            () => this.saveChanges("Are you sure you want to save changes?")  
          }>Save Changes</div>
          <div id={style.cancelChanges} onClick={
            () => this.confirmGoToUrl("/admin/competition/0", "Are you sure you want to discard changes?")
          }>Cancel</div>
        </div>
      </div>
        <Box title={
                    <div>
                      <div id={style.dragAndDropTitle}>Rounds</div>
                      <button id={style.dragAndDropAutosort} onClick={() => this.confirmAutoSortRows()}>
                          Autosort
                      </button>
                    </div>
                    }
            content = {
                      <div id={style.scheduleWrapper}>
                          <DragAndDropTable ref="ddTable" />
                      </div>} 
        />
    </Page>
  );
 }

 saveChanges(message) {
  if (!confirm(message)) return;
  const cid = this.props.selected.competition.id
  const send_obj = {
    cid: cid,
    rows: this.refs.ddTable.state.rows
  }
  this.props.api.post("/api/competition/updateRounds", send_obj)
  .then(() => this.props.api.get(`/api/competition/${cid}/rounds`))
  .then(json => { this.refs.ddTable.setState({rows: json}) })
  .catch(err => alert(err));
 }

 confirmGoToUrl(url, message) {
  if (confirm(message)) {
    this.props.router.push(url);
  }
 }

 confirmAutoSortRows() {
  if(confirm("Are you sure you want to autosort the schedule?")) {
    this.refs.ddTable.autoSortRows();
  }
 }
}

export default DragDropContext(HTML5Backend)(EditSchedule)
