import styles from "./style.css";
import React from 'react';
import * as Table from 'reactabular-table';
import lib from './common/lib.js';
import Page from './Page.jsx';
import Autocomplete from 'react-autocomplete';
import { browserHistory } from 'react-router';
import classnames from 'classnames';

// /competitions
export default class PageCompetitionList extends React.Component {
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
    }
  ]

  const expand_rows = (rows) => {
    for (var i = 0; i < rows.length; i++) {
      let temp = String(rows[i]['id']);
      rows[i]['Select'] = <button
        className = {styles.search}
        onClick = {()=>{ browserHistory.push('competition/' + temp + '/0'); alert('Are you ' + temp + 'sure?') }}>Visit Page {temp}</button>;
    }
    return rows;
  }

  const search_competition = (list, query) => {
    if (query === '') return []
    return list.filter(comp => 
      comp.Name.toLowerCase().indexOf(query.toLowerCase()) != -1
    )
  }

  return (
   	<Page ref="page">
      <div className = {styles.content}>
       	<h1>Competitions Page</h1>
       	<div>
       	  <h2>Your Competitions</h2>
       	  <Table.Provider
          	className = "pure-table pure-table-striped"
          	columns = {yourColumns}>
          	<Table.Header />
          	<Table.Body
              rows = {expand_rows(this.state.rows) || []}
              rowKey = "id"
            />
      	  </Table.Provider>
        </div>
      	<div>
       	  <h2>Other Competitions</h2>
       	  <Table.Provider
          	className = "pure-table pure-table-striped"
          	columns = {otherColumns}>
          	<Table.Header />
          	<Table.Body
              rows = {this.state.rows || []}
              rowKey = "id"
            />
      	  </Table.Provider>

          <Autocomplete
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

      	  <button className = {styles.search} onClick={() => {/*TODO*/}}>Search</button>
      	  <button 
            className = {styles.register} 
            onClick = {()=>{ browserHistory.push('competition/0/eventregistration') }}> 
              Register
          </button>
        </div>
     	</div>
    </Page>
   );
  }
}
