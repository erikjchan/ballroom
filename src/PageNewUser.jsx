import React from 'react'
import Page from './Page.jsx'
import lib from './common/lib'
import Box from './common/Box.jsx'
import style from './style.css';
import API from './common/api'

export default class PageNewUser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      competitor: {}
    }

    this.api = new API(this.props.profile)
  }

  /** Updates state to reflect form change */
  handleChange (name, value) {
    this.setState({...this.state, [name]: value});
  };

  /** Saves profile information */
  saveChanges () {
    return false
    this.api.post('TODO', this.state.competitor)
  }

  render() {
    return (
      <Page ref="page" {...this.props}>
        <h1>Welcome!</h1>
        <h3>Lets get you started with a profile</h3>

        <h5>First Name</h5>
        <input
          type='text'
          name='first_name'
          value={this.state.competitor.first_name}
          onChange={this.handleChange.bind(this, 'first_name')}
          maxLength={16} /><br/>
        <h5>Last Name</h5>
        <input
          type='text'
          name='last_name'
          value={this.state.competitor.last_name}
          onChange={this.handleChange.bind(this, 'last_name')} /><br/>
        <h5>Email address</h5>
        <input
          type='email'
          disabled
          value={this.props.profile.email}/><br/>
        <h5>Organization</h5>
        <input
          type='email'
          disabled
          value={"TODO"}/><br/>
        <h5>Mailing Address</h5>
        <input
          type='text'
          value={this.state.competitor.mailing_address}
          onChange={this.handleChange.bind(this, 'mailing_address')} />
        <p><button onClick={this.saveChanges.bind(this)}>Save</button></p>
      </Page>
    )
  }
}
