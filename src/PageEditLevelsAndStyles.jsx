/* 
 * EDIT LEVELS AND STYLES  
 *
 * This page allows admins to define the levels and styles they will
 * support at their competition, as well as the order in which they should
 * occur by default
 */

import React from 'react'
import XSidebar from './common/XSidebar.jsx'
import * as Table from 'reactabular-table';
import {Button, IconButton } from 'react-toolbox/lib/button';
import { Snackbar } from 'react-toolbox/lib/snackbar';
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
    <Page ref="page" {...this.props}>
      <div id={style.titleContainer}>
        <h1>Define Levels and Styles</h1>
        <div id={style.buttonsContainer}>
          <div id={style.saveChanges} onClick={
            () => this.saveChanges("Are you sure you want to save changes?")
          }>Save Changes</div>
          <div id={style.cancelChanges} onClick={
            () => this.confirmGoToUrl("/competition/1/editevents", "Are you sure you wish to leave this page without saving?")
          }>Define Events</div>
        </div>
      </div>
                <div className={style.infoTable}>

        <div className={style.editLnSBox}>
            <Box admin={true} title={
                         <div>
                              <div id={style.dragAndDropTitle}>Levels</div>
                         </div>
                        }
                 content={
                          <div id={style.scheduleWrapper}>
                              <LevelTable ref="levelsTable" type="levels" />
                          </div>
                         } 
            />
        </div>
        <div className={style.editLnSBox}>
            <Box admin={true} title={
                         <div>
                              <div id={style.dragAndDropTitle}>Styles</div>
                         </div>
                        }
                 content={
                          <div id={style.scheduleWrapper}>
                              <LevelTable ref="stylesTable" type="styles" />
                          </div>
                         } 
            />
        </div>
                    <div className={style.separator}></div>

        </div>

    </Page>
  );
 }

    saveChanges(message) {
        if (confirm(message)) {
            fetch("/api/competition/updateLevelsStyles", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cid: this.props.selected.competition.id,
                    levels: this.refs.levelsTable.state.rows,
                    styles: this.refs.stylesTable.state.rows
                })
            }).then(() => {
                fetch("/api/competition/"+cid+"/levels") 
                    .then(response => response.json())
                    .then(json => {
                        this.refs.levelsTable.setState({rows: json})
                    })
                    .catch(err => alert(err));
                fetch("/api/competition/"+cid+"/styles") 
                    .then(response => response.json())
                    .then(json => {
                        this.refs.stylesTable.setState({rows: json})
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
  if(confirm("Are you sure you want to autosort the levels and styles?")) {
    this.refs.levelsTable.autoSortRows();
    this.refs.stylesTable.autoSortRows();
  }
 }
}

export default DragDropContext(HTML5Backend)(EditLevelsAndStyles)
