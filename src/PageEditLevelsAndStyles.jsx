
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
import LevelTable from './PageEditLevelsAndStyles/LevelTable.jsx';
import style from './style.css';

// competition/:competition_id/editschedule
class EditLevelsAndStyles extends React.Component {

 render() {
  return (
    <Page ref="page" isAdmin={true}>
      <div id={style.titleContainer}>
        <h1>Define Levels and Styles</h1>
        <div id={style.buttonsContainer}>
          <div id={style.saveChanges} onClick={
            () => this.confirmGoToUrl("/competition/0/editlevelsandstyles", "Are you sure you want to save changes?")  
          }>Save Changes</div>
          <div id={style.cancelChanges} onClick={
            () => this.confirmGoToUrl("/competition/0/editevents", "Are you sure you wish to leave this page without saving?")
          }>Define Events</div>
        </div>
      </div>
                <div className={style.infoTable}>

        <div className={style.editLnSBox}>
            <Box title={
                         <div>
                              <div id={style.dragAndDropTitle}>Levels</div>
                         </div>
                        }
                 content={
                          <div id={style.scheduleWrapper}>
                              <LevelTable ref="levelsTable" />
                          </div>
                         } 
            />
        </div>
        <div className={style.editLnSBox}>
            <Box title={
                         <div>
                              <div id={style.dragAndDropTitle}>Styles</div>
                         </div>
                        }
                 content={
                          <div id={style.scheduleWrapper}>
                              <LevelTable ref="levelsTable" />
                          </div>
                         } 
            />
        </div>
                    <div className={style.separator}></div>

        </div>

    </Page>
  );
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

export default DragDropContext(HTML5Backend)(EditLevelsAndStyles);