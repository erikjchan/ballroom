/* 
 * SEE/EDIT ORGANIZATION
 *
 * This page will be used by admins to see details about the 
 * affiliations that are registered to their competition. They will
 * be able to mark the oganizations as paid from this page.
 */


import Autocomplete from 'react-autocomplete'
import styles from "./style.css"
import React from 'react'
import Select from 'react-select'
import EventTable from './common/EventTable.jsx'
import CompEventTable from './common/CompEventTable.jsx'
import Box from './common/Box.jsx'
import Page from './Page.jsx'
import * as Table from 'reactabular-table';
import { browserHistory } from 'react-router';
import connection from './common/connection'

// organizationpayment/:competition_id/:organization_id
class PageOrganizationPayment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      competition: null,
      organization: null,
      organizations: [],
      selectedOrg: "",
      selectedOrgID: "-1"
    }

    /** Take the competition ID from the URL (Router hands
    it to us; see the path for this Page on Router) and make
    sure it's an integer */
    try {this.competition_id = this.props.profile.competitor_id}
    catch (e) { alert('Invalid competition ID!') }
    try {this.organization_id = this.props.selected.competition.id}
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
        this.setState({ organization : json, organizations: json })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(err => { alert(err); console.log(err)})
  }

 render() {
     if (this.state.organization && this.state.competition){
         const search_org = (list, query) => {
             if (query === '') return []
             return list.filter(org => 
                 {return org.name.toLowerCase().indexOf(query) != -1;}
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
        var comp_name = this.state.competition.Name;
        var organization = this.state.organization[this.organization_id];
        var organization_name = organization.name;
        var organization_owed = organization.amount_owed;
        var comp_info = (
            <form className = {styles.long_form}>
                <div>

                <h3>Search for another organization:</h3>
                <div className = {styles.label}>
                    <Autocomplete
                      menuStyle={myMenuStyle}
                      inputProps={{name: "US state", id: "states-autocomplete"}}
                      ref="autocomplete"
                      value={this.state.selectedOrg}
                      items={this.state.organizations}
                      getItemValue={(item) => item.id}
                      onSelect={(value, item) => {
                          // set the menu to only the selected item
                        this.setState({ selectedOrg: item.name, selectedOrgID: item.id })
                        // or you could reset it to a default list again
                        // this.setState({ unitedStates: getStates() })
                      }}
                      onChange={(event, value) => { 
                        var json = search_org(this.state.organization, value)
                        this.setState({organizations: json, selectedOrg: value, selectedOrgID: "-1" })
                      }}
                      renderItem={(item, isHighlighted) => (
                        <div
                          key={item.abbr}
                          id={item.abbr}
                        >{item.name}</div>
                      )}
                    />
                    <button
                      className = {styles.searchBtn}
                      onClick={(event) => 
                        {
                            if (this.state.selectedOrgID != "-1") {
                               this.props.router.push("/organizationpayment/"+this.competition_id+"/"+this.state.selectedOrgID);
                            } else {
                                event.preventDefault();
                                alert("Please select an organization first!");
                                return false;
                            }
                        }}>
                        Go To
                    </button>
                </div>
                
                <h2>Current Organization Information:</h2>
                
                <div className = {styles.form_row}>
                     <label> Organization Number: {this.organization_id} </label>
                </div>
                     
                <div className = {styles.form_row}>
                    <label> Organization Name: {organization_name} </label>            
                </div>


                <div className = {styles.form_row}>
                    <label> Amount Owed: {organization_owed} </label>            
                </div>
                <div className = {styles.form_row}>
                    <label>
                        Enter New Payment Amount: 
                        <input type="number" name="payment" />
                    </label>
                </div>               
                 <div className = {styles.form_row}>
                    <input className = {styles.competitionEditBtns} type="submit" value="Save Changes" />
                </div>
               
            </div>
        </form>)

    return (
      <Page ref="page" {...this.props}>
          <h1>{organization_name}</h1>
          <div className={styles.infoTables}>
          </div>
          <div>
              {/*<div className={styles.infoBoxEditCompetition}>*/}
            <div className={styles.infoBoxExpanded}>
              <Box admin={true} title={<div className={styles.titleContainers}><span>See/Edit Organization Payment</span> 
                             
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
