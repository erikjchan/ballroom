import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import * as Table from 'reactabular-table';
import * as dnd from 'reactabular-dnd';
import * as resolve from 'table-resolver';
import * as search from 'searchtabular';
import style from '../style.css';

export default class EventTable extends React.Component {
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
          property: 'dance',
          props: {
            style: {
              width: 300
            }
          },
          header: {
            label: 'Dance(s)',
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
      styles: ["Smooth", "Standard", "Rhythm", "Latin"],
      selectedNumber: "",
      selectedLevel: "",
      selectedStyle: "",
      selectedDance: "",
    };


    this.onRow = this.onRow.bind(this);
    this.onMoveRow = this.onMoveRow.bind(this);
  }

  componentDidMount() {
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

    var numberOptions = [];
    numberOptions.push(<option key={"order_number_" + -1} value={this.state.rows.size + 1}>{"End"}</option>)
    for (let i = 1; i <= this.state.rows.length + 1; i++) {
        numberOptions.push(<option key={"order_number_" + i} value={i}>{i}</option>);
  }
    var levelOptions = this.state.levels.map(level => (<option key={"level_" + level} value={level}>{level}</option>));
    var styleOptions = this.state.styles.map(style => (<option key={"style_" + style} value={style}>{style}</option>));
    var danceOptions = <input type="text" ref="input" style = {{width: '100%'}}
                              value={this.state.selectedDance} onChange={(event) => this.setState({selectedDance: event.target.value})}/>;

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
              	<select value={this.state.selectedNumber} onChange={(event) => this.setState({selectedNumber: event.target.value})}>
              		<option disabled value=""></option>
              		{numberOptions}
              	</select>
              </td>
              <td>
              	<select value={this.state.selectedLevel} onChange={(event) => this.setState({selectedLevel: event.target.value})}>
              		<option disabled value=""></option>
              		{levelOptions}
              	</select>
              </td>
              <td>
              	<select value={this.state.selectedStyle} onChange={(event) => this.setState({selectedStyle: event.target.value})}>
              		<option disabled value=""></option>
              		{styleOptions}
              	</select>
              </td>
              <td>
               {danceOptions}
              </td>
              <td>
              	<div onClick={() =>this.addNewRow()}>&#43;</div>
              </td>
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

  addNewRow() {
    const {
    	selectedNumber,
      selectedLevel,
      selectedStyle,
      selectedDance,
    } = this.state;
    var rows = this.state.rows;
    if (selectedNumber == "" || selectedLevel == "" 
    		|| selectedStyle == "" || selectedDance == "") {
    	return false;
    }

    const newRow = {
    	id: rows.length,
    	order_number: selectedNumber,
    	dance: selectedDance,
    	style: selectedStyle,
    	level: selectedLevel,
    };
    rows.splice(selectedNumber - 1, 0, newRow);
    this.setState({
    	rows: rows,
    	selectedDance: "",
    });
    //this.ref.input.value = "";
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
  	if (!confirm("Are you sure you want to delete this?")) {
  		return false;
  	}
    const rows = cloneDeep(this.state.rows);
    const idx = findIndex(rows, { id });

    // this could go through flux etc.
    rows.splice(idx, 1);

    this.setState({ rows });
  }

  autoSortRows() {
  	var _this = this;
  	var rows = this.state.rows;
  	rows.sort(function(a, b) {
  		if (a.style != b.style) {
  			const styles = ["Smooth", "Rhythm", "Standard", "Latin"];
  			return styles.indexOf(a.style) - styles.indexOf(b.style);
  		}
  		if (a.level != b.level) {
  			return _this.state.levels.indexOf(a.level) - _this.state.levels.indexOf(b.level);
  		}
  		if (a.title != b.title) {
  			if (a.title < b.title) {
  				return -1;
  			}
  			if (a.title > b.title) {
  				return 1;
  			}
  			return 0;
  		}
  		if (a.round != b.round) {
  			const a_round = parseInt(a.round);
  			const b_round = parseInt(b.round);
  			if (!isNaN(a_round) && !isNaN(b_round)) {
  				return a_round - b_round;
  			} 
  			if (!isNaN(a_round)) {
  				return -1;
  			} 
  			if (!isNaN(b_round)) {
  				return 1;
  			}
  			const rounds = ["Quarterfinals", "Semifinals", "Finals"];
  			return rounds.indexOf(a.round) - rounds.indexOf(b.round);
  		}
  		return 0;
  	});
  	this.setState({rows});
  }
}