import styles from "./style.css";
import React from 'react';
import * as Table from 'reactabular-table';
import lib from './common/lib.js';
import Page from './Page.jsx';
import Autocomplete from 'react-autocomplete';
import { browserHistory } from 'react-router';
import classnames from 'classnames';
import SearchTable from './PageCompetitionList/competitions.jsx';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
// max flow overflow hidden for scrollbar

// /competitions
class PageCompetitionList extends React.Component {
	constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      rows: [],
    }
  }

  componentDidMount() {
    console.log('this', this)

    /* Call the API for competitions info */
    fetch(`/api/competitions`)
      .then(response => response.json()) // parse the result
      .then(json => { 
        // update the state of our component
        this.setState({ rows : json })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(this.refs.page.errorNotif(
        `There was an error fetching the competitions`))
  }

  render() {
    const yourColumns = [
    {
      property: 'Name',
      header: {
        label: 'Name',
        sortable: true,
        resizable: true
      }
    },
    {
      property: 'RegPrice',
      header: {
        label: 'Amount Owed',
        sortable: true,
        resizable: true
      }
    },
    {
      property: 'StartDate',
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

  const otherColumns = [
    {
      property: 'Name',
      header: {
        label: 'Name',
        sortable: true,
        resizable: true
      }
    },
    {
      property: 'RegPrice',
      header: {
        label: 'Price',
        sortable: true,
        resizable: true
      }
    },
    {
      property: 'RegEndDate',
      header: {
        label: 'Reg Deadline',
        sortable: true,
        resizable: true
      }
    },
    {
      property: 'Register',
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
      rows[i]['Select'] = <button className = {styles.search}
        onClick = {()=>{ alert("Are you sure?"); browserHistory.push('competition/' + temp + '/0'); alert('Are you sure?') }}>Visit Page</button>;
    }
    return rows;
  }

  // Add a button to the registration corresponding to the competition in each row 
  const expand_other_rows = (rows) => {
    for (var i = 0; i < rows.length; i++) {
      let temp = String(rows[i]['id']);
      rows[i]['Register'] = <button className = {styles.search}
        onClick = {()=>{ alert("Are you sure?"); browserHistory.push('competition/' + temp + '/eventregistration'); alert('Are you sure?') }}>Register Events</button>;
    }
    return rows;
  }

  // Search for the competition by name given a query
  const search_competition = (list, query) => {
    if (query === '') return []
    return list.filter(comp => 
      comp.Name.toLowerCase().indexOf(query.toLowerCase()) != -1
    )
  }

  return (
   	<Page ref="page" isAdmin={false}>
      <div className = {styles.content}>
       	<h1>Competitions Page</h1>
       	<div>
       	  <h2>Your Competitions</h2>
       	  <Table.Provider
          	className = "pure-table pure-table-striped"
          	columns = {yourColumns}>
          	<Table.Header />
          	<Table.Body
              rows = {expand_your_rows(this.state.rows) || []}
              rowKey = "id"
            />
      	  </Table.Provider>
        </div>
      	<div>
       	  <h2>Other Competitions</h2>
          Search: <Autocomplete
            inputProps = {{name: "US state", id: "states-autocomplete"}}
            ref = "autocomplete"
            value = {this.state.value}
            items = {this.state.rows}
            getItemValue = {(item) => item.Name}
            onSelect = {(value, item) => {
              // set the menu to only the selected item
              this.setState({ value })
            }}
            onChange = {(event, value) => {
              this.setState({ value, loading: true })

              fetch(`http://localhost:8080/api/competitions`)
                .then(response => response.json())
                .then(json => {
                  json = search_competition(json, value)
                })
                .catch(err => alert(err))
            }}
            renderItem = {(item, isHighlighted) => (
              <div
                key = {item.abbr}
                id = {item.abbr} > {item.Name})
              </div>
            )}
          />

          <SearchTable />
       	  <Table.Provider
          	className = "pure-table pure-table-striped"
          	columns = {otherColumns}>
          	<Table.Header />
          	<Table.Body
              rows = {expand_other_rows(this.state.rows) || []}
              rowKey = "id"
            />
      	  </Table.Provider>
        </div>
     	</div>
    </Page>
   );
  }
}
export default DragDropContext(HTML5Backend)(PageCompetitionList);