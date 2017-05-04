
import styles from "./style.css"
import React from 'react'
import XSidebar from './common/XSidebar.jsx'
import Box from './common/BoxAdmin.jsx'
import Page from './Page.jsx'
import Autocomplete from 'react-autocomplete'
import { browserHistory } from 'react-router';

export default class PageCompetitionHomeAdmin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      competition: null,
      competition_events: [],
      competition_rounds: [],
      competitors: [],
      searched_competitors: [],
      keyword: "",
      style_statistics: [],
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
    fetch(`/api/competition/${this.competition_id}/events`)
      .then(response => response.json())
      .then(json => {
        this.setState({ competition_events : json})
      })
      .catch(err => alert(err))

    /**  Call the API for round schedule  */
    fetch(`/api/competition/${this.competition_id}/rounds`)
      .then(response => response.json())
      .then(json => {
        this.setState({ competition_rounds : json})
        console.log(this.state.competition_rounds)
      })
      .catch(err => alert(err))


    /** Fetch competitors  
    */
    fetch(`/api/competition/${this.competition_id}/competitors`)
      .then(response => {
        return response.json()
      })
      .then(json => {
        this.setState({competitors: json})
      })
      .catch(err => alert(err))

    /** fetch partnerships */
    fetch(`/api/competition/${this.competition_id}/competitors_styles`)
      .then(response => {
        return response.json()
      })
      .then(json => {

        this.setState({style_statistics: json})

        // /** Filter registered competitors */
        // var all_competitors = this.state.partnerships.map(item => {
        //   return item.lead_competitor_id;
        // }).concat(
        //   this.state.partnerships.map(item2 => {
        //   return item2.follow_competitor_id;
        // }));

        // all_competitors = all_competitors.filter((v, i, a) => a.indexOf(v) === i); 
        // all_competitors = all_competitors.map(real_comp_id=>{
        //   var results = this.state.competitors.filter(comp=>
        //     {
        //       return comp.id == real_comp_id
        //     }
        //   )
        //   return results[0];
        // });
        // this.setState({registered_competitors: all_competitors})
      })
      .catch(err => alert(err))

    /** Fetch judges */
    fetch(`/api/competition/${this.competition_id}/judges`)
      .then(response => {
        return response.json()
      })
      .then(json => {
        this.setState({judges: json})
      })
      .catch(err => alert(err))

    /** Fetch organizations */
    fetch(`/api/competition/${this.competition_id}/affiliations`)
      .then(response => {
        return response.json()
      })
      .then(json => {

        this.setState({organizations: json})
      })
      .catch(err => alert(err))
  }

 populate(box_name, lines_react, max_line_num, link){
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
                      <button className={styles.editBtn} onClick={()=>{
                          window.location.href = link;
                        }}> Edit</button>
                  </div>}
      content={c}/>
    </div>
 }

