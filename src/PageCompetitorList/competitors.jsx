import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import * as Table from 'reactabular-table';
import * as dnd from 'reactabular-dnd';
import * as resolve from 'table-resolver';
import * as search from 'searchtabular';
import style from '../style.css';
import { browserHistory, Link } from 'react-router';
import { compose } from 'redux';

/** TODO: CHANGE URL OF THIS, WE DONT NEED COMPETITION ANY MORE */
export default class CompetitorList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: {},
      sortingColumns: {},
      rows: []
    };
  }

  /**
   * @return the columns for this table
   */
  getColumns() {
    return [
      {
        id: 'name',
        property: 'name',
        props: {
          style: {
            width: 250
          }
        },
        header: {
          label: 'Name',
        },
        cell: {
          formatters: [
            (value, { rowData }) => (
              <Link to={`/competition/${this.props.competition_id}/seecompetitor/${rowData.id}`}>{value}</Link>
            )
          ]
        },
      },
      {
        id: 'affiliationname',
        property: 'affiliationname',
        props: {
          style: {
            width: 250
          }
        },
        header: {
          label: 'Organization',
        }
      },
      {
        id: 'number',
        property: 'number',
        props: {
          style: {
            width: 150
          }
        },
        header: {
          label: 'Number',
        }
      },
      {
        id: 'amount',
        property: 'amount',
        props: {
          style: {
            width: 200
          }
        },
        header: {
          label: 'Owes',
        },
      },
      {
        id: 'paidwithaffiliation',
        property: 'paidwithaffiliation',
        props: {
          style: {
            width: 100
          }
        },
        header: {
          label: 'Paying w/ Organization?',
        }
      },
      {
        props: {
          style: {
            width: 50
          }
        }
      }
    ]
  }

  componentWillMount() {
    if (this.props.data){
      this.setState({query: this.props.data.query})
    }
  }

  componentDidMount() {
    this.props.api
      .get(`/api/competition/${this.props.competition_id}/competitors`)
      .then(json => {

        const rows = json.map((row, i) => Object.assign(row, {
          rowId: i,
          amount: (!row.amount) ? "--" : "$" + (row.amount || 0),
          paidwithaffiliation: row.paidwithaffiliation ? "Yes" : "No",
        }))

        this.setState({ rows }); 
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
      body: { row: dnd.Row }
    };
    const { rows, query } = this.state;
    const columns = this.getColumns()
    for (let i = 0; i < rows.length; i++) {
      rows[i].order_number = (i + 1);
    }
   
    const resolvedRows = compose(
      search.multipleColumns({ columns: columns, query }),
      resolve.resolve({
        columns: columns,
        method: (extra) => compose(
          resolve.byFunction('cell.resolve')(extra),
          resolve.nested(extra)
        )
     })
    )(rows);
 
    var totalOwed = 0; var totalListed = 0;
    for (let i = 0; i < resolvedRows.length; i++) {
      totalListed += 1;
      if (resolvedRows[i].amount != 0 && resolvedRows[i].amount != '--')
        totalOwed += parseFloat((resolvedRows[i].amount).substr(1));
    }  

    return (
      <div>
        <p><b>Number of competitors listed: </b>{totalListed} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Total amount owed: </b>${totalOwed}</p>
  
        <Table.Provider
          components = {components}
          columns = {columns}
          className = {style.tableWrapper}
        >
          <Table.Header
            headerRows = {resolve.headerRows({ columns })}
            className = {style.tableHeader}
          >
            <search.Columns
              query = {query}
              columns = {columns}
              onChange = {query => this.setState({ query })}
            />
          </Table.Header>
          <Table.Body
            className = {style.tableBody}
            rows = {resolvedRows}
            rowKey = "id"
            onRow = {this.onRow}
          />
        </Table.Provider>
      </div>
    );
  }
}
