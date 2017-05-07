/* 
 * COMPETITIONS LIST (ADMINS)
 *
 * This page will be used by users to see all the competitions they have created,
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
import Box from './common/BoxAdmin.jsx'
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
    fetch(`/api/competitions`)
      .then(response => response.json()) // parse the result
      .then(json => { 
        // update the state of our component
        this.setState({ competitions : json })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(this.refs.page.errorNotif(
        `There was an error fetching the competitions`))
  }
  /**
   * Selects a competition for browsing.
   * All sidebar links will now point to pages
   * relevant to this competition.
   * Also, opens the competition home page for
   * this competition.
   */
  browseCompetition (competition) {
    console.log(this, competition)
    this.props.dispatch(selectCompetition(competition))
    browserHistory.push('admin/competition/' + competition.id)
  }

  /**
   * Builds the table with the competitions you're registered to.
   * @return {[type]} [description]
   */
  getYourCompetitionsTable () {
    const yourColumns = [
      { property: 'Name',
        header: { label: 'Name' }
      },
      { property: 'StartDate',
        header: { label: 'Date' }
      },
      { property: 'Select',
        header: { label: '' }
      }
    ]

    // TODO; filter to only my competitions

    const rows = this.state.competitions.map(row => {
      row['Select'] = <button
        className = {style.search}
        onClick = {() => this.browseCompetition(row)}>Browse</button>;
      return row
    })

    return <Table.Provider
            className="pure-table pure-table-striped event-table"
            columns = {yourColumns}>
            <Table.Header />
            <Table.Body
              rows = {rows || []}
              rowKey = "id"
            />
          </Table.Provider>
  }

  render() {
  
    return (
     	<Page ref="page" {...this.props}>
        <div className={style.content}>
         	<h1>Competitions Page</h1>
             <Box title="Your Competitions"
             content={this.getYourCompetitionsTable()} />
          <hr />
        	<div>
        <div className = {style.addeditBtns}>
            <button 
                className={style.editBtns} 
                onClick={()=>{ browserHistory.push('/editcompetition/0/') }}> 
                Create New Competition
            </button>
     	</div>
          </div>
       	</div>
      </Page>
     );
  }
}

export default DragDropContext(HTML5Backend)(PageCompetitionList)
