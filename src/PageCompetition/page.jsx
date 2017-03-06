
import styles from "./style.css"
import React from 'react'
import XSidebar from '../common/XSidebar.jsx'

export default class PageCompetition extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      competition: null,
      competition_events: null,
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

  }

  render() {

    let competition_display = (!this.state.competition) 
      ? <b> Loading ... </b>
      : <pre> {JSON.stringify(this.state.competition)} </pre>

    let events_table = (!this.state.competition_events)
      ? <b> Loading ... </b>
      : <pre> {JSON.stringify(this.state.competition_events)} </pre>

    return (
      <div className={styles.content}>
        <h1>Competition id {this.props.params.competition_id}!</h1>
        { competition_display }
        { events_table }
        <p className={styles.welcomeText}>Thanks for joining!</p>
      </div>
    );
  }

}


