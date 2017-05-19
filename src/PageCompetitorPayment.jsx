/* 
 * COMPETITOR PAYMENT
 *
 * This page allows admins to view and edit a specific competitor's payment
 * information for a specific competition.
 */

import style from "./style.css"
import React from 'react'
import EventTable from './common/EventTable.jsx'
import CompEventTable from './common/CompEventTable.jsx'
import Box from './common/Box.jsx'
import Page from './Page.jsx'
import * as Table from 'reactabular-table';
import { browserHistory } from 'react-router';

// competitorpayment/:competition_id/:competitor_id
export default class PageCompetitorPayment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      competition: null,
      competitor: null,
      payment_record:null,
    }

    /** Take the competition ID from the URL (Router hands
    it to us; see the path for this Page on Router) and make
    sure it's an integer */
    try {this.competitor_id = this.props.profile.competitor_id}
    catch (e) { alert('Invalid competitor ID!') }

    try {this.competition_id = this.props.selected.competition.id}
    catch (e) { alert('Invalid competition ID!') }
  }

  componentDidMount() {
    /* Call the API for competition info */
    this.props.api.get(`/api/competitors/${this.competitor_id}`)
      .then(json => { 
        // update the state of our component
        this.setState({ competitor : json })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(err => { console.log(err)})

    /* Call the API for competition info */
    this.props.api.get(`/api/competition/${this.competition_id}`)
      .then(json => { 
        // update the state of our component
        this.setState({ competition : json })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(err => { console.log(err)})

    /* Call the API for competitor payment info */
    this.props.api.get(`/api/payment_records/${this.competition_id}/${this.competitor_id}`)
      .then(json => { 
        // update the state of our component
        this.setState({ payment_record : json })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(err => { console.log(err)})
  }

  render() {
    if (this.state.competitor && this.state.competition && this.state.payment_record){
      var comp_name1 = String(this.state.competitor.firstname);
      var comp_name2 = this.state.competitor.lastname;
      var comp_name = comp_name1.concat(" ", comp_name2);
      var comp_info = (
        <form className = {style.long_form}>        
          <div>
            <div className = {style.form_row}>
              <label className = {style.full_label}>
                Competitor Name: 
                {comp_name}
              </label>
            </div>
            <div className = {style.form_row}>
              <label className = {style.full_label}>
                Last Payment Change: 
                {this.state.payment_record.timestamp}
              </label>
            </div>
            <div className = {style.form_row}>
              <label className = {style.full_label}>
                Registration Time: 
                {/*todo*/}
                {this.state.payment_record.timestamp}
              </label>
            </div>
            <div className = {style.form_row}>
              <label className = {style.long_label}>
                Amount Owed: 
                {this.state.payment_record.amount}
              </label>
            </div>
            <div className = {style.form_row}>
              <label className = {style.long_label}>
                Paying Online
              </label><br />
              <br /><input type="radio" name="online" value = "true" /> True <br />
              <input type="radio" name="online" value = "false" /> False 
            </div>
            <div className = {style.form_row}>
              <label className = {style.long_label}>
                Paying with Organization<br />
              </label><br />
              <br /><input type="radio" name="organization" value = "true" /> True <br />
              <input type="radio" name="organization" value = "false" /> False
            </div>
            <div className = {style.form_row}>
              <input className = {style.competitionEditBtns} type="submit" value="Save Changes" />
            </div>
          </div>
        </form>);

      return (
        <Page ref = "page" {...this.props}>
          <div className = {style.titles}>
          </div>
          <div className={style.infoTables}>
          </div>
          <div>
            <div className = {style.infoBoxExpanded}>
              <Box admin = {true} title = {
                <div className = {style.titleContainers}><span>Competitor Payment Info</span> 
                </div>} 
                content = {comp_info}/>
            </div>
          </div>
        </Page>
      );

    } else {
      return <Page ref="page" {...this.props}/>
    }
  }
}
