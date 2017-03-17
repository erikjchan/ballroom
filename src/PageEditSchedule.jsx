
import React from 'react'
import XSidebar from './common/XSidebar.jsx'
import * as Table from 'reactabular-table';
import {Button, IconButton } from 'react-toolbox/lib/button';
import { Snackbar } from 'react-toolbox/lib/snackbar';
import lib from './common/lib.js'

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Page from './Page.jsx'
import DragAndDropTable from './PageEditSchedule/schedule.jsx';
import style from './style.css';

// competition/:competition_id/editschedule
class EditSchedule extends React.Component {

 render() {
  return (
    <Page ref="page">
      <div id={style.titleContainer}>
        <h1>Schedule Editor</h1>
        <div id={style.buttonsContainer}>
          <div id={style.saveChanges}>Save Changes</div>
          <div id={style.cancelChanges}>Cancel</div>
        </div>
      </div>
      <div id={style.dragAndDropWrapper}>
        <div id={style.dragAndDropWrapperTopBar}>
          <div id={style.dragAndDropTitle}>Rounds</div>
          <div id={style.dragAndDropAutosort}>
            <div>Autosort</div>
          </div>
        </div>
        <DragAndDropTable />
      </div>
    </Page>
  );
 }
}

export default DragDropContext(HTML5Backend)(EditSchedule);


