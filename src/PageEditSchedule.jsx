
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
    <Page ref="page" auth={{ profile: this.props.profile, isAuthenticated: this.props.isAuthenticated }}>
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
  if (confirm(message)) {
    fetch("/api/competition/updateRounds", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cid: 1, // TODO: change in production
        rows: this.refs.ddTable.state.rows
      })
    });
  }
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
