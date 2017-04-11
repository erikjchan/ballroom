
import styles from "./style.css"
import React from 'react'
import XSidebar from './common/XSidebar.jsx'
import Box from './common/BoxAdmin.jsx'
import Page from './Page.jsx'

export default class PageCompetitionHomeAdmin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      competition: null,
      competition_events: [],
      competition_rounds: [],
      competitors: [],
      organizations: [],
      judges: [],
      expanded: null,
      boxes: {},
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
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(err => alert(err))

    /**  Call the API for event schedule  */
    fetch(`/api/events`)
      .then(response => response.json())
      .then(json => json.filter(event => {
        console.log(event.competition_id, this.competition_id)
        return event.competition_id === this.competition_id
      }))
      .then(json => {
        this.setState({ competition_events : json})
      })
      .catch(err => alert(err))

    /**  Call the API for round schedule  */
    fetch(`/api/rounds`)
      .then(response => response.json())
      .then(json => {
        this.setState({ competition_rounds : json})
        console.log(this.state.competition_rounds)
      })
      .catch(err => alert(err))


    /** Fetch competitors 
     * TODO: Currently fetch all competitors in database, but need to 
     * fetch competitors registered for this competition. 
    */
    fetch(`http://localhost:8080/api/competitors`)
      .then(response => {
        return response.json()
      })
      .then(json => {

        this.setState({competitors: json})
      })
      .catch(err => alert(err))

    /** Fetch judges */
    fetch(`http://localhost:8080/api/judges`)
      .then(response => {
        return response.json()
      })
      .then(json => {

        this.setState({judges: json})
      })
      .catch(err => alert(err))

    /** Fetch organizations */
    fetch(`http://localhost:8080/api/organizations`)
      .then(response => {
        return response.json()
      })
      .then(json => {

        this.setState({organizations: json})
      })
      .catch(err => alert(err))
  }

 populate(box_name, lines_react, max_line_num){
   var ext;
   if (max_line_num < lines_react.length){
     ext = (
       <p><a href="#" onClick={()=> {this.setState({expanded: box_name})}}>View More </a></p>
     )
   }
  var c = <div className={styles.lines}>
            {lines_react.slice(0, max_line_num)}
            {ext}
        </div>
    return <div className={styles.infoBox}>
      <Box title={<div className={styles.titleContainer}><span>{box_name}</span> 
                      <button className={styles.editBtn} onClick={()=>{/*TODO*/}}> Edit</button>
                  </div>}
      content={c}/>
    </div>
 }

