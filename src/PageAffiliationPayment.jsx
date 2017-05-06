
import styles from "./style.css"
import React from 'react'
import EventTable from './common/EventTable.jsx'
import CompEventTable from './common/CompEventTable.jsx'
import Box from './common/BoxAdmin.jsx'
import Page from './Page.jsx'
import * as Table from 'reactabular-table';
import { browserHistory } from 'react-router';
import connection from './common/connection'

// affiliationpayment/:competition_id/:affiliation_id
class PageAffiliationPayment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      competition: null,
      organization: null,
    }

    /** Take the competition ID from the URL (Router hands
    it to us; see the path for this Page on Router) and make
    sure it's an integer */
    try {this.competition_id = parseInt(this.props.params.competition_id)}
    catch (e) { alert('Invalid competition ID!') }
    try {this.affiliation_id = parseInt(this.props.params.affiliation_id)}
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
    fetch(`/api/organizations`)
      .then(response => response.json()) // parse the result
      .then(json => { 
        // update the state of our component
        this.setState({ organization : json })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(err => { alert(err); console.log(err)})
  }

 render() {
   if (this.state.organization && this.state.competition){
    var comp_name = this.state.competition.Name;
    var affiliation = this.state.organization[this.affiliation_id];
    var affiliation_name = affiliation.name;
    var affiliation_owed = affiliation.amount_owed;
    var comp_info = (<form className = {styles.long_form}>
        <div>
                 
                 <div className = {styles.form_row}>
                    <label> Competition name : {comp_name} </label>            
                </div>
                
                <div className = {styles.form_row}>
                     <label> Affiliation number : {this.affiliation_id} </label>
                </div>
                     
                <div className = {styles.form_row}>
                    <label> Affiliation name : {affiliation_name} </label>            
                </div>


                <div className = {styles.form_row}>
                    <label> Amount Owed : {affiliation_owed} </label>            
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

    const event_table_columns = [
      {
        property: 'name',
        header: {
          label: 'Name',
          sortable: true,
          resizable: true
        }
      },
      {
        property: 'partner',
        header: {
          label: 'Partner',
          sortable: true,
          resizable: true
        }
      },
      {
        property: 'amount awed',
        header: {
          label: 'Amount awed',
          sortable: true,
          resizable: true
        }
      }
    ]

    return (
      <Page ref="page" {...this.props}>
          <div className={styles.titles}>
            <p>{affiliation_name}</p>
          </div>
          <div className={styles.infoTables}>
          </div>
          <div>
              {/*<div className={styles.infoBoxEditCompetition}>*/}
            <div className={styles.infoBoxExpanded}>
              <Box title={<div className={styles.titleContainers}><span>Edit Affiliation Payment</span> 
                             
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

export default connection(PageAffiliationPayment)
