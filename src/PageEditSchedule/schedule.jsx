import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import * as Table from 'reactabular-table';
import * as dnd from 'reactabular-dnd';
import * as resolve from 'table-resolver';
import * as search from 'searchtabular';
import style from '../style.css';

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
              width: 50
            }
          },
          header: {
            label: 'Number'
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
          cell: {
            formatters: [
              (value, { rowData }) => (
                <span
                  onClick={() => this.onRemove(rowData.id)} style={{ cursor: 'pointer' }}
                >
                  &#10007;
                </span>
              )
            ]
          },
          props: {
            style: {
              width: 100
            }
          }
        }
      ],
      rows: [],
      levels: ["Newcomer", "Bronze", "Silver", "Gold", "Open"],
      styles: [
          {
            title: "Smooth",
            dances: ["Waltz", "Tango", "Foxtrot", "V. Waltz"]
          },
          {
            title: "Standard",
            dances: ["Waltz", "Tango", "Foxtrot", "Quickstep"]
          },
          {
            title: "Rhythm",
            dances: ["Cha Cha", "Rhumba", "Swing", "Mambo"]
          },
          {
            title: "Latin",
            dances: ["Cha Cha", "Rhumba", "Jive", "V. Samba"]
          }
      ],
      rounds: ["Round 1", "Round 2", "Round 3", "Round 4", "Quarterfinals", "Semifinals", "Finals"],
      selectedNumber: null,
      selectedLevel: null,
      selectedStyle: null,
      selectedDance: null,
      selectedRound: null
    };


    this.onRow = this.onRow.bind(this);
    this.onMoveRow = this.onMoveRow.bind(this);
  }

  componentDidMount() {
    fetch("/api/schedule/")
      .then(response => response.json())
      .then(json => {
        this.setState({rows: json})
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
        rows[i].order_number = (i + 1);
    }
    //const resolvedColumns = resolve.columnChildren({ columns });
    const resolvedRows = resolve.resolve({
      columns: columns,
      method: resolve.nested
    })(rows);

    var newRow = {};

      var numberOptions = [];
      for (let i = 1; i <= this.state.rows.length; i++) {
          numberOptions.push(<option value={i}>{i}</option>);
      }
      var levelOptions = this.state.levels.map(level => (<option value={level}>{level}</option>));
      var styleOptions = this.state.styles.map(style => (<option value={style.title}>{style.title}</option>));
      var roundOptions = this.state.rounds.map(round => (<option value={round} onChange={() => this.setState({selectedRound: level})}>{round}</option>));
      var danceOptions = null;
      if (this.state.selectedStyle) {
        const dances = this.state.styles.filter(style => this.state.selectedStyle == style.title)[0].dances;
        danceOptions = dances.map(dance => (<option value={dance}>{dance}</option>));
      }


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
        <tbody>
            <tr>
              <td style={{padding: "10px"}}><select style={{width: "100%"}} onChange={(event) => this.setState({selectedNumber: event.target.value})}>{numberOptions}</select></td>
              <td style={{padding: "10px"}}><select style={{width: "100%"}} onChange={(event) => this.setState({selectedLevel: event.target.value})}>{levelOptions}</select></td>
              <td style={{padding: "10px"}}><select style={{width: "100%"}} onChange={(event) => this.setState({selectedStyle: event.target.value})}>{styleOptions}</select></td>
                {this.state.selectedStyle != null ? (
                  <td style={{padding: "10px"}}><select style={{width: "100%"}} onChange={(event) => this.setState({selectedDance: event.target.value})}>{danceOptions}</select></td>
                ) : (
                  <td style={{padding: "10px"}}><select style={{width: "100%"}}></select></td>
                )}
              <td style={{padding: "10px"}}><select style={{width: "100%"}} onChange={(event) => this.setState({selectedRound: event.target.value})}>{roundOptions}</select></td>
              <td style={{padding: "10px"}}><div onClick={() => this.addNewRow(newRow, rows)} style={{textAlign: "center", cursor: "pointer"}}>&#43;</div></td>
            </tr>
          </tbody>

        <Table.Body
          className={style.tableBody}
          rows={resolvedRows}
          rowKey="id"
          onRow={this.onRow}
        />
      </Table.Provider>
    );
  }

  addNewRow(newRow, rows) {
    for (let i = 0; i < columns.length - 1; i++) {
      let key = columns[i].property;
      if (!(key in newRow)) {
        return false;
      }
    }
    newRow.id = rows.length;
    rows.splice(newRow.order_number, 1, newRow);
    this.setState(rows);
    console.log(this.state.rows);
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

  onRemove(id) {
    const rows = cloneDeep(this.state.rows);
    const idx = findIndex(rows, { id });

    // this could go through flux etc.
    rows.splice(idx, 1);

    this.setState({ rows });
  }
}