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
            label: 'Dance(s)',
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
              width: 100
            }
          }
        }
      ],
      rows: [],
      levels: [],
      styles: [],
      selectedNumber: "",
      selectedLevel: "",
      selectedStyle: "",
      danceInput: "",
      keyCounter: 0
    };

    this.onRow = this.onRow.bind(this);
    this.onMoveRow = this.onMoveRow.bind(this);
  }

  componentDidMount() {
    const cid = this.props.competition_id
    fetch("/api/competition/" + cid + "/events")
      .then(response => response.json())
      .then(json => {
        const rows = json.map((value, index) => {value.key = index; return value;});
        this.setState({
          rows: rows,
          keyCounter: rows.length
        });
      })
      .catch(err => alert(err));

    fetch("/api/competition/" + cid + "/levels")
      .then(response => response.json())
      .then(json => {
        this.setState({
          levels: json
        });
      })
      .catch(err => alert(err));

    fetch("/api/competition/" + cid + "/styles")
      .then(response => response.json())
      .then(json => {
        this.setState({
          styles: json
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
    const resolvedRows = resolve.resolve({
      columns: columns,
      method: resolve.nested
    })(rows);

    var numberOptions = [];
    for (let i = 1; i <= this.state.rows.length + 1; i++) {
      numberOptions.push(<option key = {"ordernumber_" + i} value = {i}>{i}</option>);
    }
    var levelOptions = this.state.levels.map(level => (<option key = {"level_" + level.name} value = {level.name}>{level.name}</option>));
    var styleOptions = this.state.styles.map(style => (<option key = {"style_" + style.name} value = {style.name}>{style.name}</option>));
    var danceInput = <input type = "text" ref = "input" style = {{width: '100%'}}
                        value = {this.state.danceInput} onChange = {(event) => this.setState({danceInput: event.target.value})}/>;

    return (
      <Table.Provider
        components = {components}
        columns = {columns}
        className = {style.tableWrapper}
      >
        <Table.Header
          headerRows = {resolve.headerRows({ columns })}
          className = {style.tableHeader}
        />
        <tbody className = {style.scheduleAddEventTBody}>
            <tr>
              <td>
              	<select value = {this.state.selectedNumber} onChange = {(event) => this.setState({selectedNumber: event.target.value})}>
              		<option disabled value = ""></option>
              		{numberOptions}
              	</select>
              </td>
              <td>
              	<select value = {this.state.selectedLevel} onChange = {(event) => this.setState({selectedLevel: event.target.value})}>
              		<option disabled value = ""></option>
              		{levelOptions}
              	</select>
              </td>
              <td>
              	<select value = {this.state.selectedStyle} onChange = {(event) => this.setState({selectedStyle: event.target.value})}>
              		<option disabled value = ""></option>
              		{styleOptions}
              	</select>
              </td>
              <td>
               {danceInput}
              </td>
              <td>
              	<div onClick = {() =>this.addNewRow()}>&#43;</div>
              </td>
            </tr>
          </tbody>

        <Table.Body
          className = {style.tableBody}
          rows = {resolvedRows}
          rowKey = "key"
          onRow = {this.onRow}
        />
      </Table.Provider>
    );
  }

  addNewRow() {
    const {
    	selectedNumber,
      selectedLevel,
      selectedStyle,
      danceInput,
      keyCounter
    } = this.state;
    var rows = this.state.rows;
    if (selectedNumber == "" || selectedLevel == "" 
    		|| selectedStyle == "" || danceInput == "") {
    	return false;
    }
    for (let row of rows) {
      if (row.stylename == selectedStyle && row.levelname == selectedLevel
          && row.dance.toLowerCase() == danceInput.toLowerCase()) {
        return false;
      }
    }

    const newRow = {
    	id: null,
    	ordernumber: selectedNumber,
    	dance: danceInput,
    	stylename: selectedStyle,
    	levelname: selectedLevel,
      key: keyCounter
    };
    rows.splice(selectedNumber - 1, 0, newRow);
    this.setState({
    	rows: rows,
      selectedNumber: "",
      selectedLevel: "",
      selectedStyle: "",
    	danceInput: "",
      keyCounter: keyCounter + 1
    });
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

  autoSortRows() {
  	var _this = this;
    var rows = this.state.rows;
    const levels = this.state.levels.map(level => level.name);
    const styles = this.state.styles.map(style => style.name);
    rows.sort(function(a, b) {
      if (a.stylename != b.stylename) {
        return styles.indexOf(a.stylename) - styles.indexOf(b.stylename);
      }
      if (a.levelname != b.levelname) {
        return levels.indexOf(a.levelname) - levels.indexOf(b.levelname);
      }
      if (a.dance != b.eventorder) {
        if (a.dance < b.dance) {
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