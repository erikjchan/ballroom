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
                  value: '',
                  competition: null,
                  officials: [],
                  official: "",
                  rows: [],
                  // LOAD FROM API
                  numberToRecall: 7,
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
        var { rows, value, numberToRecall } = this.state;
        const newRow = { number: value }; 

        if (isNaN(parseInt(value)) || parseInt(value) > 999 || parseInt(value) < 100) {
            alert("Invalid input!");
        } else if (rows.length >= numberToRecall) {
            alert("Too many numbers entered!");
        } else {
            rows.push(newRow);
        }
        this.setState({ rows: rows, value: '' });
    }
  }

  componentDidMount() {
      fetch(`/api/judges`)
        .then(response => response.json()) // parse the result
        .then(json => {
            // update the state of our component
            var judges = []
            for (var j in json) {
                judges.push(json[j]["First Name"] + " " + json[j]["Last Name"])
            }
            this.setState({ officials : judges })
        })
        // todo; setup a timer to retry. Fingers crossed, hopefully the
        // connection comes back
        .catch(err => alert(
          `There was an error fetching the competition`))

  }

  onRemove(id) {
      const rows = cloneDeep(this.state.rows);
      const idx = findIndex(rows, { id });

      // this could go through flux etc.
      rows.splice(idx, 1);

      this.setState({ rows });
  }

  render() {
    const components = {
      header: {
        wrapper: 'thead',
        row: 'tr',
        cell: 'th'
      }
    };

    const officials = this.state.officials;
    const { columns, rows, numberToRecall } = this.state;

    const resolvedRows = resolve.resolve({
        columns: columns,
        method: resolve.nested
    })(rows);

    return (
     <Page ref="page" {...this.props}>
        <h1>Enter Callbacks</h1>
        <h4>Select Judge:</h4>
        <select value={this.state.official} onChange={(event) => this.setState({official: event.target.value})}>
            <option disabled value=""></option>
            {officials}
        </select>    
        <h4>Enter Number:</h4>
        <input type="text" value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleKeyPress} style={{width: 100}} />
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