populate_expanded(box_name, lines_react){
    return <div className={styles.infoBoxExpanded}>
      <Box title={<div className={styles.titleContainer}>
                      <button className={styles.returnBtn} 
                              onClick={()=>{this.setState({expanded: null})}}> {"Back"} </button>
                      <span>{box_name}</span> 
                      <button className={styles.editBtn} onClick={()=>{/*TODO*/}}> Edit</button>
                  </div>}
      content={<div className={styles.lines}>
                  {lines_react} </div>}/>
    </div>
 }

 render() {
   if (this.state.competition){

    var dict = {}

    var comp_name = this.state.competition.Name;

    dict['Competiton Info'] = [<p><b>Date:</b> {this.state.competition.StartDate} ~ {this.state.competition.EndDate}</p>,
                      <p><b>Location:</b> {this.state.competition.LocationName}</p>,
                      <p><b>Registration Start Date:</b> {this.state.competition.RegStartDate}</p>,
                      <p><b>Early Registration Deadline:</b> {this.state.competition.EarlyRegDeadline} (${this.state.competition.EarlyPrice})</p>,
                      <p><b>Regular Registration Deadline:</b> {this.state.competition.RegularRegDeadline} (${this.state.competition.RegPrice})</p>,
                      <p><b>Late Registration Deadline:</b> {this.state.competition.RegEndDate} (${this.state.competition.LatePrice})</p>,
                    ]
/*
    var comp_info = (<div className={styles.lines}>
                      <p><b>Date:</b> {this.state.competition.StartDate} ~ {this.state.competition.EndDate}</p>
                      <p><b>Location:</b> {this.state.competition.LocationName}</p>
                      <p><b>Registration Start Date:</b> {this.state.competition.RegStartDate}</p>
                      <p><b>Early Registration Deadline:</b> {this.state.competition.EarlyRegDeadline} (${this.state.competition.EarlyPrice})</p>
                      <p><b>Regular Registration Deadline:</b> {this.state.competition.RegularRegDeadline} (${this.state.competition.RegPrice})</p>
                      <p><b>Late Registration Deadline:</b> {this.state.competition.RegEndDate} (${this.state.competition.LatePrice})</p>
                    </div>)*/
    /* TODO: How to get numbe rof competitors in different styles?*/
    // var style_category={}
    // this.state.competitors.map(c => {
    //     return event.competitionId === this.competition_id
    // })
    // /*var competitors_info = (<div className={styles.lines}>
    //                   <p><b>Total Competitors:</b> {this.state.competitors.length}</p>
    //                 </div>)*/

    dict['Competitors'] = [<p><b>Total Competitors:</b> {this.state.competitors.length}</p>]
    
    /*var event_titles = (<div className={styles.lines}>
                          {this.state.competition_events.sort(function (a, b){
                          return a.id - b.id}).map(event => {
                            return (<p key={event.title}>{event.title}</p>)
                          })}
                        </div>)*/

    dict['Event Schedule'] = this.state.competition_events.sort(function (a, b){
                          return a.id - b.id}).map(event => {
                            return (<p key={event.title}>{event.title}</p>)
                          })

    var total_judges = this.state.judges.length;
    /*var judges_names = (<div className={styles.lines}>
                          <p><b>Total Judges:</b> {total_judges}</p>
                          {this.state.judges.map(judge => {
                            var name = judge['Last Name']+" "+judge['First Name']
                            var email = "mailto:"+judge['Email address'];
                            return (<p key={name}>{name} (<a href={email}>{judge['Email address']}</a>) </p>)
                          })}
                        </div>)*/

    dict['Judges'] = [<p><b>Total Judges:</b> {total_judges}</p>].concat(
                          this.state.judges.map(judge => {
                            var name = judge['Last Name']+" "+judge['First Name']
                            var email = "mailto:"+judge['Email address'];
                            return (<p key={name}>{name} (<a href={email}>{judge['Email address']}</a>) </p>)
                          }))
                          
    var total_orgs = this.state.organizations.length;
    /*var org_names = (<div className={styles.lines}>
                          <p><b>Total Organizations:</b> {total_orgs}</p>
                          {this.state.organizations.map(org => {
                            return (<p key={org.name}>{org.name}</p>)
                          })}
                        </div>)*/

    dict['Organizations'] = [<p><b>Total Organizations:</b> {total_orgs}</p>].concat(
                          this.state.organizations.map(org => {
                            return (<p key={org.id}>{org.name}</p>)
                          }))

    var total_rounds = this.state.competition_rounds.length;
    /*var rounds_titles = (<div className={styles.lines}>
                          <p><b>Total Rounds:</b> {total_rounds}</p>
                          {this.state.competition_rounds
                            .map(round => {
                            return (<p key={round.name}>{round.name}</p>)
                          })}
                        </div>)*/

    dict['Round Schedule'] = [<p><b>Total Rounds:</b> {total_rounds}</p>].concat(
                          this.state.competition_rounds
                            .sort(function (a, b){
                                  return a.order_number - b.order_number})
                            .map(round => {
                            var event_name = this.state.competition_events.filter(event => {return event.id == round.event})
                            if (event_name.length > 0){
                              event_name = event_name[0].title+" "
                            }
                            else{
                              event_name = ""
                            }
                              return (<p key={round.id}>{event_name+round.name}</p>)
                          }))
                        
    if (this.state.expanded!=null){
        return (
          <Page ref="page" isAdmin={true}>
            <div className={styles.title}>
              <p>{comp_name}</p>
            </div>
            <div className={styles.infoTable}>
              {this.populate_expanded(this.state.expanded, dict[this.state.expanded])}
            </div>
          </Page>);
    }
    var num = 6
    return (
      <Page ref="page" isAdmin={true}>
          <div className={styles.title}>
            <p>{comp_name}</p>
          </div>
          <div className={styles.infoTable}>
             {this.populate("Competiton Info", dict["Competiton Info"], num)}
             {this.populate("Competitors", dict["Competitors"], num)}
            <div className={styles.separator}></div>
            {this.populate("Event Schedule", dict["Event Schedule"], num)}
             {this.populate("Judges", dict["Judges"], num)}
            <div className={styles.separator}></div>
            {this.populate("Round Schedule", dict["Round Schedule"], num)}
             {this.populate("Organizations", dict["Organizations"], num)}
            <div className={styles.separator}></div>
          </div>
          <button className={styles.runBtn} 
              onClick={() => {/* TODO */}}>Run Competition</button>
      </Page>
    ); 
  }
  else {
    return <Page ref="page" />
  }
 }
}


