
import styles from "./style.css"
import React from 'react'
import AddEvent from './PageEventRegistration/addEvent.jsx'
import EventTable from './common/EventTable.jsx'
import Autocomplete from 'react-autocomplete'
import Page from './Page.jsx'
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';
import {Button, IconButton} from 'react-toolbox/lib/button';
import { Link } from 'react-router'
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

      value: '',
      loading: false,

      // Selected stuff
      level: null,
      style: null,
      event: null,
    }

    /** Take the competition ID from the URL (Router hands
    it to us; see the path for this Page on Router) and make
    sure it's an integer */
    try {this.competition_id = parseInt(this.props.params.competition_id)}
    catch (e) { alert('Invalid competition ID!') }
  }

  componentDidMount() {
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
    fetch(`http://localhost:8080/api/competitors/0/events`)
      .then(response => {
        return response.json()
      })
      .then(json => {
        console.log('JSON', json)
        this.setState({user_competition_events: json.splice(0,3)})
      })
      .catch(err => alert(err))

    /** Fetch competitors for partner search */
    fetch(`http://localhost:8080/api/competitors`)
      .then(response => {
        return response.json()
      })
      .then(json => {

        this.setState({competitors: json})
      })
      .catch(err => alert(err))
  }

  handleLevelChange = (level) => {
    this.setState({level});
  };

  handleStyleChange = (style) => {
    this.setState({style});
  };

  handleEventChange = (event) => {
    this.setState({event});
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

    return (

    <Page ref="page">

      <p>
        <h1>Event Registration</h1>

        <h2>Level</h2>
        <RadioGroup name='comic' value={this.state.level} onChange={this.handleLevelChange}>
          <RadioButton label='The Walking Dead' value='thewalkingdead'/>
          <RadioButton label='From Hell' value='fromhell' disabled/>
          <RadioButton label='V for a Vendetta' value='vvendetta'/>
          <RadioButton label='Watchmen' value='watchmen'/>
        </RadioGroup>

        <h2>Style</h2>
        <RadioGroup name='comic' value={this.state.style} onChange={this.handleStyleChange}>
          <RadioButton label='The Walking Dead' value='thewalkingdead'/>
          <RadioButton label='From Hell' value='fromhell' disabled/>
          <RadioButton label='V for a Vendetta' value='vvendetta'/>
          <RadioButton label='Watchmen' value='watchmen'/>
        </RadioGroup>

        <h2>Event</h2>
        <RadioGroup name='comic' value={this.state.event} onChange={this.handleEventChange}>
          <RadioButton label='The Walking Dead' value='thewalkingdead'/>
          <RadioButton label='From Hell' value='fromhell' disabled/>
          <RadioButton label='V for a Vendetta' value='vvendetta'/>
          <RadioButton label='Watchmen' value='watchmen'/>
        </RadioGroup>

        <h2>Partner's email</h2>
        <Autocomplete
          inputProps={{name: "US state", id: "states-autocomplete"}}
          ref="autocomplete"
          value={this.state.value}
          items={this.state.competitors}
          getItemValue={(item) => item.email}
          onSelect={(value, item) => {
            // set the menu to only the selected item
            this.setState({ value, competitors: [ item ] })
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
            >{item.first_name} {item.last_name} ({item.email})</div>
          )}
        />



      </p>

      <p><Link to="/competition/0/0/">Register!</Link></p>
      <hr />


        <h2>You're already registered to these:</h2>
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

     </Page>
   );
 }
}

