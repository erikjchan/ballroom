/* 
 * EDIT COMPETITION
 *
 * This page will be used by admins to edit the parameters of 
 * competitions they have created.
 */


import styles from "./style.css"
import React from 'react'
import Box from './common/Box.jsx'
import Page from './Page.jsx'
import * as Table from 'reactabular-table';
import { browserHistory } from 'react-router';
var moment = require('moment-timezone');

// editcompetition/:competition_id
export default class PageEditCompetition extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            /** We will populate this w/ data from the API */
            competition: null,
            // competitor_events: [],
        }

        /** Take the competition ID from the URL (Router hands
        it to us; see the path for this Page on Router) and make
        sure it's an integer */
        try {this.competition_id = parseInt(this.props.params.competition_id)}
        catch (e) { alert('Invalid competition ID!') }
    }

    formatDateString(date){
        return moment(date).tz('America/New_York').format('YYYY-MM-DD');
    }

    componentDidMount() {
        /* Call the API for competition info */
        this.props.api.get(`/api/competition/${this.competition_id}`)
          .then(json => { 
              // update the state of our component
              this.setState({ competition : json })
          })
          // todo; display a nice (sorry, there's no connection!) error
          // and setup a timer to retry. Fingers crossed, hopefully the 
          // connection comes back
          .catch(err => { alert(err); console.log(err)})
    }

    onChangeHandler(event){
        var new_competition = this.state.competition;
        new_competition[event.target.name] = event.target.value; 
        this.setState({competition: new_competition});
    }
    
    onSaveHandler(){

    }

    render() {
        if (this.state.competition){
            var comp_name = this.state.competition.Name;
            var comp_info = (<form className = {styles.long_form}>
                <div>
                        <div className = {styles.form_row}>
                            <label className = {styles.long_label}>
                                Competition Name: <br />
                                <input type="text" name="name" value = {(this.state.competition.name)}
                                    onChange={this.onChangeHandler.bind(this)}/>
                            </label>
                        </div>
                
                        <div className = {styles.form_row}>
                            <label className = {styles.long_label}>
            Location:<br />
            <input type="text" name="locationname" value = {(this.state.competition.locationname)}
                onChange={this.onChangeHandler.bind(this)} />
        </label>
    </div>
    <br />
    <div className = {styles.form_row}>
        <label>
            Lead Start Number:<br />
            <input type="number" name="leadidstartnum" value = {(this.state.competition.leadidstartnum)}
                 onChange={this.onChangeHandler.bind(this)} />
        </label>
    </div>
    <div className = {styles.form_row}>
        <label >
            Early Price:<br />
            <input className = {styles.price} type="number" name="earlyprice" value = {this.state.competition.earlyprice}
                 onChange={this.onChangeHandler.bind(this)}/>
        </label>

        <label>
            Regular Price:<br />
            <input className = {styles.price} type="number" name="regularprice" value = {this.state.competition.regularprice}
                 onChange={this.onChangeHandler.bind(this)}/>
        </label>
        <label>
            Late Price:<br />
            <input  className = {styles.price} type="number" name="lateprice" value = {this.state.competition.lateprice}
                 onChange={this.onChangeHandler.bind(this)}/>
        </label>
    </div>
    <div className = {styles.form_row}>
        <label>
            Start Date:<br />
            <input type="date" name="startdate" value = {this.formatDateString(this.state.competition.startdate)}
                 onChange={this.onChangeHandler.bind(this)}/>
        </label>
        <label>
            End Date:<br />
            <input type="date" name="enddate" value = {this.formatDateString(this.state.competition.enddate)}
                onChange={this.onChangeHandler.bind(this)}/>
        </label>
    </div>
    <div className = {styles.form_row}>
        <label>
            Start Early Bird Registration:<br />
            <input type="date" name="regstartdate"  value = {this.formatDateString(this.state.competition.regstartdate)}
                 onChange={this.onChangeHandler.bind(this)}/>
        </label>
        </div>
    <div className = {styles.form_row}>
        <label>
            Start Regular Registration:<br />
            <input type="date" name="earlyregdeadline" value = {this.formatDateString(this.state.competition.earlyregdeadline)}
                 onChange={this.onChangeHandler.bind(this)}/>
        </label>
    </div>
    <div className = {styles.form_row}>
        <label>
            Start Late Registration:<br />
            <input type="date" name="regularregdeadline" value = {this.formatDateString(this.state.competition.regularregdeadline)}
                 onChange={this.onChangeHandler.bind(this)}/>
        </label>
    </div>
    <div className = {styles.form_row}>
        <label>
           End All Registration:<br />
            <input type="date" name="lateregdeadline" value = {this.formatDateString(this.state.competition.lateregdeadline)}
                 onChange={this.onChangeHandler.bind(this)}/>
        </label>
    </div>
    <div className = {styles.form_row}>
        <input className = {styles.competitionEditBtns} onClick={()=>this.onSaveHandler()} value="Save Changes" />
        <button className={styles.competitionEditBtns} 
        onClick={() => {browserHistory.push("/competition/"+this.competition_id+"/editlevelsandstyles");}}> 
                         Edit Levels and Styles</button>
                </div>
                </div>
            </form>)

    
    /*var event_titles = (<div className={styles.lines}>
                          {this.state.competitor_events.sort(function (a, b){
                          return a.id - b.id}).map((event, i) => {
                            return (<p key={event.Title} key={i}>{event.Title}</p>)
                          })}
                        </div>)*/


    // const event_table_columns = [
    //   {
    //     property: 'name',
    //     header: {
    //       label: 'Name',
    //       sortable: true,
    //       resizable: true
    //     }
    //   },
    //   {
    //     property: 'partner',
    //     header: {
    //       label: 'Partner',
    //       sortable: true,
    //       resizable: true
    //     }
    //   },
    //   {
    //     property: 'amount awed',
    //     header: {
    //       label: 'Amount awed',
    //       sortable: true,
    //       resizable: true
    //     }
    //   }
    // ]

    return (
      <Page ref="page" {...this.props}>
          <div className={styles.titles}>
            <p>{comp_name}</p>
          </div>
              {/*<div className={styles.infoBoxEditCompetition}>*/}
            <div className={styles.infoBoxExpanded}>
              <Box admin={true} title={<div className={styles.titleContainers}><span>Competiton Info</span> 
                             
                          </div>} 
                   content={comp_info}/>
                </div>
      </Page>

    ); 
  }
  else {
    return <Page ref="page" {...this.props}/>
  }
 }
}
