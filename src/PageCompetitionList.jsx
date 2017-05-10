/*
 * COMPETITIONS LIST (USER)
 *
 * This page will be used by users to see all the competitions they are registered
 * for, as well as to register for new competitions
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
// max flow overflow hidden for scrollbar


// competitions
class PageCompetitionList extends React.Component {
	constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      competitions: [],
    }
    this.competitor_id = this.props.profile.competitor_id;
  }

  componentDidMount() {
    /* Call the API for competitions info */
    this.props.api.get(`/api/competitions/${this.props.profile.competitor_id}`)
      .then(json => {
        console.log(json);
        this.competitions = json;
        for (let i = 0; i < this.competitions.length; i++) {
          this.competitions[i].regularprice = "$" + (this.competitions[i].regularprice || 0);
          this.competitions[i].lateprice = "$" + (this.competitions[i].lateprice || 0);
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
    browserHistory.push('competition/' + competition.id + '/'+ this.competitor_id)
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
      },
      cell: { formatters: [
        (value, { rowData }) =>
          <a onClick={() => this.browseCompetition(rowData)}>{value}</a>
      ]},
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
    }
    ]

    return <Table.Provider
            className="pure-table pure-table-striped event-table"
            columns = {yourColumns}>
            <Table.Header />
            <Table.Body
              rows = {this.state.competitions || []}
              rowKey = "id"
            />
          </Table.Provider>
  }

  render() {
    return (
     	<Page ref="page" {...this.props}>
        <div className={style.content}>
         	<h1>Competitions Page</h1>
            <Box title="Your Competitions">
              {this.getYourCompetitionsTable()}
            </Box>
          <hr />
        	<div>
            <Box title="Other Competitions">
              <div>
                <CompetitionsTable {...this.props} />
              </div>
            </Box>
          </div>
       	</div>
      </Page>
     );
  }
}

export default DragDropContext(HTML5Backend)(PageCompetitionList)
