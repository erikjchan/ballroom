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
            property: 'levelname',
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
          property: 'stylename',
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
                  onClick={() => this.onRemove(rowData.ordernumber)} style={{ cursor: 'pointer' }}
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
      /*levels: [],
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
      styles: [],*/
      events: [],
      selectedNumber: "",
      selectedLevel: "",
      selectedStyle: "",
      selectedDance: ""
    };


    this.onRow = this.onRow.bind(this);
    this.onMoveRow = this.onMoveRow.bind(this);
  }

  componentDidMount() {
    fetch("/api/competition/1/rounds") // TODO: change 1 to cid
      .then(response => response.json())
      .then(json => {
        this.setState({rows: json})
      })
      .catch(err => alert(err));
    fetch("/api/competition/1/events") // TODO: change 1 to cid
      .then(response => response.json())
      .then(json => {
        this.setState({events: json})
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

    var numberOptions = [];
    for (let i = 1; i <= this.state.rows.length; i++) {
        numberOptions.push(<option key={"ordernumber_" + i} value={i}>{i}</option>);
    }
    var levelOptions = null;
    var styleOptions = null;
    var danceOptions = null;
    if (this.state.selectedStyle != "" && this.state.selectedDance != "") {
    	levelOptions = this.state.events
    		.filter(event => event.stylename == this.state.selectedStyle && event.dance == this.state.selectedDance)
    		.map(event => (<option key={"level_" + event.levelname} value={event.levelname}>{event.levelname}</option>));
    } else if (this.state.selectedStyle != "") {
    	levelOptions = this.state.events
    		.filter(event => event.stylename == this.state.selectedStyle)
    		.map(event => (<option key={"level_" + event.levelname} value={event.levelname}>{event.levelname}</option>));
    } else if (this.state.selectedDance != "") {
    	levelOptions = this.state.events
    		.filter(event => event.stylename == this.state.selectedDance)
    		.map(event => (<option key={"level_" + event.levelname} value={event.levelname}>{event.levelname}</option>));
    } else {
    	levelOptions = this.state.events
    		.map(event => (<option key={"level_" + event.levelname} value={event.levelname}>{event.levelname}</option>));
    }

    if (this.state.selectedLevel != "" && this.state.selectedDance != "") {
    	styleOptions = this.state.events
    		.filter(event => event.levelname == this.state.selectedLevel && event.dance == this.state.selectedDance)
    		.map(event => (<option key={"style_" + event.stylename} value={event.stylename}>{event.stylename}</option>));
    } else if (this.state.selectedLevel != "") {
    	styleOptions = this.state.events
    		.filter(event => event.levelname == this.state.selectedLevel)
    		.map(event => (<option key={"style_" + event.stylename} value={event.stylename}>{event.stylename}</option>));
    } else if (this.state.selectedDance != "") {
    	styleOptions = this.state.events
    		.filter(event => event.dance == this.state.selectedDance)
    		.map(event => (<option key={"style_" + event.stylename} value={event.stylename}>{event.stylename}</option>));
    } else {
    	styleOptions = this.state.events
    		.map(event => (<option key={"style_" + event.stylename} value={event.stylename}>{event.stylename}</option>));
    }

    if (this.state.selectedLevel != "" && this.state.selectedStyle != "") {
    	danceOptions = this.state.events
    		.filter(event => event.levelname == this.state.selectedLevel && event.stylename == this.state.selectedStyle)
    		.map(event => (<option key={"dance_" + event.dance} value={event.dance}>{event.dance}</option>));
    } else if (this.state.selectedLevel != "") {
    	danceOptions = this.state.events
    		.filter(event => event.levelname == this.state.selectedLevel)
    		.map(event => (<option key={"dance_" + event.dance} value={event.dance}>{event.dance}</option>));
    } else if (this.state.selectedStyle != "") {
    	danceOptions = this.state.events
    		.filter(event => event.stylename == this.state.selectedStyle)
    		.map(event => (<option key={"dance_" + event.dance} value={event.dance}>{event.dance}</option>));
    } else {
    	danceOptions = this.state.events
    		.map(event => (<option key={"dance_" + event.dance} value={event.dance}>{event.dance}</option>));
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
              		<option value=""></option>
              		{levelOptions}
              	</select>
              </td>
              <td>
              	<select value={this.state.selectedStyle} onChange={(event) => this.setState({selectedStyle: event.target.value})}>
              		<option value=""></option>
              		{styleOptions}
              	</select>
              </td>
                <td>
                	<select value={this.state.selectedDance} onChange={(event) => this.setState({selectedDance: event.target.value})}>
                		<option value=""></option>
                		{danceOptions}
                	</select>
                </td>
              <td>
              </td>
              <td>
              	<div onClick={() =>this.addNewRow()}>&#43;</div>
              </td>
            </tr>
          </tbody>

        <Table.Body
          className={style.tableBody}
          rows={resolvedRows}
          rowKey="ordernumber"
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

    var earliestRound = null;
    var finalRoundSize = null;
    var numRounds = 0;
    for (let row of rows) {
    	if (row.levelname == selectedLevel && row.stylename == selectedStyle && row.dance == selectedDance) {
    	    numRounds++;
    		if (earliestRound == null) {
    			earliestRound = row;
    		}
    		if (row.round.indexOf("Round") == 0) {
    			let num = parseInt(row.round.replace( /^\D+/g, ''));
    			row.round = "Round " + (num + 1);
    		} else if (row.round == "Final") {
    		    finalRoundSize = row.size;
            }
    	}
    }
    var newRowRound = "Round 1";
    earliestRound.size = finalRoundSize * Math.pow(2, numRounds - 1);
    var newRowSize = earliestRound.size <= 150 ? earliestRound.size * 2 : earliestRound.size; // TODO: Change to appropriate value
    if (earliestRound.round == "Final") {
    	newRowRound = "Semifinal";
    } else if (earliestRound.round == "Semifinal") {
    	newRowRound = "Quarter";
    }

    const newRow = {
    	id: null,
    	ordernumber: selectedNumber,
    	dance: selectedDance,
    	stylename: selectedStyle,
    	levelname: selectedLevel,
    	round: newRowRound,
    	size: newRowSize,
    	judgeid1: earliestRound.judgeid1,
    	judgeid2: earliestRound.judgeid2,
    	judgeid3: earliestRound.judgeid3, 
    	judgeid4: earliestRound.judgeid4,
    	judgeid5: earliestRound.judgeid5,
    	judgeid6: earliestRound.judgeid6
    };
    rows.splice(selectedNumber - 1, 0, newRow);
    this.setState({
    	rows: rows,
    	selectedNumber: "",
    	selectedLevel: "",
    	selectedStyle: "",
    	selectedDance: ""
    });
    console.log(this.state.rows);
  }

  onRow(row) {
    return {
      rowId: row.ordernumber,
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

  onRemove(ordernumber) {
  	if (!confirm("Are you sure you want to delete this?")) {
  		return false;
  	}
    const rows = cloneDeep(this.state.rows);
    const idx = findIndex(rows, { ordernumber });

    // this could go through flux etc.
    rows.splice(idx, 1);

    this.setState({ rows });
  }

  autoSortRows() {
  	var _this = this;
  	var rows = this.state.rows;
  	rows.sort(function(a, b) {
  		if (a.styleorder != b.styleorder) {
  			return a.styleorder - b.styleorder;
  		}
  		if (a.levelorder != b.levelorder) {
  			return a.levelorder - b.levelorder;
  		}
  		if (a.round != b.round) {
  			const a_round = parseInt(a.round.replace( /^\D+/g, ''));
  			const b_round = parseInt(b.round.replace( /^\D+/g, ''));
  			if (!isNaN(a_round) && !isNaN(b_round)) {
  				return a_round - b_round;
  			} 
  			if (!isNaN(a_round)) {
  				return -1;
  			} 
  			if (!isNaN(b_round)) {
  				return 1;
  			}
  			const rounds = ["Quarter", "Semifinal", "Final"];
  			return rounds.indexOf(a.round) - rounds.indexOf(b.round);
  		}
  		if (a.eventorder != b.eventorder) {
  			if (a.eventorder < b.eventorder) {
  				return -1;
  			} else {
  				return 1;
  			}
  		}
  		return 0;
  	});
  	this.setState({rows});
  }
}