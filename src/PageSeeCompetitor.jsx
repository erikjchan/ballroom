/* 
 * SEE COMPETITOR
 *
 * This page allows admins to see detailed information about the 
 * selected competitor as well as mark them as paid or not paid
 */

import styles from "./style.css"
import React from 'react'
import EventTable from './common/EventTable.jsx'
import Page from './Page.jsx'
import Input from 'react-toolbox/lib/input';
import lib from './common/lib'
import Box from './common/BoxAdmin.jsx'
import style from './style.css';
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';
import connection from './common/connection';
import { browserHistory } from 'react-router';

// competition/:competition_id/seecompetitor/:competitor_id
class PageSeeCompetitor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        competitor: lib.flat_loading_proxy,
        competitor_events: [],
        paid: "False"
    }

    try {this.competition_id = parseInt(this.props.params.competition_id)}
    catch (e) { alert('Invalid competition ID!') }
    try{this.competitor_id = parseInt(this.props.params.competitor_id)}
    catch (e) {alert('Invalid competitor ID!') }
  }

    componentDidMount() {
    /* Call the API for competition info */
    fetch(`/api/competitors/${this.competitor_id}/competition/${this.competition_id}`)
      .then(response => { return response.json() }) // parse the result
      .then(json => { 
          // update the state of our component
          if (json.pay_w_org)
              json.pay_w_org = "True"
          else
              json.pay_w_org = "False"

          if (json.amount_owed == 0) {
              this.setState({ paid: "True" });
          }
        this.setState({ competitor : json })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(err => { alert(err); console.log(err)})

    /**  Call the API for events that the competitor is in */
    fetch(`/api/competitors/${0}/events`)
      .then(response => {
        return response.json()
      })
      .then(json => {
        for (let i = 0; i < json.length; i++) {
            if (json[i].leading) {
                json[i].leader = this.state.competitor.name
                json[i].follower = json[i].partner
            } else {
                json[i].leader = json[i].partner
                json[i].follower = this.state.competitor.name
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

  saveChanges () { lib.post('/api/post/competitor', this.state) } // todo


  render() {    
    return (

     <Page ref="page" {...this.props}>
      <Box title={"Competitor Info"}
          content={
            <div className={style.lines}>
            <br />
            <div className={styles.lines}>
                    <p><b>Name:</b> {this.state.competitor.name}</p>
                    <p><b>Email:</b> {this.state.competitor.email}</p>
                    <p><b>Organization:</b> {this.state.competitor.organization_name}</p>
                    <p><b>Number:</b> {this.state.competitor.lead_number}</p>
                    <p><b>Amount Owed:</b> ${this.state.competitor.amount_owed}</p>
                    <p><b>Pay with Organization:</b> {this.state.competitor.pay_w_org} </p>
                    <h3>Mark as Paid?</h3>
                        <span>
                            <RadioGroup name='comic' value={this.state.paid} onChange={this.handlePayChange}>
                             <RadioButton label='Paid' value='True'/>
                             <RadioButton label='Unpaid' value='False'/>
                            </RadioGroup>
                        </span>
                    <br /><br />
                    <p><button onClick={this.saveChanges.bind(this)}>Save</button></p>
             </div>
            <div className={styles.separators}></div>
            <h2>Competitor is registered for the following events:</h2>
            <EventTable
                events={this.state.competitor_events} 
            /> 
            <div className = {styles.comp_containers}>
            <div className = {styles.addeditBtns}>
                <button className={styles.editBtns} onClick={()=>{ browserHistory.push('/competition/1/regcompetitor/1') }}> 
                    Add/Edit Event
                </button>
            </div>
            </div>

            </div>
          } />
      </Page>   
    );
  }
}

export default connection(PageSeeCompetitor)

// const get_competitors = n => collection(n)(i => ({
//   "id" : i,
//   "first_name" : randomData(1).firstName,
//   "last_name" : randomData().lastName,
//   "email" :  randomData().emailAddress,
//   "mailing_address" : randomData().street,
//   "organization_id" : randomId(ORGANIZATIONS),
//   "password" : uuidV1(),
//   "registered" : randomBool(),
//   "lead_number" : randomInt(0, 100),
// }))


