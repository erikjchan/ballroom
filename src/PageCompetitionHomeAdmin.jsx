/* 
 * COMPETITION HOME PAGE (ADMIN)
 *
 * This page is the main hub for admins to see information about the
 * competitions that they have created and selected.
 */

import style from "./style.css"
import React from 'react'
import XSidebar from './common/XSidebar.jsx'
import Box from './common/Box.jsx'
import Page from './Page.jsx'
import Autocomplete from 'react-autocomplete'
import { browserHistory } from 'react-router';

// admin/competition/:competition_id
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
      officials: [],
      expanded: null,
      boxes: {},
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
        this.competition = json;
        const startdate          = new Date(this.competition.startdate);
        const enddate            = new Date(this.competition.enddate);
        const regstartdate       = new Date(this.competition.regstartdate);
        const earlyregdeadline   = new Date(this.competition.earlyregdeadline);
        const regularregdeadline = new Date(this.competition.regularregdeadline);
        const lateregdeadline    = new Date(this.competition.lateregdeadline);
        this.competition.startdate = startdate.toDateString();
        this.competition.enddate = enddate.toDateString();
        this.competition.regstartdate = regstartdate.toDateString();
        this.competition.earlyregdeadline = earlyregdeadline.toDateString();
        this.competition.regularregdeadline = regularregdeadline.toDateString();
        this.competition.lateregdeadline = lateregdeadline.toDateString();
        
        // update the state of our component
        this.setState({ competition : json })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back


    /**  Call the API for event schedule  */
      .then(() => this.props.api.get(`/api/competition/${this.competition_id}/events`))
      .then(json => this.setState({ competition_events : json}))

    /**  Call the API for round schedule  */
      .then(() => this.props.api.get(`/api/competition/${this.competition_id}/rounds`))
      .then(json => this.setState({ competition_rounds : json}))


    /** Get competitors  */
      .then(() => this.props.api.get(`/api/competition/${this.competition_id}/competitors`))
      .then(json => this.setState({competitors: json}))

    /** Get partnerships */
      .then(() => this.props.api.get(`/api/competition/${this.competition_id}/competitors_styles`))
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


    /** Get officials */
      .then(() => this.props.api.get(`/api/competition/${this.competition_id}/officials`))
      .then(json => this.setState({officials: json}))

    /** Get organizations */
      .then(() => this.props.api.get(`/api/competition/${this.competition_id}/affiliations`))
      .then(json => {this.setState({organizations: json})})
      .catch(err => alert(err))
  }

  populate(box_name, lines_react, max_line_num, link){
    var ext;
    if (max_line_num < lines_react.length) {
      ext = (
        <p><a href="#" onClick={()=> {this.setState({expanded: box_name})}}>View More </a></p>
      )
    }
    var c = (
      <div className={style.lines}>
              {lines_react.slice(0, max_line_num)}
              {ext}
      </div>
    );

    return <div className={style.infoBox}>
      <Box admin={true} title={<div className={style.titleContainer}><span>{box_name}</span> 
                        <button className={style.editBtn} onClick={()=>{
                            window.location.href = link;
                          }}> Edit</button>
                    </div>}>
        {c}
      </Box>
    </div>
  }

