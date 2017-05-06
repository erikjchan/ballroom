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
                  rounds: [],
                  competitors: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange(event) {
    console.log("DOING THING CHANGE")
    console.log(this);
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }
    
  handleKeyPress(event) {
    if (event.key === 'Enter') {
        
    }
  }

  componentDidMount() {
      fetch(`/api/competition/${1}/judges`) // TODO: Change 1 to cid
        .then(response => response.json()) // parse the result
        .then(json => {
            this.setState({judges: json});
        })
        // todo; setup a timer to retry. Fingers crossed, hopefully the
        // connection comes back
        .catch(this.refs.page.errorNotif(
          `There was an error fetching the judges`))

      fetch(`/api/competitors/round/${this.props.params.round_id}`)
        .then(response => response.json())
        .then(json => {
            this.setState({competitors: json});
        })
        .catch(this.refs.page.errorNotif("There was an error fetching the competitors"));
      fetch(`/api/callbacks/${this.props.params.round_id}`)
        .then(response => response.json())
        .then(json => {
            this.setState({callbacks: json});
        })
        .catch(this.refs.page.errorNotif("There was an error fetching the callbacks"));
      fetch(`/api/event/rounds/${this.props.params.round_id}`)
          .then(response => response.json())
          .then(json => {
              this.setState({rounds: json});
          })
  }

  onRemove(id) {
      const rows = cloneDeep(this.state.rows);
      const idx = findIndex(rows, { id });

      // this could go through flux etc.
      rows.splice(idx, 1);

      this.setState({ rows });
  }

  getCurrentRound() {
      for (let r of this.state.rounds) {
          if (r.id == this.props.params.round_id) {
              return r;
          }
      }
      return null;
  }

  stringifyCallbacks() {
      var callbacks = "";
      if (this.state.selectedJudgeId == null) {
          return "";
      }
      for (let c of this.state.callbacks) {
          if (c.judgeid == this.state.selectedJudgeId) {
              callbacks += (c.number + "\n");
          }
      }
      return callbacks;
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

    return (
     <Page ref="page" {...this.props}>
        <h1>Enter Callbacks</h1>
        <h4>Select Judge:</h4>
        <select value={this.state.selectedJudgeId} onChange={(event) => this.setState({selectedJudgeId: event.target.value})}>
            <option disabled value=""></option>
            {judgeOptions}
        </select>    
        <h4>Enter Number:</h4>
        <textarea value={this.stringifyCallbacks()} onChange={this.handleChange} onKeyPress={this.handleKeyPress} style={{width: 100}}></textarea>
        <h4>Entered Numbers:</h4>
        <Link to={`/competition/${0}/round/${0}/entercallbacks`}>
            <input type="button"
                   value="Submit numbers" />
        </Link>
        <p>Number of recalls entered: {rows.length} / {numberToRecall}</p>
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