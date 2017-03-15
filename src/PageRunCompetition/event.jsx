import React from 'react'

/**
 * Displays information about the currently running event
 */
export default class EventRunningInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      rounds: []
    }
  }

  componentDidMount() {
  	if (!this.props.event) return;
    fetch(`/api/event/${this.props.event.id}/rounds`)
      .then(response => response.json()) // parse the result
      .then(json => { 
        this.setState({ rounds : json })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(err => {alert(err); console.error(err)})
  }

  render () {

  	if (!this.props.event) return <div>Invalid event</div>

  	const rounds = this.state.rounds
  	.sort((a,b) => a.order_number - b.order_number)
  	.map(r => `
  		Round name: ${r.name}
  		Size: ${r.size}
  	`)

  	return (
  		<pre>
  		{this.props.event.title}
  		{this.props.event.style}

  		{rounds}
  		</pre>
  	)
  }

}