
import React from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'

var ReactBsTable  = require('react-bootstrap-table');

function buttonFormatter(cell, row){
  return '<button>DELETE</button>';
}

/*export default class YourEvents extends React.Component{

    render(){
        return (
        <BootstrapTable data={products} striped hover>
            <TableHeaderColumn isKey dataField='id'>Product ID</TableHeaderColumn>
            <TableHeaderColumn dataField='name'>Product Name</TableHeaderColumn>
            <TableHeaderColumn dataField='price'>Product Price</TableHeaderColumn>
        </BootstrapTable>)
    }
}*/

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

  constructor(props) {
    super(props);
  }

  handleBtnClick = () => {
    if (order === 'desc') {
      this.refs.table.handleSort('asc', 'name');
      order = 'asc';
    } else {
      this.refs.table.handleSort('desc', 'name');
      order = 'desc';
    }
  }

  render() {
    return (
      <div>
        <BootstrapTable ref='table' data={this.props.events || []} deleteRow={ false } selectRow={ selectRowProp } options={ options }>
            <TableHeaderColumn dataField='Title' isKey={ true } dataSort={ true }>Title</TableHeaderColumn>
            <TableHeaderColumn dataField='Style' dataSort={ true }>Style</TableHeaderColumn>
            <TableHeaderColumn dataField='Level' dataSort={ true }>Level</TableHeaderColumn>
            <TableHeaderColumn dataField="button" dataFormat={buttonFormatter}>Buttons</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}

