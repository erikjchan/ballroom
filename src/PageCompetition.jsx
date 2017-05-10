/*
 * COMPETITION HOME PAGE (USERS)
 *
 * This page is the main hub for users when seeing information about
 * a specific competition they have been registered for.
 */


import styles from "./style.css"
import React from 'react'
import EventTable from './common/EventTable.jsx'
import CompEventTable from './common/CompEventTable.jsx'
import Box from './common/Box.jsx'
import Page from './Page.jsx'
import * as Table from 'reactabular-table';
import { browserHistory, Link } from 'react-router';

// competition/:competition_id/:competitor_id
export default class PageCompetition extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      competition: null,
      competitor_events: [],
      competitor: {},
      competitor_paymentrecord: {}
    }

    /** Take the competition ID from the URL (Router hands
    it to us; see the path for this Page on Router) and make
    sure it's an integer */
    try {this.competition_id = this.props.selected.competition.id}
    catch (e) { alert('Invalid competition ID!') }
    try{this.competitor_id = this.props.profile.competitor_id}
    catch (e) {alert('Invalid competitor ID!') }
 }

  componentDidMount() {
    /* Call the API for competition info */
    this.props.api.get(`/api/competition/${this.competition_id}`)
      .then(json => {
        this.competition = json;
        const startdate          = new Date(this.competition.startdate);
        const enddate            = new Date(this.competition.enddate);
        const regstartdate       = new Date(this.competition.regstartdate);
        const earlyregdeadline   = new Date(this.competition.earlyregdeadline);
        const regularregdeadline = new Date(this.competition.regularregdeadline);
        const lateregdeadline    = new Date(this.competition.lateregdeadline);
        this.competition.startdate = startdate.toUTCString();
        this.competition.enddate = enddate.toUTCString();
        this.competition.regstartdate = regstartdate.toUTCString();
        this.competition.earlyregdeadline = earlyregdeadline.toUTCString();
        this.competition.regularregdeadline = regularregdeadline.toUTCString();
        this.competition.lateregdeadline = lateregdeadline.toUTCString();

        // update the state of our component
        this.setState({ competition : json })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the
      // connection comes back
      .catch(err => { alert(err); console.log(err)})

    /** Get competitor */
    this.props.api.get(`/api/competitors/${this.competitor_id}`)
      .then(json => {
        this.setState({competitor: json})
        console.log(this.state.competitor)
      })
      .catch(err => { alert(err); console.log(err)})

    this.props.api.get(`/api/payment_records/${this.competition_id}/${this.competitor_id}`)
      .then(json => {

        this.payment = json;
        var timestamp = new Date(this.payment.timestamp);
        this.payment.timestamp = timestamp.toUTCString();

        // update the state of our component
        this.setState({competitor_paymentrecord: json})
        console.log(this.state.competitor_paymentrecord)
      })
      .catch(err => { alert(err); console.log(err)})

    /**  Call the API for events that the competitor is in */
    this.props.api.get(`/api/competitors/${this.competitor_id}/${this.competition_id}/events`)
      .then(json => {
        console.log(json)
        for (let i = 0; i < json.length; i++) {
            json[i].title = json[i].dance;
            if (json[i].leadcompetitorid == this.competitor_id) {
                json[i].leader = "You"
                json[i].follower = json[i].followfirstname+" "+json[i].followlastname
            } else {
                json[i].follower = "You"
                json[i].leader = json[i].leadfirstname+" "+json[i].leadlastname
            }
        }
        this.setState({competitor_events: json})
      })
      .catch(err => { alert(err); console.log(err)})
  }

 format_date(datestring){
   d = new Date(datestring)
   return ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
    d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
 }
 render() {
   if (this.state.competition){
    var comp_name = this.state.competition.name;
    var comp_info = (<div className={styles.lines}>
                      <p><b>Date:</b> {this.state.competition.startdate} - {this.state.competition.enddate}</p>
                      <p><b>Location:</b> {this.state.competition.locationname}</p>
                      <p><b>Early Registration Deadline:</b> {this.state.competition.earlyregdeadline} (${this.state.competition.earlyprice})</p>
                      <p><b>Regular Registration Deadline:</b> {this.state.competition.regularregdeadline} (${this.state.competition.regularprice})</p>
                      <p><b>Late Registration Deadline:</b> {this.state.competition.lateregdeadline} (${this.state.competition.lateprice})</p>
                    </div>)
    /* TODO: How to get numbe rof competitors in different styles?*/
    // var style_category={}
    // this.state.competitors.map(c => {
    //     return event.competitionId === this.competition_id
    // })

    var competitor_info = (<div className={styles.lines}>
                      <p><b>Name:</b> {this.state.competitor.firstname+" "+this.state.competitor.lastname}</p>
                      <p><b>Email:</b> {this.state.competitor.email}</p>
                      <p><b>Organization:</b> {this.state.competitor.affiliationname}</p>
                      <p><b>Number:</b> {this.state.competitor.number==null? "None":this.state.competitor.number}</p>
                      <p><b>Date Registered:</b> {this.state.competitor_paymentrecord.timestamp}</p>
                      <p><b>Amount Owed:</b> ${this.state.competitor_paymentrecord.amount}</p>
                      <p><b>Paying with Organization:</b> {this.state.competitor_paymentrecord.paidwithaffiliation? "Yes": "No"} </p>
                    </div>)

    var event_titles = (<div className={styles.lines}>
                          {this.state.competitor_events.sort(function (a, b){
                          return a.id - b.id}).map((event, i) => {
                            return (<p key={event.Title} key={i}>{event.Title}</p>)
                          })}
                        </div>)


    const event_table_columns = [
      {
        property: 'name',
        header: {
          label: 'Name',
          sortable: true,
          resizable: true
        }
      },
      {
        property: 'partner',
        header: {
          label: 'Partner',
          sortable: true,
          resizable: true
        }
      },
      {
        property: 'amount awed',
        header: {
          label: 'Amount awed',
          sortable: true,
          resizable: true
        }
      }
    ]

    return (
      <Page ref="page" {...this.props}>
          <h1>{comp_name}</h1>
          <div className={styles.infoTables}>
            <div className={styles.infoBoxLeft}>
              <Box title={
                <div className={styles.titleContainers}>
                  <span>Competition Info</span>
                </div>}>
                {comp_info}
              </Box>
            </div>
            <div className={styles.infoBoxRight}>
              <Box title={<div className={styles.titleContainers}><span>User Info</span>
                            <Link to={`/editprofile`}>
                            <input type="button" className={styles.editBtns}
                                      value="Edit" /></Link>
                          </div>}>{competitor_info}</Box>
            </div>

            <div className={styles.separators}></div>

            <div className={styles.eventTableCompetitor}>

             <div className={styles.separators}></div>
             <Box title={<div className={styles.titleContainers}><span>Your Events</span></div>}>
              {<div>
                  <div className={styles.eventtable_containers}>
                    <EventTable events={this.state.competitor_events} />
                  </div>
                  <div className = {styles.comp_containers}>
                    <div className = {styles.addeditBtns}>
                      <button
                        className={styles.editBtns}
                        onClick={()=>{ browserHistory.push('/competition/1/eventregistration') }}>
                          Add/Edit Event
                        </button>
                    </div>
                  </div>
                </div>
              }</Box>
            </div>
      </div>

      </Page>

    );
  }
  else {
    return <Page ref="page" {...this.props}></Page>
  }
 }
}