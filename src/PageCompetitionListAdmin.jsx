/* 
 * COMPETITIONS LIST (ADMIN)
 *
 * This page will be used by admins to see all the competitions they have created,
 * as well as to create new competitions
 */

import style from "./style.css";
import React from 'react';
import * as Table from 'reactabular-table';
import lib from './common/lib.js';
import Page from './Page.jsx';
import Autocomplete from 'react-autocomplete';
import { browserHistory } from 'react-router';
import classnames from 'classnames';
import CompetitionsTable from './PageCompetitionList/competitions.jsx';
import Box from './common/Box.jsx'
import { selectCompetition } from './actions'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

// admin/competitions
class PageCompetitionList extends React.Component {
	constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      competitions: [],
    }
  }

  componentDidMount() {
    /* Call the API for competitions info */
    this.props.api.get(`/api/competitions`)
      .then(json => { 
        this.competitions = json;
        for (let i = 0; i < this.competitions.length; i++) {
          var date = new Date(this.competitions[i].startdate);
          this.competitions[i].startdate = date.toDateString();
        }
        // update the state of our component
        this.setState({ competitions : json })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(err => alert(`There was an error getting the competitions`))
  }

  /**
   * Selects a competition for browsing.
   * All sidebar links will now point to pages
   * relevant to this competition.
   * Also, opens the competition home page for
   * this competition.
   */
  browseCompetition (competition) {
    this.props.dispatch(selectCompetition(competition))
    browserHistory.push('/admin/competition/' + competition.id)
  }

  /**
   * Builds the table with the competitions you're registered to.
   * @return {[type]} [description]
   */
  getAllCompetitionsTable () {
    const yourColumns = [
      {
        property: 'name',
        header: {
          label: 'Name'
        },
        cell: {
          formatters: [
            (value, { rowData }) =>
              <a onClick={() => this.browseCompetition(rowData)}>{value}</a>
          ]
        },
      },
      { property: 'startdate',
        header: {
          label: 'Date'
        }
      }
    ]

    return <Table.Provider
            className = "pure-table pure-table-striped event-table"
            columns = {yourColumns}>
              <Table.Header />
              <Table.Body
                rows = {this.state.competitions || []}
                rowKey = "id"
              />
           </Table.Provider>
  }

  onCreateNewCompetition(){
    // Competition ID 0 creates new competition
    browserHistory.push(`/editcompetition/0`)
  }

  render() {
    return (
     	<Page ref = "page" {...this.props}>
        <div className = {style.content}>
         	<h1>Competitions Page</h1>
             <Box admin = {true} title = "All Competitions"
             content = {this.getAllCompetitionsTable()} />
          <hr />
          <div className = {style.clear}>
          <div id = {style.createContainer}>
            <button id = {style.saveChanges} onClick = {this.onCreateNewCompetition.bind(this)}>Create New Competition</button>
       	  </div>
           </div>
        </div>
      </Page>
     );
  }
}

export default DragDropContext(HTML5Backend)(PageCompetitionList)
