import styles from "./style.css"
import React from 'react'
import Page from './Page.jsx'
import Input from 'react-toolbox/lib/input';
import lib from './common/lib'
import Box from './common/BoxAdmin.jsx'
import style from './style.css';
import connection from './common/connection'


class PageEditProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      competitor: lib.flat_loading_proxy,
    }
  }

  componentDidMount() {
    /* Call the API for competition info */
    fetch(`/api/competitors/${0}`)
      .then(response => response.json()) // parse the result
      .then(json => { 
        // update the state of our component
        this.setState({ competitor : json })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(err => { alert(err); console.log(err)})
  }

  handleChange (name, value) {
    this.setState({...this.state, [name]: value});
  };

  saveChanges () { lib.post('/api/post/competitor', this.state) } // todo


  render() {
    return (

     <Page ref="page" >
              <Box title={"Edit profile"}
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

export default connection(PageEditProfile)

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


