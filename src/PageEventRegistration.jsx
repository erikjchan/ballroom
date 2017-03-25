
import styles from "./style.css"
import React from 'react'
import AddEvent from './PageEventRegistration/addEvent.jsx'
import EventTable from './common/EventTable.jsx'
import Autocomplete from 'react-autocomplete'
import Page from './Page.jsx'
import { Link } from 'react-router'


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
    }

    /** Take the competition ID from the URL (Router hands
    it to us; see the path for this Page on Router) and make
    sure it's an integer */
    try {this.competition_id = parseInt(this.props.params.competition_id)}
    catch (e) { alert('Invalid competition ID!') }
  }

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
    const show_event = this.state.style !== null

    return (

    <Page ref="page">

      <p>
        <h1>Event Registration</h1>
        <AddEvent />
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

