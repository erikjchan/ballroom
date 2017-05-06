
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
import EventTable from './PageEditEvents/EventTable.jsx';
import style from './style.css';

// competition/:competition_id/editevents
class EditEvents extends React.Component {

 render() {
  return (
    <Page ref="page" {...this.props}>
      <div id={style.titleContainer}>
        <h1>Define Events</h1>
        <div id={style.buttonsContainer}>
          <div id={style.saveChanges} onClick={
            () => this.saveChanges("Are you sure you want to save changes?")  
          }>Save Changes</div>
          <div id={style.cancelChanges} onClick={
            () => this.confirmGoToUrl("/competition/0/editlevelsandstyles", "Are you sure you want to leave this page without saving?")
          }>Define Levels & Styles</div>
        </div>
      </div>
        <Box title={
                    <div>
                      <div id={style.dragAndDropTitle}>Events</div>
                      <button id={style.dragAndDropAutosort} onClick={() => this.confirmAutoSortRows()}>
                          Autosort
                      </button>
                    </div>
                    }
            content = {
                      <div id={style.scheduleWrapper}>
                          <EventTable ref="ddTable" />
                      </div>} 
        />
    </Page>
  );
 }

 saveChanges(message) {
  if (confirm(message)) {
    console.log(this.refs.ddTable.state.rows);
    fetch("/api/competition/updateEvents", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cid: 1, // TODO: change in production
        rows: this.refs.ddTable.state.rows
      })
    }).then(() => {
        fetch("/api/competition/1/events") // TODO: change 1 to cid
            .then(response => response.json())
            .then(json => {
                this.refs.ddTable.setState({rows: json})
            })
            .catch(err => alert(err));
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
export default DragDropContext(HTML5Backend)(EditEvents)
