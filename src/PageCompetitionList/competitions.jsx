import React from 'react';
import * as Table from 'reactabular-table';
import * as resolve from 'table-resolver';
import * as easy from 'reactabular-easy';
import * as resizable from 'reactabular-resizable';
import * as search from 'searchtabular';
import HTML5Backend from 'react-dnd-html5-backend';
import { compose } from 'redux';
import uuid from 'uuid';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import style from '../style.css';
import { browserHistory } from 'react-router';

const schema = {
  type: 'object',
  properties: {
    id: {
      type: 'integer'
    },
	  name: {
      type: 'string'
    },
    price: {
	    type: 'int'
    },
    reg_deadline: {
      type: 'string'
	  }
  },
  required: ['id', 'name', 'price', 'reg_deadline'],
};

class CompetitionsTable extends React.Component {
  constructor(props) {
		super(props);

		this.state = {
		  rows: [],
		  columns: this.getColumns(),
		  sortingColumns: {},
		  query: {},
    };
		this.table = null;

		this.competitor_id = parseInt(this.props.profile.competitor_id)
  }

  componentWillMount() {
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
		    id: 'price',
		    property: 'regularprice',
		    header: {
		      label: 'Price',
		      sortable: true,
		      resizable: true
		    },
		    cell: {
		        highlight: true
		    },
		    width: 50
		 	},
		 	{
		    id: 'reg_deadline',
		    property: 'regularregdeadline',
		    header: {
		      label: 'Reg Deadline',
		      sortable: true,
		      resizable: true
		    },
		    cell: {
		      highlight: true
		    },
		    width: 150
		 	},
		 	{
		    cell: {
		      formatters: [
            (value, { rowData }) => (
              <div>
              	<button
                  className = {style.editBtns}
                  onClick = {()=>{ browserHistory.push(`/competition/${rowData.id}/eventregistration`) }}>
                          Register
                </button>
			        </div>
		          )
		 			]
		 		},
		    width: 100
		 },
		];
	}

  componentDidMount() {
      this.props.api.get(`api/competitions/${this.competitor_id}/unregistered`)
		   .then(json => {
          for (let i = 0; i < json.length; i++) {
            json[i].regularprice = "$" + (json[i].regularprice || 0);
            json[i].lateprice = "$" + (json[i].lateprice || 0);
            var regularregdeadline = new Date(json[i].regularregdeadline);
            json[i].regularregdeadline = regularregdeadline.toDateString();
		    	}
		     this.setState({ rows: json, }); 
		 })
		   .catch(err => alert(err));
  }

  render() {
    const components = {
      header: {
        wrapper: 'thead',
        row: 'tr',
        cell: 'th'
      },
    };

    const { columns, rows, query } = this.state;
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

	  const headerRows = resolve.headerRows({
	    columns: columns
	  });

	  const tableHeight = 40 * (rows.length)

	  return (
      <Table.Provider
        className = {style.tableWrapper}
        columns = {columns}
        components = {components}
      >
        <Table.Header
          className = {style.tableHeader}
        >
          <search.Columns
            query = {query}
            columns = {columns}
            onChange = {query => this.setState({ query })}
          />
        </Table.Header>
        <Table.Body
          rows={visibleRows}
          rowKey="id"
          className={style.tableBody}
        />
      </Table.Provider>
    );
  }

  _onFilterChange(cellDataKey, event) {
    if (!event.target.value) {
      this.setState({ filteredDataList: this.rows });
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
export default CompetitionsTable