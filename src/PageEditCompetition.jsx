/* 
 * EDIT COMPETITION
 *
 * This page will be used by admins to edit the parameters of 
 * competitions they have created.
 */


import styles from "./style.css"
import React from 'react'
import EventTable from './common/EventTable.jsx'
import CompEventTable from './common/CompEventTable.jsx'
import Box from './common/BoxAdmin.jsx'
import Page from './Page.jsx'
import * as Table from 'reactabular-table';
import { browserHistory } from 'react-router';


// editcompetition/:competition_id
export default class PageEditCompetition extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            /** We will populate this w/ data from the API */
            competition: null,
            competitor_events: [],
            competitor: [],
        }

        /** Take the competition ID from the URL (Router hands
        it to us; see the path for this Page on Router) and make
        sure it's an integer */
        try {this.competition_id = parseInt(this.props.params.competition_id)}
        catch (e) { alert('Invalid competition ID!') }
        this.competitor_id = 0
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
    }

    render() {
        if (this.state.competition){
            var comp_name = this.state.competition.Name;
            var comp_info = (<form className = {styles.long_form}>
                <div>
                        <div className = {styles.form_row}>
                            <label className = {styles.long_label}>
                                Competition Name: <br />
                                <input type="text" name="name" value = {this.state.competition.Name}/>
                            </label>
                        </div>
                
                        <div className = {styles.form_row}>
                            <label className = {styles.long_label}>
            Location:<br />
            <input type="text" name="location" value = {this.state.competition.LocationName}/>
        </label>
    </div>
    <br />
    <div className = {styles.form_row}>
        <label>
            Lead Start Number:<br />
            <input type="number" name="lead_number" />
        </label>
    </div>
    <div className = {styles.form_row}>
        <label >
            Early Price:<br />
            <input className = {styles.price} type="number" name="early_price" />
        </label>

        <label>
            Regular Price:<br />
            <input className = {styles.price} type="number" name="regular_price" />
        </label>
        <label>
            Late Price:<br />
            <input  className = {styles.price} type="number" name="late_price" />
        </label>
    </div>
    <div className = {styles.form_row}>
        <label>
            Start Date:<br />
            <input type="date" name="start_date" value = {this.state.competition.EarlyRegDeadline}/>
        </label>
        <label>
            End Date:<br />
            <input type="date" name="end_date" value = {this.state.competition.RegEndDate}/>
        </label>
    </div>
    <div className = {styles.form_row}>
        <label>
            Regular Start Date:<br />
            <input type="date" name="reg_start_date" />
        </label>
        <label>
            Regular End Date:
            <input type="date" name="reg_end_date" value = {this.state.competition.RegularRegDeadline}/>
        </label>
    </div>
    <div className = {styles.form_row}>
        <input className = {styles.competitionEditBtns} type="submit" value="Save Changes" />
        <button className={styles.competitionEditBtns} 
        onClick={() => {browserHistory.push("/competition/"+this.competition_id+"/editlevelsandstyles");}}> 
                         Edit Levels and Styles</button>
                </div>
                </div>
            </form>)

    
    var event_titles = (<div className={styles.lines}>
                          {this.state.competitor_events.sort(function (a, b){
                          return a.id - b.id}).map((event, i) => {
                            return (<p key={event.Title} key={i}>{event.Title}</p>)
                          })}
                        </div>)


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
            <p>{comp_name}</p>
          </div>
          <div className={styles.infoTables}>
          </div>
          <div>
              {/*<div className={styles.infoBoxEditCompetition}>*/}
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
