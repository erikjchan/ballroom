
import React from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import * as Table from 'reactabular-table';

var ReactBsTable  = require('react-bootstrap-table');

function buttonFormatter(cell, row){
  return '<button>DELETE</button>';
}

function onAfterDeleteRow(rowKeys) {
  alert('The rowkey you drop: ' + rowKeys);
}

const options = {
  afterDeleteRow: onAfterDeleteRow  // A hook for after droping rows.
};

// If you want to enable deleteRow, you must enable row selection also.
const selectRowProp = {
  mode: 'checkbox'
};

let order = 'desc';

export default class YourEvents extends React.Component {

  onRemove () {
    if (order === 'desc') {
      this.refs.table.handleSort('asc', 'name');
      order = 'asc';
    } else {
      this.refs.table.handleSort('desc', 'name');
      order = 'desc';
    }
  }

  render() {

    const columns = [
      {
          property: 'id',
          header: {
              label: 'ID',
              sortable: true,
              resizable: true
          }
      },
      {
          property: 'name',
          header: {
              label: 'Name',
              sortable: true,
              resizable: true
          }
      },
      {
        property: 'rolename',
        header: {
          label: 'Position',
          sortable: true,
          resizable: true
        }
      }
    ]

    if (this.props.extra_columns) this.props.extra_columns.forEach(e_column => {
      columns.push({
        cell: {
          formatters: [
            e_column.content
          ]
        }
      })
    })

    return (
      <div>
        <Table.Provider
          className="pure-table pure-table-striped event-table"
          columns={columns}>
          <Table.Header />
          <Table.Body rows={this.props.events} rowKey="id" />
        </Table.Provider>
      </div>
    );
  }
}