populate_expanded(box_name, lines_react, link){
    return <div className={styles.infoBoxExpanded}>
      <Box title={<div className={styles.titleContainer}>
                      <button className={styles.returnBtn} 
                              onClick={()=>{this.setState({expanded: null})}}> {"Back"} </button>
                      <span>{box_name}</span> 
                      <button className={styles.editBtn} onClick={()=>{
                                                  window.location.href = link;
                                                  }}> Edit</button>
                  </div>}
      content={<div className={styles.lines}>
                  {lines_react} </div>}/>
    </div>
 }

 render() {
   if (this.state.competition){

    var dict = {}

    var links = {}

    var comp_name = this.state.competition.name;

    dict['Competiton Info'] = [
                      <p><b>Date:</b> {this.state.competition.startdate} - {this.state.competition.enddate}</p>,
                      <p><b>Location:</b> {this.state.competition.locationname}</p>,
                      <p><b>Registration Start Date:</b> {this.state.competition.regstartdate}</p>,
                      <p><b>Early Registration Deadline:</b> {this.state.competition.earlyregdeadline} (${this.state.competition.earlyprice})</p>,
                      <p><b>Regular Registration Deadline:</b> {this.state.competition.regularregdeadline} (${this.state.competition.regularprice})</p>,
                      <p><b>Late Registration Deadline:</b> {this.state.competition.lateregdeadline} (${this.state.competition.lateprice})</p>
                    ]
    links["Competiton Info"] = "/editcompetition/" + this.competition_id;
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
  
    // var buckets ={};
    // this.state.competition_events.forEach(function(element) {
    //   if (!(element.style in buckets)){
    //     buckets[element.style]=0;
    //   }
    //   this.state.partnerships.forEach(
    //     function(p) {
    //       if (p["Event Category"] == element.id){
    //         buckets[element.style] = buckets[element.style]+2;
    //       }
    //     }, this);
    // }, this);

    var competitor_stats = this.state.style_statistics.map(
        (item) => {
          return <p><b>{item.name+": "}</b> {item.count}</p>
        }
    );

    console.log(competitor_stats)

    const search_competitor = (list, query) => {
    if (query === '') return []
    return list.filter(comp => 
        comp.email.indexOf(query) != -1 ||
        comp.name.toLowerCase().indexOf(query.toLowerCase()) != -1
      )
    }
    const myMenuStyle = {
      borderRadius: '3px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '2px 0',
      fontSize: '90%',
      position: 'fixed',
      overflow: 'auto',
      maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
      zIndex: 200
    };

    dict['Competitors'] = [<p><b>Total Competitors:</b> {this.state.competitors.length}</p>,
    <div>
      <Autocomplete menuStyle={myMenuStyle}
          fullWidth = {true}
          ref="autocomplete"
          value={this.state.value}
          items={this.state.searched_competitors}
          getItemValue={(item) => item.name}
          onSelect={(value, item) => {
            // set the menu to only the selected item
            this.setState({ value, searched_competitors: [ item ] })
            this.setState({keyword: value})
            // or you could reset it to a default list again
            // this.setState({ unitedStates: getStates() })
              }}
          onChange={(event, value) => {
            this.setState({ value, loading: true })
            this.setState({keyword: value})
            var output = search_competitor(this.state.competitors, value)
            this.setState({searched_competitors: output, loading: false})
          }}
          renderItem={(item, isHighlighted) => (
            <div
              key={item.abbr}
              id={item.abbr}
            >{item.name} ({item.email})</div>
          )}
        />
        <button 
        className = {styles.searchBtn}
        onClick={() => {
                        browserHistory.push({ //browserHistory.push should also work here
                          pathname: "/competition/"+this.competition_id+"/competitorslist",
                          state: {query: {name: this.state.keyword}}
                        }); 
                        }}
        > Search </button>
      </div>].concat(competitor_stats);
    links["Competitors"] = "/competition/"+this.competition_id+"/competitorslist";

    /*var event_titles = (<div className={styles.lines}>
                          {this.state.competition_events.sort(function (a, b){
                          return a.id - b.id}).map(event => {
                            return (<p key={event.title}>{event.title}</p>)
                          })}
                        </div>)*/

    dict['Events'] = this.state.competition_events.map(event => {
                            var title = event.stylename+" "+event.levelname+" "+event.dance
                            return (<p key={title+" "+event.ordernumber}>{title}</p>)
                          })
    links["Events"] = "/competition/"+this.competition_id+"/editevents";

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
                            var name = judge.firstname+" "+judge.lastname
                            var email = "mailto:"+judge.email;
                            return (<p key={name}>{name} (<a href={email}>{judge.email}</a>) </p>)
                          }))
    links["Judges"] = "/editofficial/" + this.competition_id;

    var total_orgs = this.state.organizations.length;
    /*var org_names = (<div className={styles.lines}>
                          <p><b>Total Organizations:</b> {total_orgs}</p>
                          {this.state.organizations.map(org => {
                            return (<p key={org.name}>{org.name}</p>)
                          })}
                        </div>)*/

    dict['Organizations'] = [<p><b>Total Organizations:</b> {total_orgs}</p>].concat(
                          this.state.organizations.map(org => {
                            return (<p key={org.affiliationname}>{org.affiliationname}</p>)
                          }))
    links["Organizations"] = "";

    var total_rounds = this.state.competition_rounds.length;
    /*var rounds_titles = (<div className={styles.lines}>
                          <p><b>Total Rounds:</b> {total_rounds}</p>
                          {this.state.competition_rounds
                            .map(round => {
                            return (<p key={round.name}>{round.name}</p>)
                          })}
                        </div>)*/

    dict['Schedule'] = [<p><b>Total Rounds:</b> {total_rounds}</p>].concat(
                          this.state.competition_rounds
                            .map((round,i) => {
                            // var event_name = this.state.competition_events.filter(event=> {return event.id == round.eventid})
                            // if (event_name.length > 0){
                            //   event_name = event_name[0].title+" "
                            // }
                            // else{
                            //   event_name = ""
                            // }
                            /**TODO */
                              return (<p key={round.id + " "+ i}><b>{(i+1)+": "}</b>{round.stylename+" "+round.levelname+" "+round.dance+" "+round.round}</p>)
                          }))
    links["Schedule"] = "/competition/"+this.competition_id+"/editschedule";

    if (this.state.expanded!=null){
        return (
          <Page ref="page" auth={{ profile: this.props.profile, isAuthenticated: this.props.isAuthenticated }}>
            <div className={styles.title}>
              <p>{comp_name}</p>
            </div>
            <div className={styles.infoTable}>
              {this.populate_expanded(this.state.expanded, dict[this.state.expanded], links[this.state.expanded])}
            </div>
          </Page>);
    }
    var num = 6
    return (
      <Page ref="page" auth={{ profile: this.props.profile, isAuthenticated: this.props.isAuthenticated }}>
          <div className={styles.title}>
            <p>{comp_name}</p>
          </div>
          <div className={styles.infoTable}>
             {this.populate("Competiton Info", dict["Competiton Info"], num, links["Competiton Info"])}
              {this.populate("Judges", dict["Judges"], num, links["Judges"])}
            <div className={styles.separator}></div>
            {this.populate("Events", dict["Events"], num, links["Events"])}
            {this.populate("Schedule", dict["Schedule"], num, links["Schedule"])}
            <div className={styles.separator}></div>
             {this.populate("Competitors", dict["Competitors"], num, links["Competitors"])}
             {this.populate("Organizations", dict["Organizations"], num, links["Organizations"])}
            <div className={styles.separator}></div>
          </div>
          <button className={styles.runBtn} 
              onClick={() => {window.location.href = "/competition/"+this.competition_id+"/run";}}>Run Competition</button>
      </Page>
    ); 
  }
  else {
    return <Page ref="page" auth={{ profile: this.props.profile, isAuthenticated: this.props.isAuthenticated }} />
  }
 }
}
