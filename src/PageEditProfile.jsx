/* 
 * EDIT PROFILE
 *
 * This page allows users to change their user information across
 * multiple competitions
 */

import styles from "./style.css"
import React from 'react'
import Page from './Page.jsx'
import Input from 'react-toolbox/lib/input';
import lib from './common/lib'
import Box from './common/Box.jsx'
import BoxAdmin from './common/BoxAdmin.jsx'
import style from './style.css';

// editprofile
export default class PageEditProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      competitor: lib.flat_loading_proxy,
      affiliations: lib.flat_loading_proxy,
      loading: true,
    }
  }

  componentDidMount() {
    /* Call the API for competition info */
    fetch(`/api/competitors/${1}`)
      .then(response => response.json()) // parse the result
      .then(json => { 
        // update the state of our component
        this.setState({ 
          competitor : json 
        })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(err => { alert(err); console.log(err)})
  }

  handleChange (event) {
    var new_competitor = this.state.competitor;
    new_competitor[event.target.name] = event.target.value;
    console.log(new_competitor);
    this.setState({competitor: new_competitor});
  };

  saveChanges () { 
      fetch("/api/update_competitor", {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.state.competitor)
      }).then(() => {
          window.location.reload();
      });  
  } 

  render() {
    console.log(this.state.competitor);
    const isAdmin = this.props.profile.role === 'admin'

    if (!isAdmin) {

    return (

     <Page ref="page" {...this.props}>
              <Box title={"Edit profile"}
      content={
        <div className={style.lines}>
        <br />
        <h5>First Name</h5>
        <div id='editProfileContainer'></div>
        <input
          type='text'
          name='firstname'
          value = {this.state.competitor.firstname}
          onChange={this.handleChange.bind(this)}
          maxLength={16} /><br/>
        <h5>Last Name</h5>
        <input
          type='text'
          name='lastname'
          value = {this.state.competitor.lastname}
          onChange={this.handleChange.bind(this)} /><br/>
        <h5>Email address</h5>
        <input 
          type='email' 
          name = 'email'
          value={this.state.competitor.email} 
          disabled
          onChange={this.handleChange.bind(this)} /><br/>
        <h5>Mailing Address</h5>
        <input 
          type='text' 
          name = "mailingaddress"
          value={this.state.competitor.mailingaddress} 
          onChange={this.handleChange.bind(this)} />
        <h5>Affiliation</h5>
        <input
          type = 'email' 
          name = 'affiliationid'
          value={this.state.competitor.affiliationname} 
          onChange={this.handleChange.bind(this)} /><br/>
        <p><button onClick={this.saveChanges.bind(this)}>Save</button></p>
        </div>
      } />
      </Page>
    );

    } else {
      return (

      <Page ref="page" {...this.props}>

      <BoxAdmin title={"Edit profile"}
        content={
        <div className={style.lines}>
        <br />
        <h5>First Name</h5>
        <div id='editProfileContainer'></div>
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
          value={this.state.competitor.email} 
          onChange={this.handleChange.bind(this, 'email')} /><br/>
        <h5>Mailing Address</h5>
        <input 
          type='text' 
          value={this.state.competitor.mailing_address} 
          onChange={this.handleChange.bind(this, 'mailing_address')} />
        <p><button onClick={this.saveChanges.bind(this)}>Save</button></p>
        </div>
      } />

      </Page>
    );
  }
  }
}


// const get_competitors = n => collection(n)(i => ({
//   "id" : i,
//   "first_name" : randomData(1).firstName,
//   "last_name" : randomData().lastName,
//   "email" :  randomData().emailAddress,
//   "mailing_address" : randomData().street,
//   "organization_id" : randomId(ORGANIZATIONS),
//   "password" : uuidV1(),
//   "registered" : randomBool(),
//   "lead_number" : randomInt(0, 100),
// }))


