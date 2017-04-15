import React from 'react';
import * as Table from 'reactabular-table';
import * as resolve from 'table-resolver';
import * as dnd from 'reactabular-dnd';
import * as easy from 'reactabular-easy';
import VisibilityToggles from 'react-visibility-toggles';
import * as resizable from 'reactabular-resizable';
import * as search from 'searchtabular';
import HTML5Backend from 'react-dnd-html5-backend';
import { compose } from 'redux';
import uuid from 'uuid';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import style from '../style.css';

const schema = {
  type: 'object',
  properties: {
    id: {
      type: 'integer'
    },
	name: {
	  type: 'string'
	},
	organization_name: {
	  type: 'string'
	},
	lead_number: {
	  type: 'integer'
	},
	amount_owed: {
	  type: 'integer'
	},
	pay_w_org: {
	  type: 'string'
	}
  },
  required: ['id', 'name', 'organization_name', 'lead_number', 'amount_owed', 'pay_w_org'],
};

class EasyDemo extends React.Component {
  constructor(props) {
	super(props);
    
	this.rows = null;
	this.state = {
	  rows: [],
	  columns: this.getColumns(),
	  sortingColumns: {},
	  query: {},
    };
	this.table = null;

	console.log(this.state)
  }

  componentWillMount() {
		if (this.props.data){
			this.setState({query: this.props.data.query})
		}
    this.resizableHelper = resizable.helper({
	  globalId: uuid.v4(),
	  getId: ({ id }) => id
	  });
  }

  componentWillUnmount() {
	  this.resizableHelper.cleanup();
  }

  getColumns() {
	  return [
         {
		    id: 'name',
		    property: 'name',
		    header: {
		        label: 'Name',
		        sortable: true,
		        resizable: true
		    },
		    cell: {
		        highlight: true
		    },
		    width: 250
		 },
		 {
		     id: 'organization_name',
		     property: 'organization_name',
		     header: {
		        label: 'Organization',
		        sortable: true,
		        resizable: true
		    },
		    cell: {
		        highlight: true
		    },
		    width: 250
		 },
		 {
		    id: 'lead_number',
		    property: 'lead_number',
		    header: {
		        label: 'Number',
		        sortable: true,
		        resizable: true
		    },
		    cell: {
		        highlight: true
		    },
		    width: 150
		 },
		 {
		    id: 'amount_owed',
		    property: 'amount_owed',
		    header: {
		        label: 'Owes',
		        sortable: true,
		        resizable: true
		    },
		    cell: {
		        highlight: true
		    },
		    width: 200
		 },
		 {
		     id: 'pay_w_org',
		     property: 'pay_w_org',
		     header: {
		         label: 'Paying w/ Organization?',
		         sortable: true,
		         resizable: true
		     },
		     cell: {
		         highlight: true
		     },
		     width: 100
		 },
		 {
		     cell: {
		         formatters: [
                   (value, { rowData }) => (
                       <div>
                         <input type="button"
                                value="Edit/See More"
                                onClick={() => alert(`${JSON.stringify(rowData, null, 2)}`)} />
			         </div>
		          )
		 ]
		 },
		     width: 100
		 }
		 ];
		 }

  componentDidMount() {
      fetch("/api/competitors/competition/:id2")
		   .then(response => response.json())
		   .then(json => {
             this.rows = json;
             for (let i = 0; i < this.rows.length; i++) {
                if (this.rows[i].amount_owed != 0) {
                    this.rows[i].amount_owed = "$" + this.rows[i].amount_owed.toString();
		 }
                if (this.rows[i].pay_w_org) {
                    this.rows[i].pay_w_org = "Yes";
		 } else {
                    this.rows[i].pay_w_org = "No";
		 }
		 }
		     this.setState({ rows: json, }); 
		 })
		   .catch(err => alert(err));
		 }

  render() {
	  console.log(this.props.data)
    const components = {
		     header: {
		     wrapper: 'thead',
		     row: 'tr',
		     cell: 'th'
		 },
		     body: {
		     row: dnd.Row
		 }
		 };

    const {
      columns, rows, query
		 } = this.state;
    const cols = columns;

    const visibleRows = compose(
      search.multipleColumns({ columns: cols, query }),
      resolve.resolve({
		     columns: cols,
		     method: (extra) => compose(
                resolve.byFunction('cell.resolve')(extra),
                resolve.nested(extra)
            )
		 })
    )(rows);

	  for (let i = 0; i < rows.length; i++) {
	    rows[i].id = (i + 1);
		 }

	  const headerRows = resolve.headerRows({
		     columns: columns
		 });

	  const tableHeight = 40 * (rows.length)

	  return (
	    <div>
            <Table.Provider
              className={style.tableWrapper}
              columns={columns}
              components={components}
            >
              <Table.Header
                className={style.tableHeader}
                >
                <search.Columns
                  query={query}
                  columns={columns}
                  onChange={query => this.setState({ query })}
                />
              </Table.Header>

              <Table.Body 
                rows={visibleRows} 
                rowKey="id" 
                className={style.tableBody} 
              />
            </Table.Provider>
	    </div>
      );
		 }

  _onFilterChange(cellDataKey, event) {
    if (!event.target.value) {
        this.setState({
		     filteredDataList: this.rows,
		 });
		 }
    var filterBy = event.target.value.toString().toLowerCase();
    var size = this.rows.length;
    var filteredList = [];
    for (var index = 0; index < size; index++) {
        var v = this.rows[index][cellDataKey];
        if (v.toString().toLowerCase().indexOf(filterBy) !== -1) {
            filteredList.push(this.rows[index]);
		 }
		 }
    this.setState({
		     filteredDataList: filteredList,
		 });
		 }
		 }

		     // Set up drag and drop context
		     // const DragAndDropDemo = DragDropContext(HTML5Backend)(EasyDemo);

<EasyDemo />

		  
export default EasyDemo
		  
