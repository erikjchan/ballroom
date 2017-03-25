import { Link } from 'react-router'
import React from 'react'
import * as Table from 'reactabular-table';
import EventRunningInfo from './PageRunCompetition/event.jsx'
import lib from './common/lib.js'
import Page from './Page.jsx'
import style from './style.css';

// a round
// { 
//     "id": 0,
//     "event": 5,
//     "name": "Round 1",
//     "order_number": 0,
//     "size": 70,
//     "next_round": 6,
//     "judge_1": 0,
//     "judge_2": 1,
//     "judge_3": 0,
//     "judge_4": 2,
//     "judge_5": 0,
//     "judge_6": 0
//   }


export default class RunCompetition extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      competition: lib.flat_loading_proxy,
      rounds: [],
      callbacks: [],
      competitors: [],

      // Index of currently running event
      current_round: 2,

    }

    /** Take the competition ID from the URL (Router hands
    it to us; see the path for this Page on Router) and make
    sure it's an integer */
    try {this.competition_id = parseInt(this.props.params.competition_id)}
    catch (e) { alert('Invalid competition ID!') }
  }

  componentDidMount() {


    /* Call the API for competition info */
    fetch(`/api/competition/${this.competition_id}`)
      .then(response => response.json()) // parse the result
      .then(json => { 
        // update the state of our component
        this.setState({ competition : json })
      })
      // todo; setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(this.refs.page.errorNotif(
        `There was an error fetching the competition`))

    /* Call the API for competition info */
    fetch(`/api/competition/${this.competition_id}/rounds`)
      .then(response => response.json()) // parse the result
      .then(json => { 
        // update the state of our component
        this.setState({ rounds : json.splice(0,5) })

      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(this.refs.page.errorNotif(
        `There was an error fetching the rounds`))

    /* Call the API for competition info */
    fetch(`/api/callbacks`)
      .then(response => response.json()) // parse the result
      .then(json => { 
        // update the state of our component
        this.setState({ callbacks : json })

      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(this.refs.page.errorNotif(
        `There was an error fetching the callbacks`))


    /* Call the API for competition info */
    fetch(`/api/competitors`)
      .then(response => response.json()) // parse the result
      .then(json => { 
        // update the state of our component
        this.setState({ competitors : json })

      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(this.refs.page.errorNotif(
        `There was an error fetching the callbacks`))
  }


  columnsForPreviousRoundsTable() {
    return [
      {
        property: 'name',
        header: {
          label: 'Name',
          sortable: true,
          resizable: true
        }
      },
      {
        property: 'order_number',
        header: {
          label: 'Order',
          sortable: true,
          resizable: true
        }
      }
      // {
      //   width: 200,
      //   cell: {
      //     formatters: [
      //       (value, {rowData}) => (
      //         <div>
      //           <input
      //             type="button"
      //             value="Click me"
      //             onClick={() => alert(`${JSON.stringify(rowData, null, 2)}`)}
      //           />
      //           <span
      //             className="remove"
      //             onClick={() => this.onRemove(rowData.Id)}
      //             style={{ marginLeft: '1em', cursor: 'pointer' }}
      //           >
      //             &#10007;
      //           </span>
      //         </div>
      //       )
      //     ]
      //   }
      // }
    ]
  }


  columnsForNextRoundsTable() {
    return [
      {
        property: 'name',
        header: {
          label: 'Name',
          sortable: true,
          resizable: true
        }
      },
      {
        property: 'size',
        header: {
          label: 'No. couples',
          sortable: true,
          resizable: true
        }
      }
    ]
  }

  nextRound () { this.setState({ current_round : current_round += 1 }) }
  prevRound () { this.setState({ current_round : current_round -= 1 }) }


 render() {

  const current_round = this.state.rounds[this.state.current_round] || lib.flat_loading_proxy

  const competitors_in_current_round = (!!current_round.is_loading || this.state.competitors.length === 0) 
    ? []
    : current_round.competitors.map(id => {
      return <span key={id}> {this.state.competitors[id].lead_number} </span>
    }
    )
  console.log(this.state.competitors.length === 0, competitors_in_current_round)

  return (<Page ref="page">

      <h1>Running: {this.state.competition.Name}</h1>
      


      <div className="container">
        <h2>Past Rounds</h2>
          <Table.Provider
            style={{width: '100%'}}
            className="pure-table pure-table-striped"
            columns={this.columnsForPreviousRoundsTable()}>
            <Table.Header />
            <Table.Body rows={this.state.rounds || []} rowKey="id" />
          </Table.Provider>
      </div>
      <button>Enter callbacks</button>





      <div className="container">
        <h2>Current Round</h2>
        <div className="container-content">
          <h3>{current_round.name}</h3>
          <div>{competitors_in_current_round}</div>
          <ul>
            <li>Total # of couples : {current_round.size}</li>
            <li># to recall: {current_round.next_round}</li>
          </ul>

          <button> Previous Round </button> <button> Next Round </button>
        </div>
      </div>


      <div className="container">
        <h2>Upcoming rounds</h2>
          <Table.Provider
            style={{width: '100%'}}
            className="pure-table pure-table-striped"
            columns={this.columnsForNextRoundsTable()}>
            <Table.Header />
            <Table.Body rows={this.state.rounds} rowKey="id" />
          </Table.Provider>
      </div>

      <Link to={`/competition/${this.competition_id}/editschedule`}>Edit schedule</Link>


  </Page>
  )
 }
}







