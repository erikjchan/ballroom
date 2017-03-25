import { Link } from 'react-router'
import React from 'react'
import * as Table from 'reactabular-table';
import EventRunningInfo from './PageRunCompetition/event.jsx'
import lib from './common/lib.js'
import Page from './Page.jsx'
import style from './style.css';
import { browserHistory } from 'react-router';

export default class RunCompetition extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      competition: lib.flat_loading_proxy,
      rounds: [],
      callbacks: [],
      competitors: [],
      current_round: 0, // Index of currently running event
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

  /***************************** Round selection. *****************************/

  /**
   * Returns the round information for the currently selected round
   */
  getCurrentRound () { return this.state.rounds[this.state.current_round] || null }


  /**
   * Returns all the rounds that already happened,
   * to be shown on the past-rounds table
   */
  getPastRounds () {
    return this.state.rounds.slice(0, this.state.current_round)
  }

  /**
   * Returns all the rounds that haven't yet happened,
   * to be shown on the future-rounds table
   */
  getFutureRounds () {
    return this.state.rounds.slice(this.state.current_round + 1, this.state.rounds.length)
  }

  /**
   * Selects the next round as currently running round
   */
  nextRound () {
    // We've reached the last round. Exit.
    if (this.state.current_round + 1 >= this.state.rounds.length) return;

    // Increment the round number
    this.setState({ current_round : this.state.current_round += 1 })
  }

  /**
   * Selects the previous round as currently running round
   */
  prevRound () {
    // We're on the first round! Exit.
    if (this.state.current_round === 0) return;

    // Decrement the round number
    this.setState({ current_round : this.state.current_round -= 1 })
  }

  /******************************** UI Helpers ********************************/

  /**
   * Returns the columns that will be displayed on the
   * table listing previous rounds
   */
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
    ]
  }

  /**
   * Returns the columns that will be displayed on the
   * table listing upcoming rounds
   */
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

  /**
   * Returns a list of spans with the lead number
   * for each couple in a given round
   */
  getCouplesInRound(round) {
    // Things haven't loaded yet!
    if (!round) return [];
    if (!!round.is_loading) return [];
    if (this.state.competitors.length === 0) return [];

    // We have all the info we need
    return round.competitors.map(id => <span key={id}> {this.state.competitors[id].lead_number} </span>)
  }

  /**
   * Opens the EnterCallbacks page for the current round.
   * If round information hasn't been fetched, does nothing.
   */
  goToEnterCallbacks() {
    const current_round = this.getCurrentRound();
    if (!current_round) return;
    browserHistory.push(`competition/${this.competition_id}/round/${current_round.id}/entercallbacks`);
  }

  /********************************** Render **********************************/

  render() {

    const current_round = this.getCurrentRound() || lib.flat_loading_proxy;

    const past_rounds_table = (this.getPastRounds().length === 0)
      ? <div className="container-content"> Empty </div>
      : <Table.Provider
          style={{width: '100%'}}
          className="pure-table pure-table-striped"
          columns={this.columnsForPreviousRoundsTable()}>
          <Table.Header />
          <Table.Body rows={this.getPastRounds()} rowKey="id" />
        </Table.Provider>

    const future_rounds_table = (this.getFutureRounds().length === 0)
      ? <div className="container-content"> Empty </div>
      : <Table.Provider
          style={{width: '100%'}}
          className="pure-table pure-table-striped"
          columns={this.columnsForNextRoundsTable()}>
          <Table.Header />
          <Table.Body rows={this.getFutureRounds()} rowKey="id" />
        </Table.Provider>

    return (<Page ref="page">

        <h1>Running: {this.state.competition.Name}</h1>


        <div className="container">
          <h2>Past Rounds</h2>
          {past_rounds_table}
        </div>
        <button onClick={this.goToEnterCallbacks.bind(this)}>Enter callbacks</button>


        <div className="container">
          <h2>Current Round</h2>
          <div className="container-content">
            <h3>{current_round.name}</h3>
            <div>{this.getCouplesInRound(current_round)}</div>
            <ul>
              <li>Total # of couples : {current_round.size}</li>
              <li># to recall: {current_round.next_round}</li>
            </ul>

            <button onClick={this.prevRound.bind(this)}> Previous Round </button>
            <button onClick={this.nextRound.bind(this)}> Next Round </button>
          </div>
        </div>


        <div className="container">
          <h2>Upcoming rounds</h2>
          {future_rounds_table}
        </div>

        <Link to={`/competition/${this.competition_id}/editschedule`}>Edit schedule</Link>

    </Page>
   )
  }
}


/* Object formats reference:

Round:

{
  "id": 0,
  "event": 5,
  "name": "Round 1",
  "order_number": 0,
  "size": 70,
  "next_round": 6,
  "judge_1": 0,
  "judge_2": 1,
  "judge_3": 0,
  "judge_4": 2,
  "judge_5": 0,
  "judge_6": 0
}

*/





