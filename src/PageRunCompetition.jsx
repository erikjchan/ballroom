
import React from 'react'
import * as Table from 'reactabular-table';
import EventRunningInfo from './PageRunCompetition/event.jsx'
import lib from './common/lib.js'
import Page from './Page.jsx'

export default class RunCompetition extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      competition: lib.flat_loading_proxy,
      events: [],

      // Index of currently running event
      current_event: 2,

    }

    /** Take the competition ID from the URL (Router hands
    it to us; see the path for this Page on Router) and make
    sure it's an integer */
    try {this.competition_id = parseInt(this.props.params.competition_id)}
    catch (e) { alert('Invalid competition ID!') }
  }

  componentDidMount() {

    console.log('this', this)

    /* Call the API for competition info */
    fetch(`/api/competition/${this.competition_id}`)
      .then(response => response.json()) // parse the result
      .then(json => { 
        // update the state of our component
        this.setState({ competition : json })
      })
      // todo; setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(this.refs.page.errorNotif(
        `There was an error fetching the competition`))

    /* Call the API for competition info */
    fetch(`/api/competition/${this.competition_id}/events`)
      .then(response => response.json()) // parse the result
      .then(json => { 
        // update the state of our component
        this.setState({ events : json })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(this.refs.page.errorNotif(
        `There was an error fetching the events`))
  }

 render() {

  const columns = [
    {
      property: 'title',
      header: {
        label: 'Title',
        sortable: true,
        resizable: true
      }
    },
    {
      property: 'style',
      header: {
        label: 'Style',
        sortable: true,
        resizable: true
      }
    },
    {
      property: 'level',
      header: {
        label: 'Level',
        sortable: true,
        resizable: true
      }
    },
    {
      width: 200,
      cell: {
        formatters: [
          (value, {rowData}) => (
            <div>
              <input
                type="button"
                value="Click me"
                onClick={() => alert(`${JSON.stringify(rowData, null, 2)}`)}
              />
              <span
                className="remove"
                onClick={() => this.onRemove(rowData.Id)}
                style={{ marginLeft: '1em', cursor: 'pointer' }}
              >
                &#10007;
              </span>
            </div>
          )
        ]
      }
    }
  ]

  const current_event = this.state.events[this.state.current_event]
  console.log(current_event)

  return (<Page ref="page">

      <h1>Running competition: {this.state.competition.Name}</h1>
      <h2>Previously ran</h2>

      {/* Previous event table */}
      <Table.Provider
        className="pure-table pure-table-striped"
        columns={columns}>
        <Table.Header />
        <Table.Body rows={this.state.events || []} rowKey="id" />
      </Table.Provider>

      <button disabled>Enter Callbacks</button>

      <h2>Current Event</h2>
      <EventRunningInfo event={current_event} />

      <h2>Upcoming Events</h2>
      <Table.Provider
        className="pure-table pure-table-striped"
        columns={columns}>
        <Table.Header />
        <Table.Body rows={this.state.events} rowKey="id" />
      </Table.Provider>
      <a href="#">Edit schedule</a>

     </Page>
  )
 }
}







