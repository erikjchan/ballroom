/*
 * EDIT PROFILE
 *
 * This page allows users to change their user information across
 * multiple competitions
 */

import style from "./style.css"
import React from 'react'
import Page from './Page.jsx'
import lib from './common/lib'
import Box from './common/Box.jsx'

// editprofilze
export default class PageEditProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      competitor: lib.flat_loading_proxy,
      affiliations: [],
      loading: true,
    }
  }

  componentDidMount() {
    /* Call the API for competition info */
    this.props.api.get(`/api/competitors/${this.props.profile.competitor_id}`)
      .then(json => {
        // update the state of our component
        this.setState({
          competitor : json
        })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the
      // connection comes back
      .catch(err => { console.log(err)})

      this.props.api.get(`/api/affiliations`)
      .then(json => {
        // update the state of our component
        this.setState({
          affiliations : json
        })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the
      // connection comes back
      .catch(err => { console.log(err)})
  }

  handleChange (event) {
    var new_competitor = this.state.competitor;
    new_competitor[event.target.name] = event.target.value || null;
    console.log(new_competitor);
    this.setState({competitor: new_competitor});
  };

  saveChanges () {
      this.props.api.post("/api/update_competitor", this.state.competitor)
      .then(() => { window.location.reload() });
  }

  render() {
    return (
     <Page ref = "page" {...this.props}>
        <Box admin = {this.props.isAdmin} title = {"Edit Profile"}>
          <div className = {style.lines}>
          <br />
          <h5>First Name</h5>
          <div id = 'editProfileContainer'></div>
          <input
            type = 'text'
            name = 'firstname'
            value = {this.state.competitor.firstname}
            onChange = {this.handleChange.bind(this)}
            maxLength = {16} /><br/>
          <h5>Last Name</h5>
          <input
            type = 'text'
            name = 'lastname'
            value = {this.state.competitor.lastname}
            onChange = {this.handleChange.bind(this)} /><br/>
          <h5>Email address</h5>
          <input
            type = 'email'
            name = 'email'
            value = {this.state.competitor.email}
            disabled
            onChange = {this.handleChange.bind(this)} /><br/>
          <h5>Mailing Address</h5>
          <input
            type = 'text'
            name = "mailingaddress"
            value = {this.state.competitor.mailingaddress}
            onChange = {this.handleChange.bind(this)} />
          
          { !this.props.isAdmin &&
            <span>
              <h5>Affiliation</h5>
              <select name = "affiliationid"
                  value = {this.state.competitor.affiliationid || ''}
                  onChange = {this.handleChange.bind(this)}>
                  <option value = ''>Not Affiliated</option>
                  {
                    this.state.affiliations.map(item =>{
                      return (<option value = {item.id} key = {item.id}> {item.name} </option>);
                    })
                  }
              </select>
            </span>
          }
          <p><button className = {style.saveBtns} onClick = {this.saveChanges.bind(this)}>Save</button></p>
          </div>
        </Box>
      </Page>
    )
  }
}

