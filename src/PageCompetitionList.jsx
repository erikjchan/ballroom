
import styles from "./style.css";
import React from 'react';
import * as Table from 'reactabular-table';
import lib from './common/lib.js';
import Page from './Page.jsx';
import Autocomplete from 'react-autocomplete';
import { browserHistory } from 'react-router';
import select from 'selectabular';
import { byArrowKeys } from 'reactabular-select';
import findIndex from 'lodash/findIndex';

// /competitions
export default class PageCompetitionList extends React.Component {

	constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      rows: [],
      selectedRows: [],
    }

    this.onRow = this.onRow.bind(this);
    this.onSelectRow = this.onSelectRow.bind(this);
    this.getSelectedRowIndex = this.getSelectedRowIndex.bind(this);
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

    const { rows, selectedRows } = this.state;

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

  const selectedRowIndex = this.getSelectedRowIndex(selectedRows);

  const search_competition = (list, query) => {
      if (query === '') return []
      return list.filter(comp => 
        comp.Name.toLowerCase().indexOf(query.toLowerCase()) != -1
      )
    }

   return byArrowKeys({
      rows,
      selectedRowIndex,
      onSelectRow: this.onSelectRow
    }) (
   		<Page ref="page">

     		<div className={styles.content}>
       		<h1>Competitions Page</h1>

       		<div>
       		<h2>Your Competitions</h2>
       		<Table.Provider
        		className = "pure-table pure-table-striped"
        		columns = {yourColumns}>
        		<Table.Header />
        		<Table.Body
              rows = {this.state.rows || []}
              rowKey="id"
            />

            <tfoot>
            <tr>
              <td>selectedRows[0]: {"" + selectedRows[0]}</td>
              <td>selectedRowIndex: {selectedRowIndex}</td>
              <td>onSelectRow: undefined</td>
            </tr>
          </tfoot>
      		</Table.Provider>

      		<button 
            className={styles.goMain} 
            onClick={()=>{ browserHistory.push('competition/0/0') }}> 
              Go to Main Page
          </button>
          </div>

      		<div>
       		<h2>Other Competitions</h2>
       		<Table.Provider
        		className="pure-table pure-table-striped"
        		columns={otherColumns}>
        		<Table.Header />
        		<Table.Body
              rows= {this.state.rows || []}
              rowKey="id"
            />
      		</Table.Provider>

          <Autocomplete
            inputProps={{name: "US state", id: "states-autocomplete"}}
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
            renderItem={(item, isHighlighted) => (
              <div
                key={item.abbr}
                id={item.abbr}
              >{item.Name})</div>
            )}
          />

      		<button className={styles.search} onClick={()=>{/*TODO*/}}>Search</button>
      		<button 
            className={styles.register} 
            onClick={()=>{ browserHistory.push('competition/0/eventregistration') }}> 
              Register
          </button>
          </div>
     		</div>
     </Page>
   );
  }

  onRow(row, { rowIndex }) {
    return {
      className: classnames(
        rowIndex % 2 ? 'odd-row' : 'even-row',
        row.selected && 'selected-row'
      ),
      onClick: () => this.onSelectRow(rowIndex)
    };
  }

  onSelectRow(selectedRowIndex) {
    const { rows } = this.state;
    const selectedRowId = rows[selectedRowIndex].id;
 
    this.setState(
      compose(
        select.rows(row => row.id === selectedRowId),
        select.none
      )(rows)
    );
  }

  getSelectedRowIndex(selectedRows) {
    return findIndex(this.state.rows, {
      id: selectedRows[0] && selectedRows[0].id
    });
  }
}

