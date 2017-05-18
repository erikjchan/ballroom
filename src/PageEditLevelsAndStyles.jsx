/* 
 * EDIT LEVELS AND STYLES  
 *
 * This page allows admins to define the levels and styles they will
 * support at their competition, as well as the order in which they should
 * occur by default.
 */

import React from 'react'
import XSidebar from './common/XSidebar.jsx'
import * as Table from 'reactabular-table';
import lib from './common/lib.js';
import Box from './common/Box.jsx'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Page from './Page.jsx';
import LevelTable from './PageEditLevelsAndStyles/LevelTable.jsx';
import style from './style.css';

// competition/:competition_id/editlevelsandstyles
class EditLevelsAndStyles extends React.Component {

  render() {
    return (
      <Page ref = "page" {...this.props}>
        <div id = {style.titleContainer}>
          <h1>Define Levels and Styles</h1>
          <div id = {style.buttonsContainer}>
            <button id = {style.saveChanges} onClick = {
              () => this.saveChanges("Are you sure you want to save changes?")
            }>Save Changes</button>
            <button id = {style.cancelChanges} onClick = {
              () => this.confirmGoToUrl(`/competition/${this.props.params.competition_id}/editevents`, "Are you sure you wish to leave this page without saving?") // TODO CID
              }>Define Events</button>
          </div>
        </div>
        <div className={style.infoTable}>
          <div className={style.editLnSBox}>
            <Box admin = {true} title = {
              <div>
                <div id = {style.dragAndDropTitle}>Levels</div>
              </div>
              }
              content = {
                <div id = {style.scheduleWrapper}>
                  <LevelTable api = {this.props.api} competition_id = {this.props.params.competition_id} ref = "levelsTable" type = "levels" />
                </div>
              } 
            />
          </div>
          <div className = {style.editLnSBox}>
            <Box admin = {true} title = {
              <div>
                <div id = {style.dragAndDropTitle}>Styles</div>
              </div>
              }
              content = {
                <div id = {style.scheduleWrapper}>
                  <LevelTable api = {this.props.api} competition_id = {this.props.params.competition_id} ref = "stylesTable" type = "styles" />
                </div>
              } 
            />
          </div>
          <div className = {style.separator}></div>
        </div>
      </Page>
    );
  }

  saveChanges(message) {
    if (!confirm(message)) return;
    console.log(this.props)
    const cid = this.props.params.competition_id

    this.props.api.post("/api/competition/updateLevelsStyles", {
      cid,
      levels: this.refs.levelsTable.state.rows,
      styles: this.refs.stylesTable.state.rows
    })
      .then(() => {
        this.props.api.get("/api/competition/"+cid+"/levels") 
          .then(json => {
            this.refs.levelsTable.setState({rows: json})
          })
          .catch(err => alert(err));
        this.props.api.get("/api/competition/"+cid+"/styles") 
          .then(json => {
            this.refs.stylesTable.setState({rows: json})
          })
          .catch(err => alert(err));
      });
  }

  confirmGoToUrl(url, message) {
    if (confirm(message)) {
      this.props.router.push(url);
    }
  }

  confirmAutoSortRows() {
    if(confirm("Are you sure you want to autosort the levels and styles?")) {
      this.refs.levelsTable.autoSortRows();
      this.refs.stylesTable.autoSortRows();
    }
  }
}

export default DragDropContext(HTML5Backend)(EditLevelsAndStyles)
