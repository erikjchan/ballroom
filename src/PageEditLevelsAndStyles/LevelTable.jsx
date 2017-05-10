import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import * as Table from 'reactabular-table';
import * as dnd from 'reactabular-dnd';
import * as resolve from 'table-resolver';
import * as search from 'searchtabular';
import style from '../style.css';

export default class LevelTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        {
          property: 'ordernumber',
          props: {
            label: 'Number',
            style: {
              width: 50
            }
          },
          header: {
            label: 'Number'
          }
        },
        {
            property: 'name',
            props: {
                style: {
                    width: 300
                }
            },
            header: {
                label: 'Name',
            }
        },
        {
          cell: {
            formatters: [
              (value, { rowData }) => (
                <span
                  onClick={() => this.onRemove(rowData.key)} style={{ cursor: 'pointer' }}
                >
                  &#10007;
                </span>
              )
            ]
          },
          props: {
            style: {
              width: 50
           }
          }
        },
      ],
      rows: [],
      userData: "",
      keyCounter: 0
    };


    this.onRow = this.onRow.bind(this);
    this.onMoveRow = this.onMoveRow.bind(this);
  }

  componentDidMount() {
      fetch("/api/competition/"+ this.props.selected.competition.id + "/" + this.props.type) // TODO: change 1 to cid
          .then(response => response.json())
          .then(json => {
              const rows = json.map((value, index) => {value.key = index; return value;});
              this.setState({
                rows: rows,
                keyCounter: rows.length
              });
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
      body: {
        row: dnd.Row
      }
    };
    const { columns, rows } = this.state;
    for (let i = 0; i < rows.length; i++) {
        rows[i].ordernumber = (i + 1);
    }
    //const resolvedColumns = resolve.columnChildren({ columns });
    const resolvedRows = resolve.resolve({
      columns: columns,
      method: resolve.nested
    })(rows);

    return (
      <Table.Provider
        components={components}
        columns={columns}
        className={style.tableWrapper}
      >
        <Table.Header
          headerRows={resolve.headerRows({ columns })}
          className={style.tableHeader}
        />
        <tbody className={style.scheduleAddEventTBody}>
            <tr>
              <td>
                  <div width ='100' />
              </td>
              <td>
                <input type="text" ref="input" value={this.state.userData} onChange={(event) => this.setState({userData: event.target.value})} style = {{width: '100%'}}/>
              </td>
              <td>
              	<div onClick={() =>this.addNewRow()} width ={100}>&#43;</div>
              </td>
            </tr>
        </tbody>
        <Table.Body
          className={style.tableBody}
          rows={resolvedRows}
          rowKey="key"
          onRow={this.onRow}
        />
      </Table.Provider>
    );
  }

  addNewRow() {
    const {
    	userData,
        keyCounter
    } = this.state;
    var rows = this.state.rows;
    if (userData == "") {
    	return false;
    }
    for (let row of rows) {
      if (row.name.toLowerCase() == userData.toLowerCase()) {
        return false;
      }
    }
    const newRow = {
        id: null,
        ordernumber: rows.length + 1,
    	  name: userData,
        key: keyCounter
    };
    rows.push(newRow);
    this.setState({
    	rows: rows,
    	userData: "",
        keyCounter: keyCounter + 1
    });
    this.refs.input.value = '';
  }

  onRow(row) {
    return {
      rowId: row.key,
      onMove: this.onMoveRow
    };
  }

  onMoveRow({ sourceRowId, targetRowId }) {
    const rows = dnd.moveRows({
      sourceRowId,
      targetRowId,
      idField: "key"
    })(this.state.rows);

    if (rows) {
      this.setState({ rows });
    }
  }

  onRemove(key) {
  	if (!confirm("Are you sure you want to delete this?")) {
  		return false;
  	}
    const rows = cloneDeep(this.state.rows);
    const idx = findIndex(rows, { key });

    // this could go through flux etc.
    rows.splice(idx, 1);

    this.setState({ rows });
  }
}