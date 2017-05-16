/* 
 * RUN COMPETITION  
 *
 * This page lets admins progress their competition though the selected rounds.
 */

import { Link } from 'react-router'
import React from 'react'
import * as Table from 'reactabular-table';
import EventRunningInfo from './PageRunCompetition/event.jsx'
import lib from './common/lib.js'
import Page from './Page.jsx'
import Box from './common/Box.jsx'
import style from './style.css';
import { browserHistory } from 'react-router';

import { apiRequest, login, fetchQuote } from './actions'

// competition/:competition_id/run
export default class RunCompetition extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      competition: lib.flat_loading_proxy,
      rounds: [],
      competitors: [],
      current_round: null
    }

    /** Take the competition ID from the URL (Router hands
    it to us; see the path for this Page on Router) and make
    sure it's an integer */
    try {this.competition_id = this.props.params.competition_id}
    catch (e) { alert('Invalid competition ID!') }
  }

  componentDidMount() {

    /* Call the API for competition info */
    this.props.api.get(`/api/competition/${this.competition_id}`)
      .then(json => {
        this.props.api.get(`/api/competition/${this.competition_id}/rounds`)
          .then(json2 => {
            // update the state of our component
            this.setState({
              competition: json, 
              rounds: json2,
              current_round: json2.filter(round => round.id == json.currentroundid)[0] 
            });
            console.log(json2);
          })
          // todo; display a nice (sorry, there's no connection!) error
          // and setup a timer to retry. Fingers crossed, hopefully the
          // connection comes back
          .catch(err => alert(`There was an error fetching the rounds`))
        this.props.api.get(`/api/competitors/round/${json.currentroundid}`)
          .then(json => {
            this.setState({competitors: json.map(c => c.number)});
          });  
      })
      // todo; setup a timer to retry. Fingers crossed, hopefully the
      // connection comes back
      .catch(err => alert(
        `There was an error fetching the competition`))
  }

  /***************************** Round selection. *****************************/

  /**
   * Returns the round information for the currently selected round
   */
  getCurrentRound () { return this.state.current_round }


  /**
   * Returns all the rounds that already happened,
   * to be shown on the past-rounds table
   */
  getPastRounds () {
    if (this.state.current_round == null) {
      return null;
    }
    return this.state.rounds.slice(0, this.state.current_round.ordernumber - 1)
  }

  /**
   * Returns all the rounds that haven't yet happened,
   * to be shown on the future-rounds table
   */
  getFutureRounds () {
    if (this.state.current_round == null) {
      return null;
    }
    return this.state.rounds.slice(this.state.current_round.ordernumber, this.state.rounds.length)
  }

  /**
   * Selects the next round as currently running round
   */
  nextRound () {
    // We've reached the last round. Do nothing.
    if (this.state.current_round.ordernumber + 1 >= this.state.rounds.length) return;

    // Acutally switch rounds?
    if (!confirm("This will start the next round.\nDo you want to continue?")) return;

    // Increment the round number
    const next_round = this.state.rounds[this.state.current_round.ordernumber];
    this.updateDBCurrentRoundId(next_round.id);
    this.setState({ current_round : next_round });
    this.props.api.get(`/api/competitors/round/${next_round.id}`)
      .then(json => {
        this.setState({competitors: json.map(c => c.number)});
      });
  }

  /**
   * Selects the previous round as currently running round
   */
  prevRound () {
    // We're on the first round! Exit.
    if (this.state.current_round.ordernumber === 1) return;

    // Acutally switch rounds?
    if (!confirm("This will return to a previous round.\nDo you want to continue?")) return;

    // Decrement the round number
    const prev_round = this.state.rounds[this.state.current_round.ordernumber - 2];
    this.updateDBCurrentRoundId(prev_round.id);
    this.setState({ current_round: prev_round });
    this.props.api.get(`/api/competitors/round/${prev_round.id}`)
      .then(json => {
        this.setState({competitors: json.map(c => c.number)});
      });
  }

  prevRoundSameEventCallbacksCalculated() {
    if (this.state.current_round == null) {
      return false;
    }
    for (let i = this.state.current_round.ordernumber - 2; i >= 0; i--) {
      let prevRound = this.state.rounds[i];
      if (prevRound.eventid == this.state.current_round.eventid) {
        return prevRound.callbackscalculated;
      }
    }
    return true;
  }

  updateDBCurrentRoundId(rid) {
    this.props.api.post("/api/competition/updateCompetitionCurrentRoundId", {
        cid: this.competition_id,
        rid: rid
    });
  }

  /******************************** Management ********************************/

  enterCallbacksFor(round) {

    // Confirm with the user
    if (!confirm(`Are you sure you want to enter callbacks for ${this.getRoundName(round)}?`)) return;

    browserHistory.push(`/competition/${this.competition_id}/round/${round.id}/entercallbacks`);

  }

  /******************************** UI Helpers ********************************/


  getRoundName(round) {
    return round.levelname + " " + round.stylename + " " + round.dance + " " + round.round;
  }

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
        },
        cell: {
          formatters: [
            (value, {rowData}) => this.getRoundName(rowData)
          ]
        }
      },
      {
        header: {
          label: "Callbacks Recieved",
          sortable: true,
          resizable: true,
        },
        cell: { formatters: [
          (value, {rowData}) => rowData.callbackscalculated ? "Yes" : "No"   
        ]}
      },
      {
        cell: { formatters: [
          (value, {rowData}) => !rowData.callbackscalculated && (
            <button
              onClick={() => this.enterCallbacksFor(rowData)}
            > Enter Callbacks
            </button>)    
        ]}
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
        },
        cell: {
          formatters: [
            (value, {rowData}) => this.getRoundName(rowData)
          ]
        }
      },
      {
        property: 'size',
        header: {
          label: 'Number of Couples',
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
  getNumCouplesInRound(round) {
    // Things haven't loaded yet!
    if (!round) return 0;
    if (!!round.is_loading) return 0;
    if (this.state.competitors.length === 0) return 0;

    // We have all the info we need
    else return round.size;
  }

  getNextRoundSameEventSize() {
    if (this.state.current_round == null) {
      return "Loading..."
    }
    for (let i = this.state.current_round.ordernumber; i < this.state.rounds.length; i++) {
      let futureRound = this.state.rounds[i];
      if (futureRound.eventid == this.state.current_round.eventid) {
        return futureRound.size;
      }
    }
    return "N/A";
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

    const pastRounds = this.getPastRounds();
    const past_rounds_table = (pastRounds == null || this.getPastRounds().length === 0)
      ? <div className={style.lines}> <h2>Empty</h2> </div>
      : <Table.Provider
          style={{width: '100%'}}
          className="pure-table pure-table-striped"
          columns={this.columnsForPreviousRoundsTable()}>
          <Table.Header />
          <Table.Body rows={this.getPastRounds()} rowKey="id" />
        </Table.Provider>

    const futureRounds = this.getFutureRounds();
    const future_rounds_table = (futureRounds == null || this.getFutureRounds().length === 0)
      ? <div className="container-content"> Empty </div>
      : <Table.Provider
          style={{width: '100%'}}
          className="pure-table pure-table-striped"
          columns={this.columnsForNextRoundsTable()}>
          <Table.Header />
          <Table.Body rows={this.getFutureRounds()} rowKey="id" />
        </Table.Provider>

    return (<Page ref="page" {...this.props}>

        <h1>Running: {this.state.competition.name}</h1>

       <Box admin={true} title={"Past Rounds"}
            content ={past_rounds_table} />
        {/*<div className="container admin">
          <h2>Past Rounds</h2>
          {past_rounds_table}
        </div>*/}

       <Box admin={true} title={"Current Round"}
            content ={
          <div className={style.lines}>
            <h3>{this.getRoundName(current_round)}</h3>

            <div>
              <h5>Couples in round:</h5>
              {this.prevRoundSameEventCallbacksCalculated() && this.state.competitors.map(id => <span key={id}> {id} </span>)}
            </div>
            <ul>
              <li>Total number of couples : {this.prevRoundSameEventCallbacksCalculated() && this.getNumCouplesInRound(current_round)}</li>
              <li>Number to recall: {this.getNextRoundSameEventSize()}</li>
            </ul>

            <span className="right_align">
              <button className={style.roundBtns} onClick={this.nextRound.bind(this)}> Next Round </button>
              <button className={style.roundBtns} onClick={this.prevRound.bind(this)}> Previous Round </button>
            </span>
          </div>} />

        {/*<div className="container admin">
          <h2>Current Round</h2>*/}
        
        <Box admin={true} 
          title = "Upcoming Rounds"
          content = {future_rounds_table}
        />
        {/*<div className="container admin">
          <h2>Upcoming rounds</h2>
          {future_rounds_table}
        </div>*/}
          <div className = {style.clear}>
        <div id={style.createContainer}>
            <button id={style.saveChanges} 
              onClick={
                () => this.props.router.push(`/competition/${this.competition_id}/editschedule`)}>Edit Schedule</button>
        </div>
        </div>

    </Page>
   )
  }
}
