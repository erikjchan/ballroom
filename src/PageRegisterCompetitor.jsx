/* 
 * REGISTER COMPETITOR
 *
 * This page allows admins to register a competitor for events 
 * in their competition.
 */

import style from "./style.css"
import React from 'react'
import EventTable from './common/EventTable.jsx'
import Autocomplete from 'react-autocomplete'
import Page from './Page.jsx'
import { RadioGroup, Radio } from 'react-radio-group'
import Box from './common/Box.jsx'
import { Link } from 'react-router'
import connection from './common/connection'
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';

// competition/:competition_id/regcompetitor/:competitor_id
class PageEventRegistration extends React.Component {


  constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      competition: null,
      competition_events: [],
      user_competition_events: [],
      competitors: [],
      competitor: null,
      levels: [],
      level_styles: [],
      level_style_events: [],

      value: '',
      loading: false,
      partner: null,

      // // Selected stuff
      // level: null,
      // style: null,
      // event: null,
      // isLeading: null,

      // Selected stuff
      levelid: null,
      styleid: null,
      eventid: null,
      isLeading: null,
    }

    /** Take the competition ID from the URL (Router hands
    it to us; see the path for this Page on Router) and make
    sure it's an integer */
    try {this.competition_id = this.props.params.competition_id}
    catch (e) { alert('Invalid competition ID!') }
    try{this.competitor_id = this.props.params.competitor_id}
    catch (e) {alert('Invalid competitor ID!') }
  }

    componentDidMount() {
    
        this.props.api.get(`/api/competitors/${this.competitor_id}`)
          .then(json => {
              this.setState({competitor: json})
              console.log(this.state.competitor)
          })
          .catch(err => { alert(err); console.log(err)})

    /* Call the API for competition data */
    this.props.api.get(`/api/competition/${this.competition_id}`)
      .then(json => { 
        // update the state of our component
          this.setState({ competition : json })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(err => alert(err))

    /** Pretty similar to above! */
    this.props.api.get(`/api/competition/${this.competition_id}/events`)
      .then(json => {
        this.setState({ competition_events : json})
      })
      .catch(err => alert(err))

    this.props.api.get(`/api/competitors/${this.competitor_id}/${this.competition_id}/events`)
      .then(json => {
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
        this.setState({user_competition_events: json})
      })
      .catch(err => { alert(err); console.log(err)})

    /** Fetch levels in a competition */
    this.props.api.get(`/api/competition/${this.competition_id}/levels`)
      .then(json => {

        this.setState({levels: json})
      })
      .catch(err => alert(err))

    /** Fetch competitors for partner search */
    this.props.api.get(`/api/competitors`)
      .then(json => {
        this.setState({competitors: json})
      })
      .catch(err => alert(err))
  }

  handleLevelChange = (levelid) => {
    this.props.api.get(`/api/competition/${this.competition_id}/level/${levelid}/styles`)
      .then(json => {
        this.setState({level_styles: json})
      })
      .catch(err => alert(err))
    this.setState({
        levelid: levelid,
        eventid: null 
    });
  };

  handleStyleChange = (styleid) => {
    this.props.api.get(`/api/competition/${this.competition_id}/level/${this.state.levelid}/style/${styleid}`)
      .then(json => {
        this.setState({level_style_events: json})
      })
      .catch(err => alert(err))
    this.setState({
        styleid: styleid,
        eventid: null
    });
  };

  handleEventChange = (eventid) => {
    this.setState({
      eventid: eventid
    });
  };

  handleLeadChange = (isLeading) => {
      this.setState({isLeading});
  };

  checkIfNotExists = (reg) => {
      const { eventid } = this.state;
      return (reg["eventid"] != eventid);
  };

  registerEventHandler = () => {
      const { levelid, styleid, eventid, partner, isLeading, user_competition_events } = this.state;
      const button_enabled = (eventid != null) && (isLeading != null) && (partner != null)
      if (button_enabled) {
          if (!user_competition_events.every(this.checkIfNotExists)) {
              alert('You are already registered for this event!');
              return false
          }
          var leadcompetitorid = partner;
          var followcompetitorid = this.competitor_id;
          if (isLeading == 'Leading') {
            leadcompetitorid = this.competitor_id;
            followcompetitorid = partner;
          }
            fetch("/api/create_partnership", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    leadcompetitorid: leadcompetitorid,
                    followcompetitorid: followcompetitorid,
                    eventid: eventid,
                    competitionid: this.competition_id
                })
            }).then(() => {
                window.location.reload();
            });
      } else {
          alert('Please finish selecting a event and your partner!');
      }
  };

  dropEventHandler = (rowData) => {
      const eventName = rowData.level + " " + rowData.style + " " + rowData.dance;
        if (!confirm("Are you sure you want to drop " + eventName + "?")) {
            return false;
        }
        fetch("/api/delete_partnership", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                leadcompetitorid: rowData.leadcompetitorid,
                followcompetitorid: rowData.followcompetitorid,
                eventid: rowData.eventid
            })
        }).then(() => {
            window.location.reload();
        });
  };

  render() {
    const search_competitor = (list, query) => {
    if (query === '') return []
    return list.filter(comp => 
        comp.email.indexOf(query) != -1 ||
        comp.firstname.toLowerCase().indexOf(query.toLowerCase()) != -1 ||
        comp.lastname.toLowerCase().indexOf(query.toLowerCase()) != -1
      )
    }

    const show_style = this.state.levelid !== null
    const show_event = this.state.styleid !== null
    const show_leading = this.state.eventid !== null

    const myMenuStyle = {
      borderRadius: '3px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '2px 0',
      fontSize: '90%',
      overflow: 'auto',
      maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
      zIndex: 200
    };

    if (this.state.competitor) {
      var competitor = this.state.competitor;
      var competitor_name = competitor.firstname + " " + competitor.lastname    ;
    }

    return (

    <Page ref="page" {...this.props}>
      <h1>Register {competitor_name} for Events</h1>
        <Box admin={true} 
        title = {<div>Select Event</div>}
        content={
        <div className={style.lines}>
        
        { true && <span>
            <h2>Level</h2>
            <RadioGroup name='level' selectedValue={this.state.levelid} onChange={this.handleLevelChange}>
              {
                this.state.levels.map(item =>{
                  return (<div><Radio value={item.id}/>{item.name}</div>);
                })
              }
            </RadioGroup>
            <br/>
          </span>
        } 

        { show_style && <span>
            <br/>
            <h2>Style</h2>
            <RadioGroup name='style' selectedValue={this.state.styleid} onChange={this.handleStyleChange}>
              {
                this.state.level_styles.map(item =>{
                  return (<div><Radio value={item.id}/>{item.name}</div>);
                })
              }
            </RadioGroup>
            <br/>
          </span>
        }
        {<div>
          <br/>
        { show_event && <span>
            <h2>Event</h2>
            <RadioGroup name='event' selectedValue={this.state.eventid} onChange={this.handleEventChange}>
              {
                this.state.level_style_events.map(item =>{
                  return (<div><Radio value={item.id}/>{`${item.levelname} ${item.stylename} ${item.dance}`}</div>);
                })
              }
            </RadioGroup>
          </span>
        }
          <br/>
        </div>}
              { show_leading && <span>
                 <br/>
            <h3>Are you leading or following?</h3>
            <RadioGroup name='lead' selectedValue={this.state.isLeading} onChange={this.handleLeadChange}>
              <div><Radio value='Leading'/>Leading</div>
              <div><Radio value='Following'/>Following</div>
            </RadioGroup>
            <br/>
          </span>
              }

        <br/>
        <hr />
        <h2>Partner's email</h2>

        <Autocomplete
          menuStyle={myMenuStyle}
          inputProps={{name: "US state", id: "states-autocomplete"}}
          ref="autocomplete"
          value={this.state.value}
          items={this.state.competitors}
          getItemValue={(item) => item.email}
          onSelect={(value, item) => {
            // set the menu to only the selected item
            this.setState({ value, competitors: [ item ], partner: item.id })
            // or you could reset it to a default list again
            // this.setState({ unitedStates: getStates() })
      }}
          onChange={(event, value) => {
            this.setState({ value, loading: true })

            this.props.api.get(`/api/competitors`)
              .then(json => {
                  json = search_competitor(json, value)
                  this.setState({competitors: json, loading: false})
              })
              .catch(err => alert(err))
      }}
          renderItem={(item, isHighlighted) => (
            <div
              key={item.abbr}
              id={item.abbr}
            >{item.firstname} {item.lastname} ({item.email})</div>
          )}
        />
      <p><button onClick={this.registerEventHandler} className={style.registerBtn}>Register</button></p>
              </div>
        }/>

      <Box admin={true} title={<div>{competitor_name}'s Current Registrations</div>}
      content = {
        <EventTable
          events={this.state.user_competition_events}
          extra_columns={[{
            content: (value, {rowData}) => (
              <div>
                <span
                  onClick={() => this.dropEventHandler(rowData)}
                  style={{ marginLeft: '1em', cursor: 'pointer' }}
                >
                  &#10007; Drop
                </span>
              </div>
            )
          }]}
        />
      }
      />
     </Page>
   );
 }
}

export default connection(PageEventRegistration)


