/* 
 * SEE/EDIT ORGANIZATION
 *
 * This page will be used by admins to see details about the 
 * affiliations that are registered to their competition. They will
 * be able to mark the oganizations as paid from this page.
 */


import Autocomplete from 'react-autocomplete'
import style from "./style.css"
import React from 'react'
import Select from 'react-select'
import EventTable from './common/EventTable.jsx'
import CompEventTable from './common/CompEventTable.jsx'
import Box from './common/Box.jsx'
import Page from './Page.jsx'
import * as Table from 'reactabular-table';
import { browserHistory } from 'react-router';
import connection from './common/connection'
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';

// organizationpayment/:competition_id/:organization_id
class PageOrganizationPayment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      competition: null,
      organization: null,
      owed: null,
      organizations: [],
      paid: "false",
      searched_organizations: [],
      keyword: "",
      selectedOrgID: "-1"
    }

    /** Take the competition ID from the URL (Router hands
    it to us; see the path for this Page on Router) and make
    sure it's an integer */
    // this.props.selected.competition.id 
    try {this.competition_id =  this.props.params.competition_id} 
    catch (e) { alert('Invalid competition ID!') }
    try {this.organization_id = this.props.params.organization_id}
    catch (e) { alert('Invalid competition ID!') }
    
 }

  componentDidMount() {
    /* Call the API for competition info */
    fetch(`/api/competition/${this.competition_id}`)
      .then(response => response.json()) // parse the result
      .then(json => { 
        // update the state of our component
        this.setState({ competition : json })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(err => { alert(err); console.log(err)})

      /* Call the API for organization info */
    fetch(`/api/affiliations`)
      .then(response => response.json()) // parse the result
      .then(json => { 
          // update the state of our component
        this.setState({organizations: json, searched_organizations:json})
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(err => { alert(err); console.log(err)})

            /* Call the API for organization info */
    fetch(`/api/affiliations/`+this.organization_id)
      .then(response => response.json()) // parse the result
      .then(json => { 
          // update the state of our component
        this.setState({ organization : json })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(err => { alert(err); console.log(err)})

    fetch(`/api/get_organization_owed/${this.competition_id}/${this.organization_id}`)
      .then(response => response.json()) // parse the result
      .then(json => { 
          // update the state of our component
        this.setState({ owed : json.coalesce })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(err => { alert(err); console.log(err)})
  }

  handlePayChange(value){
      console.log(this.state.paid)
      this.setState({paid: value});
      console.log(this.state.paid)
  }

  onSaveHandler(){
    console.log(this.state)
    if (this.state.paid == "true"){
           fetch("/api/clear_organization_owed", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    competitionid: this.competition_id,
                    affiliationid: this.organization_id
                })
            }).then(() => {
                window.location.reload();
            });
    }
  }

 render() {
     if (this.state.organization && this.state.competition){
         const search_org = (list, query) => {
             if (query === '') return list
             else
             return list.filter(org => 
                 {return org.name.toLowerCase().indexOf(query.toLowerCase()) != -1;}
             )
         }
         const myMenuStyle = {
             borderRadius: '3px',
             boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
             background: 'rgba(255, 255, 255, 0.9)',
             padding: '2px 0',
             fontSize: '90%',
             overflow: 'auto',
             maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
             zIndex: 200
         };
        var comp_name = this.state.competition.name;
        var organization_name = this.state.organization.name;
        var organization_owed = this.state.owed;
        var comp_info = (
            <div className={style.lines}>
                <h2>Search for Another Organization:</h2>
                <div className = {style.label}>
                    <Autocomplete
                      menuStyle={myMenuStyle}
                      ref="autocomplete"
                      value={this.state.value}
                      items={this.state.searched_organizations}
                      getItemValue={(item) => item.name}
                      onSelect={(value, item) => {
                          // set the menu to only the selected item
                        this.setState({ value, searched_organizations: [ item ], selectedOrgID: item.id})
                        this.setState({keyword: value})
                        // or you could reset it to a default list again
                        // this.setState({ unitedStates: getStates() })
                      }}
                      onChange={(event, value) => { 
                        console.log(event)
                        console.log(value)
                        this.setState({ value, loading: true })
                        this.setState({ keyword: value})
                        var json = search_org(this.state.organizations, value)
                        this.setState({searched_organizations: json, loading: false, selectedOrgID: "-1" })
                      }}
                      renderItem={(item, isHighlighted) => (
                        <div
                          key={item.abbr}
                          id={item.abbr}
                        >{item.name}</div>
                      )}
                    />
                    <button
                      className = {style.searchBtn}
                      onClick={(event) => 
                        {   
                            console.log(this.state);
                            if (this.state.selectedOrgID != "-1") {
                               window.location.href = ("/organizationpayment/"+this.competition_id+"/"+this.state.selectedOrgID);
                            } else {
                                event.preventDefault();
                                alert("Please select an organization first!");
                                return false;
                            }
                        }}>
                        Go To
                    </button>
                </div>
                <br/>
                <hr/>
                <h2>Current Organization Information:</h2>
                <p><b>Organization Number:</b> {this.organization_id} </p>   
                <p><b>Organization Name:</b> {organization_name} </p>            
                <p><b>Amount Owed:</b> ${organization_owed} </p>          
                <h3>Mark as Paid?</h3>
                <span>
                    <RadioGroup name='comic' value={this.state.paid} onChange={this.handlePayChange.bind(this)}>
                        <RadioButton label='Paid' value='true'/>
                        <RadioButton label='Unpaid' value='false'/>
                    </RadioGroup>
                </span>
                 <div className = {style.form_row}>
                    <button className = {style.competitionEditBtns} onClick={this.onSaveHandler.bind(this)}>Save</button>
                </div>
        </div>)

    return (
      <Page ref="page" {...this.props}>
          <h1>{organization_name}</h1>
          <div className={style.infoTables}>
          </div>
          <div>
              {/*<div className={style.infoBoxEditCompetition}>*/}
            <div className={style.infoBoxExpanded}>
              <Box admin={true} title={<div className={style.titleContainers}><span>See/Edit Organization Payment</span> 
                             
                          </div>} 
                   content={comp_info}/>
                </div>
            
        </div>
                  
      </Page>

    ); 
  }
  else {
    return <Page ref="page" {...this.props}/>
  }
 }
}

export default connection(PageOrganizationPayment)
