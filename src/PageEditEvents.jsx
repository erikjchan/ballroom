/* 
 * EDIT EVENTS  
 *
 * This page allows admins to define the events they will
 * support at their competition, as well as the order in which they should
 * occur by default
 */

import React from 'react'
import Box from './common/Box.jsx'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Page from './Page.jsx';
import EventTable from './PageEditEvents/EventTable.jsx';
import style from './style.css';

// competition/:competition_id/editevents
class EditEvents extends React.Component {
  render() {
    const box_title = (
      <div>
        <div id = {style.dragAndDropTitle}>Events</div>
        <button id = {style.dragAndDropAutosort} onClick = {this.confirmAutoSortRows.bind(this)}>
          Autosort
        </button>
      </div>
    )

    const box_content = (
      <div id = {style.scheduleWrapper}>
          <EventTable ref = "ddTable" {...this.props} competition_id = {this.props.params.competition_id} />
      </div>
    )

    return (
      <Page ref = "page" {...this.props}>
        <div id = {style.titleContainer}>
          <h1>Define Events</h1>
          <div id = {style.buttonsContainer}>
            <button id = {style.saveChanges} onClick = {this.saveChanges.bind(this)}>Save Changes</button>
            <button id = {style.cancelChanges} onClick = {
              () => this.confirmGoToUrl(`/competition/${this.props.params.competition_id}/editlevelsandstyles`, "Are you sure you want to leave this page without saving?")
              }> Define Levels & Styles</button>
          </div>
        </div>
          <Box admin = {true} title = {box_title} content = {box_content} />
      </Page>
    );
  }

  /**
   * Saves the changes to the API
   */
  saveChanges(message) {
    if (confirm("Are you sure you want to save changes?")) {
      const cid = this.props.params.competition_id
      const send_object = {
        cid: cid, 
        rows: this.refs.ddTable.state.rows
      }

      /** Post updates */
      this.props.api.post("/api/competition/updateEvents", send_object)
      /** Fetch the events to reload the table */
      .then(() => this.props.api.get(`/api/competition/${cid}/events`))
      /** Update the state */
      .then(json => this.refs.ddTable.setState({rows: json}))
    }
  }

  /** Leaves, but ask the user, in case they want to save */
  confirmGoToUrl(url, message) {
    if (confirm(message)) {
      this.props.router.push(url);
    }
  }

  confirmAutoSortRows() {
    if (confirm("Are you sure you want to autosort the schedule?")) {
      this.refs.ddTable.autoSortRows();
    }
  }
}
export default DragDropContext(HTML5Backend)(EditEvents)
