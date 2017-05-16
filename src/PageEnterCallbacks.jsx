import styles from "./style.css"
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import React from 'react'
import Page from './Page.jsx'
import * as Table from 'reactabular-table';
import * as resolve from 'table-resolver';
import { browserHistory, Link } from 'react-router';

// competition/:competition_id/round/:round_id/entercallbacks
export default class PageEnterCallbacks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
                columns: [
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
                            }],
                  callbacks: [],
                  judges: [],
                  selectedJudgeId: null,
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
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }
    
  handleKeyPress(event) {
    if (event.key === 'Enter') {
        if (isNaN(this.state.inputCallback)) {
            alert("Invalid competitor number: " + this.state.inputCallback);
        } else {
            const number = parseInt(this.state.inputCallback);
            let numberAlreadyCalled = false;
            for (let c of this.state.callbacks) {
                if (this.state.selectedJudgeId == c.judgeid && number == c.number) {
                    numberAlreadyCalled = true;
                }
            }
            if (numberAlreadyCalled) {
                alert("Duplicate competitor number: " + number);
                return false;
            }
            let numberIsValid = false;
            for (let c of this.state.competitors) {
                if (number == c) {
                    numberIsValid = true;
                }
            }
            if (!numberIsValid) {
                alert("Entered number is not in this round: " + number);
                return false;
            }
            const callbacks = this.state.callbacks;
            callbacks.push({
                judgeid: this.state.selectedJudgeId,
                number: number,
                roundid: this.props.params.round_id,
                competitionid: this.props.selected.competition.id
            });
            const rows = this.state.rows;
            rows.push({
                id: rows.length,
                number: number
            });
            this.setState({
                callbacks: callbacks,
                inputCallback: "",
                rows: rows
            });
        }
    }
  }

  componentDidMount() {
      this.props.api.get(`/api/competition/${this.props.selected.competition.id}/judges`)
        .then(json => {
            this.setState({judges: json});
        })
        // todo; setup a timer to retry. Fingers crossed, hopefully the
        // connection comes back
        .catch(this.refs.page.errorNotif(
          `There was an error fetching the judges`))

      this.props.api.get(`/api/competitors/round/${this.props.params.round_id}`)
        .then(json => {
            this.setState({competitors: json});
        })
        .catch(this.refs.page.errorNotif("There was an error fetching the competitors"));
      this.props.api.get(`/api/callbacks/${this.props.params.round_id}`)
        .then(json => {
            this.setState({callbacks: json});
        })
        .catch(this.refs.page.errorNotif("There was an error fetching the callbacks"));
      this.props.api.get(`/api/event/rounds/${this.props.params.round_id}`)
          .then(json => {
              this.setState({rounds: json});
          })
  }

  onRemove(id) {
      const rows = cloneDeep(this.state.rows);
      const idx = findIndex(rows, { id });

      // this could go through flux etc.
      const row = rows.splice(idx, 1);

      const callbacks = cloneDeep(this.state.callbacks);
      const idx2 = findIndex(callbacks, {judgeId: this.state.selectedJudgeId, number: row[0].number});
      callbacks.splice(idx2, 1);

      console.log(callbacks);

      this.setState({ rows, callbacks });
  }

  getCurrentRound() {
      for (let r of this.state.rounds) {
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
    const { columns, rows } = this.state;

    const resolvedRows = resolve.resolve({
        columns: columns,
        method: resolve.nested
    })(rows);

    const judgeOptions = judges.map(judge => (<option value={judge.id}>{`${judge.firstname} ${judge.lastname}`}</option>))
    const nextRound = this.getNextRound();
    const numberToRecall = nextRound != null ? nextRound.size : null;

    return (
     <Page ref="page" {...this.props}>
        <h1>Enter Callbacks</h1>
        <h4>Select Judge:</h4>
        <select value={this.state.selectedJudgeId} onChange={(event) => this.setState({selectedJudgeId: event.target.value})}>
            <option disabled value=""></option>
            {judgeOptions}
        </select>    
        <h4>Enter Number:</h4>
        <input type="text" value={this.state.inputCallback} onChange={this.handleChange} onKeyPress={this.handleKeyPress} disabled={this.state.selectedJudgeId != null} style={{width: 100}} />
        <h4>Entered Numbers:</h4>
        <Link to={`/competition/${0}/round/${0}/entercallbacks`}>
            <input type="button"
                   value="Submit numbers" />
        </Link>
         {numberToRecall != null &&
             <p>Number of recalls entered: {rows.length} / {numberToRecall}</p>
         }
        <Table.Provider
          components={components}
          columns={columns}
          className={styles.tableWrapper}
        >
            <Table.Header
              headerRows={resolve.headerRows({ columns })}
              className={styles.tableHeader}
            />
            <Table.Body
              className={styles.tableBody}
              rows={resolvedRows}
              rowKey="id"
            />
        </Table.Provider>
      </Page>
    )
  }
}