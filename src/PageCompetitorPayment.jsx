
import styles from "./style.css"
import React from 'react'
import EventTable from './common/EventTable.jsx'
import CompEventTable from './common/CompEventTable.jsx'
import Box from './common/BoxAdmin.jsx'
import Page from './Page.jsx'
import * as Table from 'reactabular-table';
import { browserHistory } from 'react-router';


// editcompetition/:competition_id
export default class PageCompetitorPayment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            /** We will populate this w/ data from the API */
            competition: null,
            competitor: null,
            payment_record:null,
        }

        /** Take the competition ID from the URL (Router hands
        it to us; see the path for this Page on Router) and make
        sure it's an integer */
        try {this.competitor_id = parseInt(this.props.params.competitor_id)}
        catch (e) { alert('Invalid competitor ID!') }

         try {this.competition_id = parseInt(this.props.params.competition_id)}
        catch (e) { alert('Invalid competition ID!') }
    }

    componentDidMount() {
        /* Call the API for competition info */
        fetch(`/api/competitors/${this.competitor_id}`)
          .then(response => response.json()) // parse the result
          .then(json => { 
              // update the state of our component
              this.setState({ competitor : json })
          })
          // todo; display a nice (sorry, there's no connection!) error
          // and setup a timer to retry. Fingers crossed, hopefully the 
          // connection comes back
          .catch(err => { alert(err); console.log(err)})

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
          .catch(err => { alert(err);console.log(err)})


          /* Call the API for competitor payment info */
        fetch(`/api/payment_records/${this.competition_id}/${this.competitor_id}`)
          .then(response => response.json()) // parse the result
          .then(json => { 
              // update the state of our component
              this.setState({ payment_record : json })
          })
          // todo; display a nice (sorry, there's no connection!) error
          // and setup a timer to retry. Fingers crossed, hopefully the 
          // connection comes back
          .catch(err => { alert(err); console.log(err)})
    }

    render() {
        if (this.state.competitor && this.state.competition && this.state.payment_record){
          var comp_name1 = String(this.state.competitor.firstname);
          var comp_name2 = this.state.competitor.lastname;
          var comp_name = comp_name1.concat(" ", comp_name2);
          var comp_info = (<form className = {styles.long_form}>        
                <div>
                    <div className = {styles.form_row}>
                        <label className = {styles.full_label}>
                            Competitor Name: 
                            {comp_name}
                        </label>
                    </div>
                    <div className = {styles.form_row}>
                        <label className = {styles.full_label}>
                            Last Payment Change: 
                            {this.state.payment_record.timestamp}
                        </label>
                    </div>
                    <div className = {styles.form_row}>
                        <label className = {styles.full_label}>
                            Registration Time: 
                            {/*todo*/}
                            {this.state.payment_record.timestamp}
                        </label>
                    </div>
                     <div className = {styles.form_row}>
                        <label className = {styles.long_label}>
                            Amount Owed: 
                            {this.state.payment_record.amount}
                        </label>
                    </div>
                    <div className = {styles.form_row}>
                        <label className = {styles.long_label}>
                            Paying Online
                        </label><br />
                        <br /><input type="radio" name="online" value = "true" /> True <br />
                        <input type="radio" name="online" value = "false" /> False 
                    </div>
                    <div className = {styles.form_row}>
                        <label className = {styles.long_label}>
                            Paying with Organization<br />
                        </label><br />
                        <br /><input type="radio" name="organization" value = "true" /> True <br />
                        <input type="radio" name="organization" value = "false" /> False
                    </div>
                    <div className = {styles.form_row}>
                        <input className = {styles.competitionEditBtns} type="submit" value="Save Changes" />
                    </div>
                </div>

            </form>);

            return (
            <Page ref="page" {...this.props}>
                <div className={styles.titles}>
                </div>
                <div className={styles.infoTables}>
                </div>
                    <div>
                    <div className={styles.infoBoxExpanded}>
                    <Box title={<div className={styles.titleContainers}><span>Competiton Info</span> 
                                    
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
