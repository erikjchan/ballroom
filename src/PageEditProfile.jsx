import styles from "./style.css"
import React from 'react'
import Page from './Page.jsx'
import Input from 'react-toolbox/lib/input';


    // editProfileWidget.init(user_token);
    

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

  saveChanges () {

    let id_token = localStorage.getItem('id_token');
    if (!id_token) return null;

      const auth_domain = 'mrkev.auth0.com'
      window.editProfileWidget = new Auth0EditProfileWidget('editProfileContainer', { domain: auth_domain }, [
        { label: "Name", type:"text", attribute:"name", 
          validation: (name) => (name.length > 10 ? 'The name is too long' : null)
        },

        // { label: "Lastname", type:"text", attribute:"lastname" },

        // { label: "BirthDay", type:"date", attribute:"birthday" },
        { label: "hobby", type:"text", attribute:"hobby"}
        
        // { label: "Type", type:"select", attribute:"account_type", 
        //   options:[
        //     { value: "type_1", text:"Type 1"},
        //     { value: "type_2", text:"Type 2"},
        //     { value: "type_3", text:"Type 3"}
        //   ]
        // }
    ]);

    editProfileWidget.init(id_token);

  }


  render() {



    return (
     <Page ref="page">
        <h1>Edit Profile</h1>
        <b>First Name</b>
        <div id='editProfileContainer'></div>
        <input
          type='text'
          name='first_name'
          value={this.state.first_name}
          onChange={this.handleChange.bind(this, 'first_name')}
          maxLength={16} /><br/>
        <b>Last Name</b>
        <input
          type='text'
          name='last_name'
          value={this.state.last_name}
          onChange={this.handleChange.bind(this, 'last_name')} /><br/>
        <b>Email address</b>
        <input 
          type='email' 
          value={this.state.email} 
          onChange={this.handleChange.bind(this, 'email')} /><br/>
        <b>Mailing Address</b>
        <input 
          type='text' 
          value={this.state.mailing_address} 
          onChange={this.handleChange.bind(this, 'mailing_address')} />
        <button onClick={this.saveChanges.bind(this)}>Save</button>
      </Page>
    );
  }
}

