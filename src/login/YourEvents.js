// with es6
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
// with es6
var React = require('react');
var ReactDOM = require('react-dom');
var ReactBsTable  = require('react-bootstrap-table');

var products = [{
      name: "Silver International Chacha",
      partner: "Anne / Cornell",
      amt_owed: 120,
  }, {
      name: "Gold International Chacha",
      partner: "Peter / Cornell",
      amt_owed: 140,
  }, {
      name: "Gold International Latin",
      partner: "Jiaqi / Cornell",
      amt_owed: 150,
  }];

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
        <BootstrapTable ref='table' data={ products} deleteRow={ true } selectRow={ selectRowProp } options={ options }>
            <TableHeaderColumn dataField='name' isKey={ true } dataSort={ true }>NAME</TableHeaderColumn>
            <TableHeaderColumn dataField='partner' dataSort={ true }>PARTNER</TableHeaderColumn>
            <TableHeaderColumn dataField='amt_owed' dataSort={ true }>AMT OWED</TableHeaderColumn>
            <TableHeaderColumn dataField="button" dataFormat={buttonFormatter}>Buttons</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}

