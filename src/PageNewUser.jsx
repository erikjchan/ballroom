import React from 'react'
import Page from './Page.jsx'
import lib from './common/lib'
import style from './style.css';
import { browserHistory } from 'react-router';
import Autosuggest from 'react-autosuggest';
import Box from './common/Box.jsx'

export default class PageNewUser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      competitor: { email: this.props.profile.email },
      organizations: [],
      org_suggestions: [],
      affiliationname:''
    }
  }

  componentDidMount() {
      /** Get organizations */
      this.props.api.get(`/api/affiliations`)
        .then(organizations => {
          this.setState({ organizations })
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
    const { firstname, lastname, email, mailingaddress } = this.state.competitor
    const { affiliationname } = this.state
    if (!firstname || !lastname || !email || !mailingaddress || !affiliationname) {
      return console.log('INVALID')
    }

    const obj = Object.assign({ hasregistered:false, affiliationname },
        this.state.competitor,
        { profile: this.props.profile})
    this.props.api.post('/api/create_user', obj)
      .then(response => {
        console.log(response)
        if (response.severity) throw new Error(response)
        const {id} = response
        this.props.profile.app_metadata.competitor_id = id
        this.props.profile.competitor_id = id
        localStorage.setItem('profile', JSON.stringify(this.props.profile))
        browserHistory.push('/competitions')
      })
      .catch(err => console.error(err.detail || err.message.detail || err.message))
  }

  /************************ Organization autosuggestion ***********************/

  onOrganizationChange(event, { newValue }){
    this.setState({affiliationname: newValue})
  };

  /** Called whenever we need to clear suggestions. */
  onSuggestionsClearRequested () {
    this.setState({ org_suggestions: [] })
  };

  /**
   * Called whenever suggestions should be displayed
   */
  onSuggestionsFetchRequested({ value }) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    const org_suggestions = (inputLength === 0) ? [] : this.state.organizations.filter(org =>
      org.name.toLowerCase().slice(0, inputLength) === inputValue
    )

    this.setState({ org_suggestions })
  }

  // When suggestion is clicked, Autosuggest needs to populate the input element
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  getSuggestionValue (suggestion) {
    return suggestion.name
  }


  /** How to render suggestions for organizations */
  renderSuggestion (suggestion) {
    return (
      <div>
        {suggestion.name}
      </div>
    )
  }

  render() {

    const { competitor, organizations, org_suggestions, affiliationname } = this.state;

    return (
      <Page ref="page" {...this.props}>

        <h1>Welcome!</h1>
        <Box admin={false} title={"Create Profile"}>
          <div className={style.lines}>
          <br />
        <h5>First Name</h5>
        <input
          type='text'
          name='firstname'
          value={competitor.firstname}
          onChange={this.handleCompetitorFormChange.bind(this, 'firstname')}
          maxLength={16} /><br/>
        <h5>Last Name</h5>
        <input
          type='text'
          name='lastname'
          value={competitor.lastname}
          onChange={this.handleCompetitorFormChange.bind(this, 'lastname')} /><br/>
        <h5>Email address</h5>
        <input
          type='email'
          disabled
          value={competitor.email}/><br/>
        <h5>Organization</h5>
        <Autosuggest
          suggestions={org_suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
          getSuggestionValue={suggestion => suggestion.name}
          renderSuggestion={suggestion => <div> {suggestion.name} </div>}
          inputProps={{
            placeholder: 'What organization are you affiliated with?',
            value: affiliationname,
            onChange: this.onOrganizationChange.bind(this)
          }}
        />
        <h5>Mailing Address</h5>
        <input
          type='text'
          value={competitor.mailingaddress}
          onChange={this.handleCompetitorFormChange.bind(this, 'mailingaddress')} />
        <p><button className={style.saveBtns} onClick={this.createCompetitor.bind(this)}>Save</button></p>
          </div>
        </Box>
        </Page>
    )
  }
}
