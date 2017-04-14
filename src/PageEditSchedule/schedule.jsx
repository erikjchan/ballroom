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
      selectedNumber: "",
      selectedLevel: "",
      selectedStyle: "",
      selectedDance: "",
      selectedRound: ""
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

    var numberOptions = [];
    for (let i = 1; i <= this.state.rows.length; i++) {
        numberOptions.push(<option value={i}>{i}</option>);
    }
    var levelOptions = this.state.levels.map(level => (<option value={level}>{level}</option>));
    var styleOptions = this.state.styles.map(style => (<option value={style.title}>{style.title}</option>));
    var roundOptions = this.state.rounds.map(round => (<option value={round} onChange={() => this.setState({selectedRound: level})}>{round}</option>));
    var danceOptions = null;
    if (this.state.selectedStyle != "") {
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
              {this.state.selectedStyle != "" ? (
                <td>
                	<select value={this.state.selectedDance} onChange={(event) => this.setState({selectedDance: event.target.value})}>
                		<option disabled value=""></option>
                		{danceOptions}
                	</select>
                </td>
              ) : (
                <td>
                	<select></select>
                </td>
              )}
              <td>
              	<select value={this.state.selectedRound} onChange={(event) => this.setState({selectedRound: event.target.value})}>
              		<option disabled value=""></option>
              		{roundOptions}
              	</select>
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
      selectedRound,
    } = this.state;
    var rows = this.state.rows;
    if (selectedNumber == "" || selectedLevel == "" 
    		|| selectedStyle == "" || selectedDance == "" || selectedRound == "") {
    	return false;
    }
    const newRow = {
    	id: rows.length,
    	order_number: selectedNumber,
    	title: selectedDance,
    	style: selectedStyle,
    	level: selectedLevel,
    	round: selectedRound
    };
    rows.splice(selectedNumber - 1, 0, newRow);
    this.setState({
    	rows: rows,
    	selectedNumber: "",
    	selectedLevel: "",
    	selectedStyle: "",
    	selectedDance: "",
    	selectedRound: ""
    });
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
  	var swapOrderNumber = function(a, b, order) {
  		if (order < 0 || order > 0) {
  			const temp = a.order_number;
  			a.order_number = b.order_number;
  			b.order_number = temp;
  		}
  	};
  	rows.sort(function(a, b) {
  		if (a.style != b.style) {
  			const styles = ["Smooth", "Rhythm", "Standard", "Latin"];
  			const order = styles.indexOf(a.style) - styles.indexOf(b.style);
  			swapOrderNumber(a, b, order);
  			return order;
  		}
  		if (a.level != b.level) {
  			const order = _this.state.levels.indexOf(a.level) - _this.state.levels.indexOf(b.level);
  			swapOrderNumber(a, b, order);
  			return order;
  		}
  		if (a.title != b.title) {
  			if (a.title < b.title) {
  				swapOrderNumber(a, b, -1);
  				return -1;
  			}
  			if (a.title > b.title) {
  				swapOrderNumber(a, b, 1);
  				return 1;
  			}
  			return 0;
  		}
  		if (a.round != b.round) {
  			const a_round = parseInt(a.round);
  			const b_round = parseInt(b.round);
  			if (!isNaN(a_round) && !isNaN(b_round)) {
  				const order = a_round - b_round;
  				swapOrderNumber(a, b, order);
  				return order;
  			} 
  			if (!isNaN(a_round)) {
  				swapOrderNumber(a, b, -1);
  				return -1;
  			} 
  			if (!isNaN(b_round)) {
  				swapOrderNumber(a, b, 1);
  				return 1;
  			}
  			const rounds = ["Quarterfinals", "Semifinals", "Finals"];
  			const order = rounds.indexOf(a.round) - rounds.indexOf(b.round);
  			swapOrderNumber(a, b, order);
  			return order;
  		}
  		return 0;
  	});
  	this.setState({rows});
  	console.log(rows);
  }
}