populate_expanded(box_name, lines_react, link){
    return <div className={style.infoBoxExpanded}>
      <Box admin={true} title={
        <div className={style.titleContainer}>
          <button className={style.returnBtn} 
                  onClick={()=>{this.setState({expanded: null})}}> {"Back"} </button>
          <span>{box_name}</span> 
          <button className={style.editBtn} onClick={()=>{
            window.location.href = link;
            }}> Edit</button>
        </div>}>
        <div className={style.lines}>{lines_react} </div>
      </Box>
    </div>
 }

 render() {
   if (this.state.competition){

    var dict = {}

    var links = {}

    var comp_name = this.state.competition.name;

    dict['Competition Info'] = [
                      <p key={0}><b>Date:</b> {this.state.competition.startdate} - {this.state.competition.enddate}</p>,
                      <p key={1}><b>Location:</b> {this.state.competition.locationname}</p>,
                      <p key={2}><b>Registration Start Date:</b> {this.state.competition.regstartdate}</p>,
                      <p key={3}><b>Early Registration Deadline:</b> {this.state.competition.earlyregdeadline} (${this.state.competition.earlyprice})</p>,
                      <p key={4}><b>Regular Registration Deadline:</b> {this.state.competition.regularregdeadline} (${this.state.competition.regularprice})</p>,
                      <p key={5}><b>Late Registration Deadline:</b> {this.state.competition.lateregdeadline} (${this.state.competition.lateprice})</p>
                    ]
    links["Competition Info"] = "/editcompetition/" + this.competition_id;

    var competitor_stats = this.state.style_statistics.map(
        (item) => {
          return <p><b>{item.name+": "}</b> {item.count}</p>
        }
    );

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
        className = {style.searchBtn}
        onClick={() => {
                        browserHistory.push({
                          pathname: "/competition/"+this.competition_id+"/competitorslist",
                          state: {query: {name: this.state.keyword}}
                        }); 
                        }}
        > Search </button>
      </div>].concat(competitor_stats);
    links["Competitors"] = "/competition/"+this.competition_id+"/competitorslist";

    dict['Events'] = this.state.competition_events.map(event => {
                            var title = event.stylename+" "+event.levelname+" "+event.dance
                            return (<p key={title+" "+event.ordernumber}>{title}</p>)
                          })
    links["Events"] = "/competition/"+this.competition_id+"/editevents";

    var total_officials = this.state.officials.length;

    dict['Officials'] = [<p><b>Total Officials:</b> {total_officials}</p>].concat(
                          this.state.officials.map(official => {
                            var name = official.firstname + " " + official.lastname;
                            return (<p key={official.id}>{name} ({official.rolename})</p>)
                          }))
    links["Officials"] = "/editofficials/" + this.competition_id;

    var total_orgs = this.state.organizations.length;

    dict['Organizations'] = [<p><b>Total Organizations:</b> {total_orgs}</p>].concat(
                          this.state.organizations.map(org => {
                            return (<p key={org.affiliationname}>{org.affiliationname}</p>)
                          }))
    links["Organizations"] = "/organizationpayment/" + this.competition_id + "/0";

    var total_rounds = this.state.competition_rounds.length;

    dict['Schedule'] = [<p><b>Total Rounds:</b> {total_rounds}</p>].concat(
                          this.state.competition_rounds
                            .map((round,i) => {

                              return (<p key={round.id + " "+ i}><b>{(i+1)+": "}</b>{round.stylename+" "+round.levelname+" "+round.dance+" "+round.round}</p>)
                          }))
    links["Schedule"] = "/competition/"+this.competition_id+"/editschedule";

    if (this.state.expanded!=null){
        return (
          <Page ref="page" {...this.props}>
            <div className={style.title}>
              <p>{comp_name}</p>
            </div>
            <div className={style.infoTable}>
              {this.populate_expanded(this.state.expanded, dict[this.state.expanded], links[this.state.expanded])}
            </div>
          </Page>);
    }
    var num = 6
    return (
      <Page ref="page" {...this.props}>
          <h1>{comp_name}</h1>
          <div className={style.infoTable}>
             {this.populate("Competition Info", dict["Competition Info"], num, links["Competition Info"])}
              {this.populate("Officials", dict["Officials"], num, links["Officials"])}
          <div className={style.separator}></div>
            {this.populate("Events", dict["Events"], num, links["Events"])}
            {this.populate("Schedule", dict["Schedule"], num, links["Schedule"])}
          <div className={style.separator}></div>
             {this.populate("Competitors", dict["Competitors"], num, links["Competitors"])}
             {this.populate("Organizations", dict["Organizations"], num, links["Organizations"])}
          <div className={style.separator}></div>
          </div>

                    <div className = {style.clear}>
          <div id={style.createContainer}>
            <div id={style.saveChanges} 
              onClick={
                () => {window.location.href = "/competition/"+this.competition_id+"/run"}}>Run Competition
            </div>
          </div>
          </div>
      </Page>
    ); 
  }
  else {
    return <Page ref="page" {...this.props} />
  }
 }
}
