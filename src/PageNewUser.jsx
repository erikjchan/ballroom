import React from 'react'
import Page from './Page.jsx'
import lib from './common/lib'
import style from './style.css';
import { browserHistory } from 'react-router';

export default class PageNewUser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      competitor: { email: this.props.profile.email },
      organizations: []
    }
  }

  componentDidMount() {

      /** Get organizations */
      this.props.api.get(`/api/organizations`)
        .then(organizations => {
          const competitor = Object.assign({}, this.state.competitor, 
            { affiliationid: organizations[0].id }) // select first affiliation by default
          this.setState({ organizations, competitor })
        })

  }

  /** Updates state to reflect form change */
  handleCompetitorFormChange (name, event) {
    const new_competitor = Object.assign({}, this.state.competitor, {[name]: event.target.value})
    this.setState({competitor: new_competitor});
  };

  /** Saves profile information */
  createCompetitor () {
    // Form validation
    const { firstname, lastname, email, affiliationid, mailingaddress } = this.state.competitor
    if (!firstname || !lastname || !email || affiliationid === undefined || !mailingaddress) {
      return console.log('INVALID')
    }

    const obj = Object.assign({hasregistered:false}, 
        this.state.competitor, 
        { profile: this.props.profile})
    this.props.api.post('/api/create_competitor', obj)
      .then(competitor => {
        if (!competitor) return
        console.log(competitor.id)
        this.props.profile.app_metadata.competitor_id = competitor.id 
        browserHistory.push('/')
      })
  }

  render() {
    return (
      <Page ref="page" {...this.props}>
        <h1>Welcome!</h1>
        <h3>Lets get you started with a profile</h3>

        <h5>First Name</h5>
        <input
          type='text'
          name='firstname'
          value={this.state.competitor.firstname}
          onChange={this.handleCompetitorFormChange.bind(this, 'firstname')}
          maxLength={16} /><br/>
        <h5>Last Name</h5>
        <input
          type='text'
          name='lastname'
          value={this.state.competitor.lastname}
          onChange={this.handleCompetitorFormChange.bind(this, 'lastname')} /><br/>
        <h5>Email address</h5>
        <input
          type='email'
          disabled
          value={this.state.competitor.email}/><br/>
        <h5>Organization</h5>
        {/* TODO: DEFAULT VALUE */}
        <select
          name='affiliationid' 
          value={this.state.competitor.affiliationid} 
          onChange={this.handleCompetitorFormChange.bind(this, 'affiliationid')}>
          {this.state.organizations.map(org =>
            <option value={org.id} key={org.id}>{org.name}</option>
          )}
        </select>
        <h5>Mailing Address</h5>
        <input
          type='text'
          value={this.state.competitor.mailingaddress}
          onChange={this.handleCompetitorFormChange.bind(this, 'mailingaddress')} />
        <p><button onClick={this.createCompetitor.bind(this)}>Save</button></p>
      </Page>
    )
  }
}
