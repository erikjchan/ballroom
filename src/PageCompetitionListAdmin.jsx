/* 
 * COMPETITIONS LIST (ADMINS)
 *
 * This page will be used by admins to see all the competitions they have created,
 * as well as to create new competitions
 */

import React from 'react';
import * as Table from 'reactabular-table';
import { DragDropContext } from 'react-dnd';
import { browserHistory } from 'react-router';
import HTML5Backend from 'react-dnd-html5-backend';
import style from "./style.css";
import Page from './Page.jsx';
import CompetitionsTable from './PageCompetitionList/competitions.jsx';
import Box from './common/Box.jsx'
import { selectCompetition } from './actions'

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
          this.competitions[i].startdate = date.toUTCString();
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
    console.log(competition)
    this.props.dispatch(selectCompetition(competition))
    browserHistory.push('/admin/competition/' + competition.id)
  }

  /**
   * Builds the table with the competitions you're registered to.
   * @return {[type]} [description]
   */
  getYourCompetitionsTable () {
    const yourColumns = [
      { property: 'name',
        header: { label: 'Name' }
      },
      { property: 'startdate',
        header: { label: 'Date' }
      },
      { property: 'Select',
        header: { label: '' }
      }
    ]

    // TODO; filter to only my competitions

    const rows = this.state.competitions.map((row, id) => {
      return Object.assign({id}, row, { Select: <button
        className = {style.search}
        onClick = {() => this.browseCompetition(row)}>Browse</button>})
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
             <Box admin={true} title="All Competitions"
             content={this.getYourCompetitionsTable()} />
          <hr />
          <div className = {styles.clear}>
          <div id={style.createContainer}>
            <div id={style.saveChanges} 
              onClick={
                () => {window.location.href = '/editcompetition/1/'}}>Create New Competition
            </div>
       	  </div>
        </div>
        </div>
      </Page>
     );
  }
}

export default DragDropContext(HTML5Backend)(PageCompetitionList)
