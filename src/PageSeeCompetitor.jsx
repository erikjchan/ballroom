/*
 * SEE COMPETITOR
 *
 * This page allows admins to see detailed information about the
 * selected competitor as well as mark them as paid or not paid
 */

import style from "./style.css"
import React from 'react'
import EventTable from './common/EventTable.jsx'
import Page from './Page.jsx'
import lib from './common/lib'
import Box from './common/Box.jsx'
import { RadioGroup, Radio } from 'react-radio-group'
import connection from './common/connection';
import { browserHistory } from 'react-router';

// competition/:competition_id/seecompetitor/:competitor_id
class PageSeeCompetitor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        competitor_events: [],
        competitor: {},
        competitor_paymentrecord: null,
        paid: ''
    }

    try {this.competition_id = this.props.selected.competition.id}
    catch (e) { alert('Invalid competition ID!') }
    try{this.competitor_id = this.props.params.competitor_id}
    catch (e) {alert('Invalid competitor ID!') }
  }

    componentDidMount() {
    /* Call the API for competitor info */
        this.props.api.get(`/api/competitors/${this.competitor_id}`)
          .then(json => {
              this.setState({competitor: json})
              console.log(this.state.competitor)
          })
          .catch(err => { alert(err); console.log(err)})

        this.props.api.get(`/api/payment_records/${this.competition_id}/${this.competitor_id}`)
          .then(json => {
              console.log(json)
              var timestamp = new Date(json.timestamp);
              json.timestamp = timestamp.toUTCString();
              this.state.paid = (json.amount == 0) ? "true" : "false"

              // update the state of our component
              this.setState({competitor_paymentrecord: json})
              console.log(this.state.competitor_paymentrecord)
          })
          .catch(err => { alert(err); console.log(err)})

    /**  Call the API for events that the competitor is in */
        /**  Call the API for events that the competitor is in */
        this.props.api.get(`/api/competitors/${this.competitor_id}/${this.competition_id}/events`)
          .then(json => {
              console.log(json)
              for (let i = 0; i < json.length; i++) {
                  json[i].title = json[i].dance;
                  if (json[i].leadcompetitorid == this.competitor_id) {
                      json[i].leader = this.state.competitor.firstname+" "+this.state.competitor.lastname
                      json[i].follower = json[i].followfirstname+" "+json[i].followlastname
                  } else {
                      json[i].follower = this.state.competitor.firstname+" "+this.state.competitor.lastname
                      json[i].leader = json[i].leadfirstname+" "+json[i].leadlastname
                  }
              }
              this.setState({competitor_events: json})
          })
          .catch(err => { alert(err); console.log(err)})
  }

  handleChange (name, value) {
    this.setState({...this.state, [name]: value});
  };

  handlePayChange = (event) => {
    this.setState({paid: event});
  };

  saveChanges () { 
      const totalAmount = this.state.paid == "true" ? 0 : this.state.competitor_paymentrecord.amount

      const send_object = {
          competitionid: this.props.selected.competition.id,
          competitorid: this.competitor_id,
          amount: totalAmount,
          online: false,
          paidwithaffiliation: this.state.competitor_paymentrecord.paidwithaffiliation
      }

      console.log(send_object);

      /** Post updates */
      this.props.api.post("/api/payment_records/update", send_object).then(()=>{
                window.location.reload();
      })

  } // todo
      

  render() {
      if (this.state.competitor && this.state.competitor_events && this.state.competitor_paymentrecord) {
        return (

         <Page ref="page" {...this.props}>
            <h1>See Competitor</h1>
          <Box title={"Competitor Info: "+this.state.competitor.firstname+" "+this.state.competitor.lastname}
              admin={true}
              content={
                <div className={style.lines}>
                <br />
                {this.state.competitor_paymentrecord &&
                <div className={style.lines}>
                        <p><b>Name:</b> {this.state.competitor.firstname+" "+this.state.competitor.lastname} </p>
                        <p><b>Email:</b> {this.state.competitor.email} </p>
                        <p><b>Organization:</b> {this.state.competitor.affiliationname} </p>
                        <p><b>Number:</b> {this.state.competitor.number==null? "None":this.state.competitor.number} </p>
                        <p><b>Date Registered:</b> {this.state.competitor_paymentrecord.timestamp} </p>
                        <p><b>Amount Owed:</b> ${this.state.competitor_paymentrecord.amount} </p>
                        <p><b>Pay with Organization:</b> {this.state.competitor_paymentrecord.paidwithaffiliation? "Yes": "No"} </p>
                        <h3>Mark as Paid?</h3>
                            <span>
                                <RadioGroup name='payment' selectedValue={this.state.paid} onChange={this.handlePayChange.bind(this)}>
                                    <div><Radio value='true'/>Paid</div>
                                    <div><Radio value='false'/>Unpaid</div>
                                </RadioGroup>
                            </span>
                        <br /> <br/>
                        <p><button className={style.blockcompetitionEditBtns} onClick={this.saveChanges.bind(this)}>Save</button></p>
                 </div>
                }
                <br/>
                <div className={style.separators}></div>
                 <hr/>
                <h2>Competitor is registered for the following events:</h2>
                <EventTable
                    events={this.state.competitor_events}
                />
                <div className = {style.comp_containers}>
                <div className = {style.addeditBtns}>
                    <button className={style.editBtns} onClick={()=>{ browserHistory.push('/competition/' + this.competition_id + '/regcompetitor/' + this.competitor_id) }}>
                        Add/Edit Event
                    </button>
                </div>
                </div>

                </div>
              } />
          </Page>
        );
    } else {
        console.log("waiting on data")
        return <Page ref="page" {...this.props}/>
    }
  }
}

export default connection(PageSeeCompetitor)

