
import styles from "./style.css"
import React from 'react'
import AddEvent from './PageEventRegistration/addEvent.jsx'
import EventTable from './common/EventTable.jsx'
import Autocomplete from 'react-autocomplete'
import Page from './Page.jsx'
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';
import {Button, IconButton} from 'react-toolbox/lib/button';
import Box from './common/Box.jsx'
import { Link } from 'react-router'

/*


export default class RadioTest extends React.Component {
  state = {
    value: 'vvendetta'
  };

  handleChange = (value) => {
    this.setState({value});
  };

  render () {
    return (
      
    );
  }
}

 */

// competition/:competition_id/eventregistration
export default class PageEventRegistration extends React.Component {


  constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      competition: null,
      competition_events: [],
      user_competition_events: [],
      competitors: [],
      levels: [],
      level_styles: [],
      level_style_events: [],

      value: '',
      loading: false,
      partner: null,

      // Selected stuff
      levelid: null,
      styleid: null,
      eventid: null,
      isLeading: null,
    }

    /** Take the competition ID from the URL (Router hands
    it to us; see the path for this Page on Router) and make
    sure it's an integer */
    try {
      this.competition_id = parseInt(this.props.params.competition_id)
      this.competitor_id = 1 /** Hard coded TODO */
    }
    catch (e) { alert('Invalid competition ID!') }
  }
  componentDidMount(){
    /* Call the API for competition data */
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

    /** Pretty similar to above! */
    fetch(`/api/competition/${this.competition_id}/events`)
      .then(response => response.json())
      .then(json => {
        this.setState({ competition_events : json})
      })
      .catch(err => alert(err))

  fetch(`/api/competitors/${this.competitor_id}/${this.competition_id}/events`)
      .then(response => {
        return response.json()
      })
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
        this.setState({user_competition_events: json})
      })
      .catch(err => { alert(err); console.log(err)})

    /** Fetch levels in a competition */
    fetch(`/api/competition/${this.competition_id}/levels`)
      .then(response => {
        return response.json()
      })
      .then(json => {

        this.setState({levels: json})
      })
      .catch(err => alert(err))

    /** Fetch competitors for partner search */
    fetch(`/api/competitors`)
      .then(response => {
        return response.json()
      })
      .then(json => {

        this.setState({competitors: json})
      })
      .catch(err => alert(err))
  }

  handleLevelChange = (levelid) => {
    fetch(`/api/competition/${this.competition_id}/level/${levelid}/styles`)
      .then(response => {
        return response.json()
      })
      .then(json => {
        this.setState({level_styles: json})
      })
      .catch(err => alert(err))
    this.setState({
        levelid: levelid,
        styleid: null,
        eventid: null 
    });
  };

  handleStyleChange = (styleid) => {
    fetch(`/api/competition/${this.competition_id}/level/${this.state.levelid}/style/${styleid}`)
      .then(response => {
        return response.json()
      })
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

  registerEventHandler = () => {
      const { levelid, styleid, eventid, partner, isLeading, user_competition_events } = this.state;
      const button_enabled = (eventid != null) && (isLeading != null) && (partner != null)
      if (button_enabled) {
          console.log(isLeading);
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
        alert(`should remove: ${JSON.stringify(rowData, null, 2)}`)
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


    return (

    <Page ref="page" auth={{ profile: this.props.profile, isAuthenticated: this.props.isAuthenticated }}>
      <h1>Event Registration</h1>
        <Box 
        title = {<div>Register for New Event</div>}
        content={
        <div className={styles.lines}>
        { true && <span>
            <h2>Level</h2>
            <RadioGroup name='comic' value={this.state.levelid} onChange={this.handleLevelChange}>
              {
                this.state.levels.map(item =>{
                  return (<RadioButton value={item.id} label={item.name}/>);
                })
              }
            </RadioGroup>
            <br/>
          </span>
        } 

        { show_style && <span>
            <br/>
            <h2>Style</h2>
            <RadioGroup name='comic' value={this.state.styleid} onChange={this.handleStyleChange}>
              {
                this.state.level_styles.map(item =>{
                  return (<RadioButton value={item.id} label={item.name}/>);
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
            <RadioGroup name='comic' value={this.state.eventid} onChange={this.handleEventChange}>
              {
                this.state.level_style_events.map(item =>{
                  return (<RadioButton value={item.id} label={`${item.levelname} ${item.stylename} ${item.dance}`}/>);
                })
              }
              {/*<RadioButton label={`${this.state.level} ${this.state.style} Waltz`} value='Waltz'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Tango`} value='Tango'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Foxtrot`} value='Foxtrot'/>
              <RadioButton label={`${this.state.level} ${this.state.style} V. Waltz`} value='V. Waltz'/>*/}
            </RadioGroup>
          </span>
        }
        {/*{ show_standard && <span>
            <h2>Event</h2>
            <RadioGroup name='comic' value={this.state.event} onChange={this.handleEventChange}>
              <RadioButton label={`${this.state.level} ${this.state.style} Waltz`} value='Waltz'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Tango`} value='Tango'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Foxtrot`} value='Foxtrot'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Quickstep`} value='Quickstep'/>
            </RadioGroup>
          </span>
        }*/}
        {/*{ show_rhythm && <span>
            <h2>Event</h2>
            <RadioGroup name='comic' value={this.state.event} onChange={this.handleEventChange}>
              <RadioButton label={`${this.state.level} ${this.state.style} Cha Cha`} value='Cha Cha'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Rhumba`} value='Rhumba'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Swing`} value='Swing'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Mambo`} value='Mambo'/>
            </RadioGroup>
          </span>
        }*/}
        {/*{ show_latin && <span>
            <h2>Event</h2>
            <RadioGroup name='comic' value={this.state.event} onChange={this.handleEventChange}>
              <RadioButton label={`${this.state.level} ${this.state.style} Cha Cha`} value='Cha Cha'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Rhumba`} value='Rhumba'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Jive`} value='Jive'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Samba`} value='Samba'/>
            </RadioGroup>
          </span>
              }*/}
          <br/>
        </div>}

              { show_leading && <span>
                 <br/>
            <h3>Are you leading or following?</h3>
            <RadioGroup name='comic' value={this.state.isLeading} onChange={this.handleLeadChange}>
              <RadioButton label='Leading' value='Leading'/>
              <RadioButton label='Following' value='Following'/>
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

            fetch(`http://localhost:8080/api/competitors`)
              .then(response => response.json())
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
      <p><button onClick={this.registerEventHandler} className={styles.registerBtn}>Register!</button></p>
              </div>
        }/>

      <Box title={<div>You're already registered to these:</div>}
      content = {
        <EventTable
          events={this.state.user_competition_events}
          extra_columns={[{
            content: (value, {rowData}) => (
              <div>
                <span
                  onClick={()=>this.dropEventHandler(rowData)}
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

