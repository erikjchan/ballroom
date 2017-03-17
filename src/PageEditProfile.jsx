import styles from "./style.css"
import React from 'react'
import Page from './Page.jsx'
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';


export default class PageEditProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      first_name: 'John',
      last_name: 'Smith',
      email: 'john@smith.com',
      mailing_address: '111 Dryden Road, Apt 6F, Ithaca NY',
      password: 'j8732ojklsdjf',
    }
  }

  handleChange = (name, value) => {
    this.setState({...this.state, [name]: value});
  };


  render() {
    return (
     <Page ref="page">
        <h1>Edit Profile</h1>
        <Input
          type='text'
          label='First Name'
          name='first_name'
          icon='circle'
          value={this.state.first_name}
          onChange={this.handleChange.bind(this, 'first_name')}
          maxLength={16} />
        <Input
          type='text'
          label='Last Name'
          name='last_name'
          icon='circle'
          value={this.state.last_name}
          onChange={this.handleChange.bind(this, 'last_name')} />
        <Input 
          type='email' 
          label='Email address' 
          icon='email' 
          value={this.state.email} 
          onChange={this.handleChange.bind(this, 'email')} />
        <Input 
          type='text' 
          label='Mailing Address'
          value={this.state.mailing_address} 
          onChange={this.handleChange.bind(this, 'mailing_address')}
          icon={<span>MA</span>} />
        <Button label='Save' primary />
      </Page>
    );
  }
}

