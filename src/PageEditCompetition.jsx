/* 
 * EDIT COMPETITION
 *
 * This page will be used by admins to edit the parameters of 
 * competitions they have created.
 */

import style from "./style.css"
import React from 'react'
import Box from './common/Box.jsx'
import Page from './Page.jsx'
import * as Table from 'reactabular-table';
import { browserHistory } from 'react-router';
import { selectCompetition } from './actions'
var moment = require('moment-timezone');

// editcompetition/:competition_id
export default class PageEditCompetition extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            /** We will populate this w/ data from the API */
            competition: {
                        name: null,
                        locationname: null,
                        leadidstartnum: null,
                        earlyprice: null,
                        regularprice: null,
                        lateprice: null,
                        startdate: null,
                        enddate: null,
                        regstartdate: null,
                        earlyregdeadline: null,
                        regularregdeadline: null,
                        lateregdeadline: null,
                        id: null,
                        description: null ,
                        },
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
        if (this.competition_id > 0){
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
    }

    onChangeHandler(event){
        var new_competition = this.state.competition;
        new_competition[event.target.name] = event.target.value===''?  null: event.target.value; 
        this.setState({competition: new_competition});
    }
    
    onSaveHandler(){
        console.log(this.state.competition);
        if (this.competition_id > 0){
            fetch("/api/competition/updateCompetitionInfo", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state.competition)
            }).then(() => {
                window.location.reload();
            });
        }
        else{
            if (!confirm("Are you sure to create a new competition with the provided information? You can continue editing the competition after the creation. ")){
                return;
            }
            fetch("/api/create_competition", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.state.competition)
                }).then(res => res.json()).then(json => {
                    console.log(json);
                    this.props.dispatch(selectCompetition(json))
                    //window.location.href = '/editcompetition/'+json.id;
                    browserHistory.push('/admin/competition/' + json.id)
                });
        }
    }

//   validateForm = function(event) {
//       // event.preventDefault();
// 	var a = document.forms["compform"]["name"].value;

//     var b=document.forms["compform"]["location"].value;

//     if ((a==null || a=="")  ) {
//         alert("Please enter a valid restaurant name");
//         return false;
//     }
//     var n =a.length;
//     var m=b.length;

//     if(n>30){
//         alert("Name is too long!");
//         return false;

//     }
//   }

    render() {
        if (this.state.competition){
            var comp_name = this.state.competition.Name;
            var comp_info = (<div className = {style.long_form}>
                <div>
                        <div className = {style.form_row}>
                            <label className = {style.long_label}>
                                Competition Name: <br />
                                <input type="text" name="name" value = {(this.state.competition.name) || ''}
                                    onChange={this.onChangeHandler.bind(this)}/>
                            </label>
                        </div>
                
                        <div className = {style.form_row}>
                            <label className = {style.long_label}>
            Location:<br />
            <input type="text" name="locationname" value = {(this.state.competition.locationname) || ''}
                onChange={this.onChangeHandler.bind(this)} />
        </label>
    </div>
    <br />
    <div className = {style.form_row}>
        <label>
            Lead Start Number:<br />
            <input type="number" name="leadidstartnum" value = {(this.state.competition.leadidstartnum) || ''}
                 onChange={this.onChangeHandler.bind(this)} />
        </label>
    </div>
    <div className = {style.form_row}>
        <label>
            Start Date:<br />
            <input type="date" name="startdate" value = {this.formatDateString(this.state.competition.startdate) || ''}
                 onChange={this.onChangeHandler.bind(this)}/>
        </label>
        <label>
            End Date:<br />
            <input type="date" name="enddate" value = {this.formatDateString(this.state.competition.enddate) || ''}
                onChange={this.onChangeHandler.bind(this)}/>
        </label>
    </div>
    <div className = {style.form_row}>
        <label>
            Start Early Bird Registration:<br />
            <input type="date" name="regstartdate"  value = {this.formatDateString(this.state.competition.regstartdate) || ''}
                 onChange={this.onChangeHandler.bind(this)}/>
        </label>
        <label >
            Early Price:<br />
            $ &nbsp;
            <input className = {style.price} type="number" name="earlyprice" value = {this.state.competition.earlyprice || ''}
                 onChange={this.onChangeHandler.bind(this)}/>
        </label>
        </div>
    <div className = {style.form_row}>
        <label>
            Start Regular Registration:<br />
            <input type="date" name="earlyregdeadline" value = {this.formatDateString(this.state.competition.earlyregdeadline) || ''}
                 onChange={this.onChangeHandler.bind(this)}/>
        </label>
        <label>
            Regular Price:<br />
            $ &nbsp;
            <input className = {style.price} type="number" name="regularprice" value = {this.state.competition.regularprice || ''}
                 onChange={this.onChangeHandler.bind(this)}/>
        </label>
        </div>
    <div className = {style.form_row}>
        <label>
            Start Late Registration:<br />
            <input type="date" name="regularregdeadline" value = {this.formatDateString(this.state.competition.regularregdeadline) || ''}
                 onChange={this.onChangeHandler.bind(this)}/>
        </label>
        <label>
            Late Price:<br />
            $ &nbsp;
            <input  className = {style.price} type="number" name="lateprice" value = {this.state.competition.lateprice || ''}
                 onChange={this.onChangeHandler.bind(this)}/>
                 
        </label>
    </div>
    <div className = {style.form_row}>
        <label>
           End All Registration:<br />
            <input type="date" name="lateregdeadline" value = {this.formatDateString(this.state.competition.lateregdeadline) || ''}
                 onChange={this.onChangeHandler.bind(this)}/>
        </label>
    </div>
    
    <div className = {style.form_row}>
        <button className = {style.competitionEditBtns} onClick={this.onSaveHandler.bind(this)}>
            {this.competition_id==0? "Create Competition": "Save Changes"}</button>
        {this.competition_id > 0 && <button className={style.competitionEditBtns} 
        onClick={() => {browserHistory.push("/competition/"+this.competition_id+"/editlevelsandstyles");}}> 
                         Edit Levels and Styles</button>}
                </div>
                </div>
            </div>
    )

    return (
      <Page ref="page" {...this.props}>
          <div className={style.titles}>
            <p>{comp_name}</p>
          </div>
              {/*<div className={style.infoBoxEditCompetition}>*/}
            <div className={style.infoBoxExpanded}>
              <Box admin={true} title={<div className={style.titleContainers}><span>Competition Info</span> 
                             
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
