import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import * as Table from 'reactabular-table';
import * as dnd from 'reactabular-dnd';
import * as resolve from 'table-resolver';
import style from '../style.css';

const rows = [
  {
    id: 1,
    order_number: 1,
    style: 'tango',
    level: 'gold',
    dance: 'dance',
    round: 1
  },
  {
    id: 2,
    order_number: 2,
    style: 'cha cha',
    level: 'silver',
    dance: 'dance',
    round: 1
  },
  {
    id: 3,
    order_number: 3,
    style: 'cha cha',
    level: 'bronze',
    dance: 'dance',
    round: 1
  },
  {
    id: 4,
    order_number: 4,
    style: 'tango',
    level: 'gold',
    dance: 'dance',
    round: 2
  }
];

export default class DragAndDropTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        {
          property: 'order_number',
          props: {
            label: 'Number',
            style: {
              width: 100
            }
          },
          header: {
            label: 'Number'
          }
        },
        {
          property: 'style',
          props: {
            style: {
              width: 300
            }
          },
          header: {
            label: 'Style',
          }
        },
        {
          property: 'level',
          props: {
            style: {
              width: 300
            }
          },
          header: {
            label: 'Level',
          }
        },
        {
          property: 'title',
          props: {
            style: {
              width: 300
            }
          },
          header: {
            label: 'Dance',
          }
        },
        {
          property: 'round',
          props: {
            style: {
              width: 100
            }
          },
          header: {
            label: 'Round',
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
      rows: []
    };

    this.onRow = this.onRow.bind(this);
    this.onMoveRow = this.onMoveRow.bind(this);
  }

  componentDidMount() {
    fetch("/api/competitors")
      .then(response => response.json())
      .then(json => {
        this.setState({rows: json})
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
    for (let i = 0; i < rows.length; i++) {
        rows[i].order_number = (i + 1);
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

        <Table.Body
          className={style.tableBody}
          rows={resolvedRows}
          rowKey="id"
          onRow={this.onRow}
        />
      </Table.Provider>
    );
  }

  onRow(row) {
    return {
      rowId: row.id,
      onMove: this.onMoveRow
    };
  }

  onMoveRow({ sourceRowId, targetRowId }) {
    const rows = dnd.moveRows({
      sourceRowId,
      targetRowId
    })(this.state.rows);

    if (rows) {
      this.setState({ rows });
    }
  }
}