
import styles from "./style.css"
import React from 'react'
import AddEvent from './PageEventRegistration/addEvent.jsx'
import EventTable from './common/EventTable.jsx'
import Autocomplete from 'react-autocomplete'
import Page from './Page.jsx'
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';
import {Button, IconButton} from 'react-toolbox/lib/button';
import Box from './common/BoxAdmin.jsx'
import { Link } from 'react-router'
import connection from './common/connection'
/*


class RadioTest extends React.Component {
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
      competitor: [],

      value: '',
      loading: false,
      partner: null,

      // Selected stuff
      level: null,
      style: null,
      event: null,
      isLeading: null,
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
    /* Call the API for competitor info */
    fetch(`/api/competitors/${this.competitor_id}/competition/${this.competition_id}`)
      .then(response => { return response.json() }) // parse the result
      .then(json => { 
          // update the state of our component
          console.log("WE DOING STUFF")
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
    fetch(`/api/events`)
      .then(response => response.json())
      .then(json => json.filter(event => {
        console.log(event.competitionId, this.competition_id)
        return event.competitionId === this.competition_id
      }))
      .then(json => {
        this.setState({ competition_events : json})
      })
      .catch(err => alert(err))

    /** Fetch the events a user is already registered to */
    fetch(`/api/competitors/0/events`)
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
        console.log('JSON', json)
        this.setState({user_competition_events: json.splice(0,3)})
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

  handleLevelChange = (level) => {
    this.setState({
        level: level,
        style: null,
        event: null 
    });
  };

  handleStyleChange = (style) => {
    this.setState({
        style: style,
        event: null
    });
  };

  handleEventChange = (event) => {
    this.setState({event});
  };

  handleLeadChange = (isLeading) => {
      this.setState({isLeading});
  };

  registerEventHandler = () => {
      const { level, style, event, partner, isLeading, user_competition_events, competitor } = this.state;
      const button_enabled = (event != null) && (isLeading != null) && (partner != null)
      if (button_enabled) {
          console.log(isLeading);
          if (isLeading == 'Leading') {
              user_competition_events.push(
                  {level: level, style: style, title: event, round: '', leader: "You", follower: partner}
              );
          } else {
              user_competition_events.push(
                  {level: level, style: style, title: event, round: '', leader: partner, follower: "You"}
              );
          }

          this.setState({user_competition_events});
      } else {
          alert('Please finish selecting a event and your partner!');
      }
  };

  render() {
    const search_competitor = (list, query) => {
    if (query === '') return []
    return list.filter(comp => 
        comp.email.indexOf(query) != -1 ||
        comp.first_name.toLowerCase().indexOf(query.toLowerCase()) != -1 ||
        comp.last_name.toLowerCase().indexOf(query.toLowerCase()) != -1
      )
    }

    const show_style = this.state.level !== null
    const show_smooth = this.state.style == 'Smooth'
    const show_standard = this.state.style == 'Standard'
    const show_rhythm = this.state.style == 'Rhythm'
    const show_latin = this.state.style == 'Latin'
    const show_leading = this.state.event !== null

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

    <Page ref="page" {...this.props}>
      <h1>Register Competitor for Events: </h1>
        <Box 
        title = {<div>Register for New Event</div>}
        content={
        <div className={styles.lines}>
      { true && <span>
            <h2>Level</h2>
            <RadioGroup name='comic' value={this.state.level} onChange={this.handleLevelChange}>
              <RadioButton label='Newcomer' value='Newcomer'/>
              <RadioButton label='Bronze' value='Bronze'/>
              <RadioButton label='Silver' value='Silver'/>
              <RadioButton label='Gold' value='Gold'/>
              <RadioButton label='Open' value='Open'/>
            </RadioGroup>
            <br/>
          </span>
      } 

      { show_style && <span>
            <br/>
            <h2>Style</h2>
            <RadioGroup name='comic' value={this.state.style} onChange={this.handleStyleChange}>
              <RadioButton label='Smooth' value='Smooth'/>
              <RadioButton label='Standard' value='Standard'/>
              <RadioButton label='Rhythm' value='Rhythm'/>
              <RadioButton label='Latin' value='Latin'/>
            </RadioGroup>
            <br/>
          </span>
      }
      {<div>
          <br/>
      { show_smooth && <span>
            <h2>Event</h2>
            <RadioGroup name='comic' value={this.state.event} onChange={this.handleEventChange}>
              <RadioButton label={`${this.state.level} ${this.state.style} Waltz`} value='Waltz'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Tango`} value='Tango'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Foxtrot`} value='Foxtrot'/>
              <RadioButton label={`${this.state.level} ${this.state.style} V. Waltz`} value='V. Waltz'/>
            </RadioGroup>
          </span>
      }
      { show_standard && <span>
            <h2>Event</h2>
            <RadioGroup name='comic' value={this.state.event} onChange={this.handleEventChange}>
              <RadioButton label={`${this.state.level} ${this.state.style} Waltz`} value='Waltz'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Tango`} value='Tango'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Foxtrot`} value='Foxtrot'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Quickstep`} value='Quickstep'/>
            </RadioGroup>
          </span>
      }
      { show_rhythm && <span>
            <h2>Event</h2>
            <RadioGroup name='comic' value={this.state.event} onChange={this.handleEventChange}>
              <RadioButton label={`${this.state.level} ${this.state.style} Cha Cha`} value='Cha Cha'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Rhumba`} value='Rhumba'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Swing`} value='Swing'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Mambo`} value='Mambo'/>
            </RadioGroup>
          </span>
      }
      { show_latin && <span>
            <h2>Event</h2>
            <RadioGroup name='comic' value={this.state.event} onChange={this.handleEventChange}>
              <RadioButton label={`${this.state.level} ${this.state.style} Cha Cha`} value='Cha Cha'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Rhumba`} value='Rhumba'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Jive`} value='Jive'/>
              <RadioButton label={`${this.state.level} ${this.state.style} Samba`} value='Samba'/>
            </RadioGroup>
          </span>
      }
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
            this.setState({ value, competitors: [ item ], partner: item.first_name + " " + item.last_name })
            // or you could reset it to a default list again
            // this.setState({ unitedStates: getStates() })
      }}
          onChange={(event, value) => {
            this.setState({ value, loading: true })

            fetch(`/localhost:8080/api/competitors`)
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
            >{item.first_name} {item.last_name} ({item.email})</div>
          )}
        />
      <p><button onClick={this.registerEventHandler} className={styles.registerBtn}>Register!</button></p>
              </div>
        }/>

      <Box title={<div>Competitor is already registered to these:</div>}
      content = {
        <EventTable
          events={this.state.user_competition_events}
          extra_columns={[{
            content: (value, {rowData}) => (
              <div>
                <span
                  onClick={() => alert(`should remove: ${JSON.stringify(rowData, null, 2)}`)}
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


