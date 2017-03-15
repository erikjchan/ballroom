
import styles from "./style.css"
import React from 'react'
import XSidebar from '../common/XSidebar.jsx'
import Box from '../common/Box.jsx'
import Competitor_events from './competitor_events.jsx';

export default class PageCompetitionHomeAdmin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      competition: null,
      competitor_events: [],
      competitor: [],

    }

    /** Take the competition ID from the URL (Router hands
    it to us; see the path for this Page on Router) and make
    sure it's an integer */
    try {this.competition_id = parseInt(this.props.params.competition_id)}
    catch (e) { alert('Invalid competition ID!') }
    try{this.competitor_id = parseInt(this.props.params.competitor_id)}
    catch (e) {alert('Invalid competitor ID!') }
 }

  componentDidMount() {
    /* Call the API for competition info */
    fetch(`/api/competition/${this.competition_id}`)
      .then(response => response.json()) // parse the result
      .then(json => { 
        // update the state of our component
        this.setState({ competition : json })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(err => alert(err))

    
    /** Fetch competitor */
    fetch(`http://localhost:8080/api/competitors/${this.competitor_id}`)
      .then(response => {
        return response.json()
      })
      .then(json => {

        this.setState({competitor: json})
      })
      .catch(err => alert(err))

    /**  Call the API for events that the competitor is in */
    fetch(`http://localhost:8080/api/competitors/${this.competitor_id}/events`)
      .then(response => {
        return response.json()
      })
      .then(json => {

        this.setState({competitor_events: json})
      })
      .catch(err => alert(err))
  }

 render() {
   if (this.state.competition){
    var comp_name = this.state.competition.Name;
    var comp_info = (<div className={styles.lines}>
                      <p><b>Date:</b> {this.state.competition.StartDate}</p>
                      <p><b>Location:</b> {this.state.competition.LocationName}</p>
                      <p><b>Early Registration Deadline:</b> {this.state.competition.EarlyRegDeadline}</p>
                      <p><b>Regular Registration Deadline:</b> {this.state.competition.RegularRegDeadline}</p>
                      <p><b>Regular Registration Deadline:</b> {this.state.competition.RegularRegDeadline}</p>
                    </div>)
    /* TODO: How to get numbe rof competitors in different styles?*/
    // var style_category={}
    // this.state.competitors.map(c => {
    //     return event.competitionId === this.competition_id
    // })

    var competitor_info = (<div className={styles.lines}>
                      <p><b>First Name:</b> {this.state.competitor.first_name}</p>
                      <p><b>Last Name:</b> {this.state.competitor.last_name}</p>
                      <p><b>Email:</b> {this.state.competitor.email}</p>
                      <p><b>Number:</b> {this.state.competitor.lead_number}</p>
                    </div>)
    
    var event_titles = (<div className={styles.lines}>
                          {this.state.competitor_events.sort(function (a, b){
                          return a.id - b.id}).map(event => {
                            return (<p key={event.Title}>{event.Title}</p>)
                          })}
                        </div>)
    return (
      <div className={styles.content}>
        <XSidebar />   
        <div className={styles.contentBody}>
          <div className={styles.title}>
            <p>{comp_name}</p>
          </div>
          <div className={styles.infoTable}>
            <div className={styles.infoBox}>
              <Box title={<div className={styles.titleContainer}><span>Competiton Info</span> 
                             
                          </div>} 
                   content={comp_info}/>
            </div>
            <div className={styles.infoBox}>
              <Box title={<div className={styles.titleContainer}><span>User Info</span> 
                              <button className={styles.editBtn} onClick={()=>{/*TODO*/}}> Edit</button>
                          </div>}
                    content={competitor_info}/>
            </div>
            <div className={styles.separator}>
            </div>

            <div className={styles.separator}></div>
             
              <Competitor_events events={this.state.competitor_events}/>
              <div className = {styles.addeditBtn}>
          <button className={styles.editBtn} onClick={()=>{/*TODO*/}}> Add/Edit Event</button>
        </div>
        <div className = {styles.editpayBtn}>
          <button className={styles.editBtn} onClick={()=>{/*TODO*/}}> Edit Payment Info</button>
        </div>
          </div>
                  
        </div>
      </div>

    ); 
  }
  else {
    return <div className={styles.content}>
            <XSidebar />
            </div>;
  }
 }
}

