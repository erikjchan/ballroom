/* 
 * ENTER CALLBACKS
 *
 * This page allows admins to add callbacks for a selected round.
 */

import style from "./style.css"
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import React from 'react'
import Page from './Page.jsx'
import Box from './common/Box.jsx'
import * as Table from 'reactabular-table';
import * as resolve from 'table-resolver';
import { browserHistory, Link } from 'react-router';

// competition/:competition_id/round/:round_id/entercallbacks
export default class PageEnterCallbacks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      callbackColumns: [
        {
          property: 'number',
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
          cell: {
            formatters: [
              (value, { rowData }) => (
                <span
                  onClick = {() => this.onRemove(rowData.id)} style = {{ cursor: 'pointer' }}
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
        }],
      judgeColumns: [
        {
          property: 'firstname',
          props: {
            label: 'First Name',
          },
          header: {
            label: 'First Name'
          }
        },
        {
          property: 'lastname',
          props: {
            label: 'Last Name',
          },
          header: {
              label: 'Last Name'
          }
        }],
      judges: [],
      judgesSubmitted: [],
      selectedJudgeId: "",
      inputCallback: "",
      rounds: [],
      competitors: [],
      rows: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange(event) {
    this.setState({inputCallback: event.target.value});
  }

  handleSubmit(event) {
    if (confirm("Are you sure you want to submit these callbacks?")) {
      this.props.api.post('/api/callbacks/update', {
        rid: this.props.params.round_id,
        jid: this.state.selectedJudgeId,
        cid: this.props.selected.competition.id,
        callbacks: this.state.rows.map(r => ({
          rid: this.props.params.round_id,
          jid: this.state.selectedJudgeId,
          cid: this.props.selected.competition.id,
          number: r.number
        }))
      }).then(() => {
        window.location.reload();
      });
    }
  }
    
  handleKeyPress(event) {
    if (event.key === 'Enter') {
      if (isNaN(this.state.inputCallback)) {
        alert("Invalid competitor number: " + this.state.inputCallback);
      } else {
        const number = parseInt(this.state.inputCallback);
        let numberAlreadyEntered = false;
        for (let r of this.state.rows) {
          if (number == r.number) {
            numberAlreadyEntered = true;
          }
        }
        if (numberAlreadyEntered) {
          alert("Duplicate competitor number: " + number);
          return false;
        }
        let numberIsValid = false;
        for (let c of this.state.competitors) {
          if (number == c.number) {
            numberIsValid = true;
          }
        }
        if (!numberIsValid) {
          alert("Entered number is not in this round: " + number);
          return false;
        }
        const rows = this.state.rows;
        rows.push({
            number: number
        });
        this.setState({
          inputCallback: "",
          rows: rows
        });
      }
    }
  }

  handleCalculation() {
    const nextRound = this.getNextRound();
    this.props.api.post('/api/callbacks/calculate', {
      rid: this.props.params.round_id,
      eventid: nextRound.eventid,
      size: nextRound.size
    }).then(json => {
      if (json.finished) {
        browserHistory.push(`/competition/${this.props.selected.competition.id}/run`);
      } else {
        alert("Callbacks calculation failed. Please try again");
      }
    }).catch(() => {alert("Callbacks calculation failed. Please try again")});
  }

  componentDidMount() {
    console.log("competition id", this.props.selected.competition.id);
    this.props.api.get(`/api/competition/${this.props.selected.competition.id}/judges`)
      .then(json => {
        this.setState({judges: json});
      })
      .catch(() => alert("Failed to fetch judges"));

    this.props.api.get(`/api/judges/round/${this.props.params.round_id}`)
      .then(json => {
        this.setState({judgesSubmitted: json});
      })
      .catch(() => alert("Failed to fetch submitted judges"));
      // todo; setup a timer to retry. Fingers crossed, hopefully the
      // connection comes back
      /*.catch(this.refs.page.errorNotif(
        `There was an error fetching the judges`))*/

    this.props.api.get(`/api/competitors/round/${this.props.params.round_id}`)
      .then(json => {
        this.setState({competitors: json});
      })
      .catch(() => alert("Failed to fetch competitors"));

    this.props.api.get(`/api/event/rounds/${this.props.params.round_id}`)
      .then(json => {
        console.log(json);
        this.setState({rounds: json});
      })
      .catch(() => alert("Failed to fetch rounds"));
  }

  onRemove(id) {
    const rows = cloneDeep(this.state.rows);
    const idx = findIndex(rows, { id });

    // this could go through flux etc.
    rows.splice(idx, 1);

    this.setState({ rows });
  }

  getRoundName(round) {
    console.log(round);
    return round.levelname + " " + round.stylename + " " + round.dance + " " + round.name;
  }

  getCurrentRound() {
    for (let r of this.state.rounds) {
      console.log("check", r.id, this.props.params.round_id);
      if (r.id == this.props.params.round_id) {
        return r;
      }
    }
    return null;
  }

  getNextRound() {
    const currentRound = this.getCurrentRound();
    let foundCurrentRound = false;
    for (let r of this.state.rounds) {
      if (foundCurrentRound && r.eventid == currentRound.eventid) {
        return r;
      } else if (r == currentRound) {
        foundCurrentRound = true;
      }
    }
    return null;
  }

  render() {
    const components = {
      header: {
        wrapper: 'thead',
        row: 'tr',
        cell: 'th'
      }
    };

    const judges = this.state.judges;
    const { callbackColumns, rows, judgeColumns, judgesSubmitted } = this.state;

    const resolvedCallbackRows = resolve.resolve({
      columns: callbackColumns,
      method: resolve.nested
    })(rows);

    const resolvedJudgeRows = resolve.resolve({
      columns: judgeColumns,
      method: resolve.nested
    })(judgesSubmitted);

    const judgeOptions = judges.map(judge => (<option value={judge.id}>{`${judge.firstname} ${judge.lastname}`}</option>))
    const currentRound = this.getCurrentRound();
    const nextRound = this.getNextRound();
    const numberToRecall = nextRound != null ? nextRound.size : null;
    console.log("current round", currentRound);

    return (
     <Page ref="page" {...this.props}>
        <h1>Enter Callbacks</h1>
        <Box title={currentRound != null ? this.getRoundName(currentRound) : "Loading"}
          admin={true}
          content={
         <div style = {{display: 'inline-block', 'min-width': '50%'}} className={style.lines}>
             {this.state.judgesSubmitted.length != 0 &&
                 <div style = {{float: 'right'}}>
                     <h4>Judges Who Submitted Callbacks</h4>
                     <Table.Provider
                         components = {components}
                         columns = {judgeColumns}
                         className = {style.tableWrapper + ' ' + style.regularWidth}
                     >
                         <Table.Header
                             headerRows = {resolve.headerRows({columns: judgeColumns})}
                             className = {style.tableHeader}
                         />
                         <Table.Body
                             className = {style.tableBody}
                             rows = {resolvedJudgeRows}
                             rowKey = "id"
                         />
                     </Table.Provider>
                     <input className={style.saveBtns} style = {{position: 'relative', top: '20px'}} type = "button" value = "Calculate Callbacks"
                            disabled = {judgesSubmitted.length == 0} onClick = {this.handleCalculation.bind(this)}/>
                 </div>
             }
            <h4>Select Judge:</h4>
            <select value = {this.state.selectedJudgeId} onChange = {(event) => this.setState({selectedJudgeId: event.target.value})}>
                <option disabled value = ""></option>
                {judgeOptions}
            </select>
            <h4>Couples in round:</h4>
            <p style = {{'line-height': '1.5em', 'word-spacing': '1em'}}>
                {this.state.competitors.map(c => <span key={c.number}> {c.number} </span>)}
            </p>
            <h4>Enter Number:</h4>
            <input type = "text" value = {this.state.inputCallback} onChange = {this.handleChange} 
              onKeyPress = {this.handleKeyPress} disabled = {this.state.selectedJudgeId == "" || rows.length == numberToRecall} style = {{width: 100}} />
             <br />
             <span style = {{'font-size': '9pt', 'font-style': 'italic'}}>Press Enter to input the number</span>
             {numberToRecall != null &&
                 <p>Number of recalls entered: {rows.length} / {numberToRecall}</p>
             }
             {this.state.rows.length != 0 &&
                <div>
                    <input className={style.saveBtns} type = "button" value = "Submit numbers" disabled = {rows.length != numberToRecall} onClick = {this.handleSubmit} />
                    <h4>Entered Numbers:</h4>
                    <Table.Provider
                     components = {components}
                     columns = {callbackColumns}
                     className = {style.tableWrapper + ' ' + style.regularWidth}
                     >
                         <Table.Header
                         headerRows = {resolve.headerRows({ columns: callbackColumns })}
                         className = {style.tableHeader}
                         />
                         <Table.Body
                         className = {style.tableBody}
                         rows = {resolvedCallbackRows}
                         rowKey = "number"
                         />
                    </Table.Provider>
                </div>
             }
         </div>
       } />
      </Page>
    )
  }
}