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
// max flow overflow hidden for scrollbar


// competitions
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
    fetch(`/api/competitions/1`)
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
    browserHistory.push('competition/' + competition.id + '/0')
  }

  /**
   * Builds the table with the competitions you're registered to.
   * @return {[type]} [description]
   */
  getYourCompetitionsTable () {
    const yourColumns = [
    {
      property: 'name',
      header: {
        label: 'Name',
        sortable: true,
        resizable: true
      }
    },
    {
      property: 'regularprice',
      header: {
        label: 'Amount Owed',
        sortable: true,
        resizable: true
      }
    },
    {
      property: 'startdate',
      header: {
        label: 'Date',
        sortable: true,
        resizable: true
      }
    },
    {
      property: 'Select',
      header: {
        label: '',
        sortable: true,
        resizable: true
      }
    }
    ]

  // Add a button to the competition corresponding to the competition in each row 
  const expand_your_rows = (rows) => {
    for (var i = 0; i < rows.length; i++) {
      let temp = String(rows[i]['id']);
      rows[i]['Select'] = <button className = {style.search}
        onClick = {()=>{ browserHistory.push('competition/' + temp + '/1')}}>Visit Page</button>;
    }
    return rows;
  }
/*
    // TODO; filter to only my competitions

    const rows = this.state.competitions.map(row => {
      row['Select'] = <button
        className = {style.search}
        onClick = {() => this.browseCompetition(row)}>Browse</button>;
      return row
    })
*/

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
            <Box title="Other Competitions"
              content = {
                <div id={style.otherCompetitionsTable}>
                  <CompetitionsTable />
                </div>
              }
            />
          </div>
       	</div>
      </Page>
     );
  }
}

export default DragDropContext(HTML5Backend)(PageCompetitionList)
