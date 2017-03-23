import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import * as Table from 'reactabular-table';
import * as dnd from 'reactabular-dnd';
import * as resolve from 'table-resolver';
import style from '../style.css';

export default class DragAndDropTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
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
          property: 'organization_name',
          props: {
            style: {
              width: 300
            }
          },
          header: {
            label: 'Organization',
          }
        },
        {
          property: 'lead_number',
          props: {
            style: {
              width: 300
            }
          },
          header: {
            label: 'Number',
          }
        },
        {
          property: 'amount_owed',
          props: {
            style: {
              width: 100
            }
          },
          header: {
            label: 'Owes',
          }
        },
        {
          props: {
            style: {
              width: 200
            }
          }
        }

      ],
      rows: [],
      filteredDataList: this.rows,
    };

    this.onRow = this.onRow.bind(this);
    this.onMoveRow = this.onMoveRow.bind(this);
  }

  componentDidMount() {
    fetch("/api/competitors/competition/:id2")
      .then(response => response.json())
      .then(json => {
        this.setState({rows: json,
                       filteredDataList: this.rows, })
      })
      .catch(err => alert(err))
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

        <Table.Body
          className={style.tableBody}
          rows={resolvedRows}
          rowKey="id"
          onRow={this.onRow}
        />
      </Table.Provider>
    );
  }

  _renderHeader(label, cellDataKey) {
    return <div>
          <span>{label}</span>
            <div>
              <br />
              <input style={{width:90+'%'}} onChange={this._onFilterChange.bind(this, cellDataKey)}/>
            </div>
        </div>;
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