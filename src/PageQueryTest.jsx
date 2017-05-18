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
// const query = require('../query2')
var moment = require('moment-timezone');

// editcompetition/:competition_id
export default class PageQueryTest extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      // Adding a new competition
      competition1: {
        name: "test_competition",
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
        id: 2,
        description: null ,
      },
      // Update existing competition
      competition2: {
        name: "test_competition",
        locationname: "cornell_university",
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
        id: 2,
        description: null ,
      },

      // Adding a new user
      competitor1: {
        firstname: "test",
        lastname: "user",
        email: null,
        mailingaddress: null,
        affiliationname: "Princeton Dance Team"   
      },
      competitor2:{email: this.props.profile.email },
      competitor3:{
        firstname:"test2",
        lastname: "user2",
        email: null,
        mailingaddress: null,
        affiliationname: "Princeton Dance Team"
      },
      bool1: null,
      bool2: null,
      bool3: null,
      bool4: null
    }

    /** Take the competition ID from the URL (Router hands
    it to us; see the path for this Page on Router) and make
    sure it's an integer */
  }

  componentDidMount() {
    /* Call the API for competition info */

    /*********************** Add New Competition Test ******************************/

    fetch("/api/create_competition", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state.competition1)
      })
        .then(res => res.json()).then(json => {
          console.log(json);
          //alert("true")
          this.props.api.get(`/api/competition/2`)
        .then(json => { 
        // update the state of our component
            this.setState({ competition1 : json })
            this.setState({bool1 :  (this.state.competition1.name == "test_competition").toString()})


            /************************ Edit Competition Test *******************************/
            fetch("/api/competition/updateCompetitionInfo", {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state.competition2)
            })
                .then(() => {
                this.props.api.get(`/api/competition/2`)
                .then(json => { 
                // update the state of our component
                this.setState({ competition2 : json })
                //console.log(this.state.competition2.locationname)
                this.setState({bool2: (this.state.competition2.locationname == "cornell_university").toString()})
            })
        });
        
        
         })       
    });
        
  /******************************** Add New User Test ********************************/
  const obj = Object.assign({ hasregistered:false, affiliationname: "Princeton Dance Team"},
        this.state.competitor2,
        { profile: this.props.profile})
    this.props.api.post('/api/create_user', obj)
        .then(response =>  {
          const {id} = response
          console.log(id)
          this.props.api.get(`/api/competitors/${id}`)
        .then(json => { 
        // update the state of our component
            this.setState({ competitor1 : json })
            this.setState({bool3: (this.state.competitor1.affiliationname == "Princeton Dance Team").toString()})
            console.log(this.state.bool3)

            /********************************* Update Competitor Info ***************************/
            this.props.api.post("/api/update_competitor", this.state.competitor3)
             .then(() => { 
               console.log(id)
               this.props.api.get(`/api/competitors/51`)
               .then(json => {           
                 this.setState({competitor3: json})
                 console.log(this.state.competitor3.email)
                 this.setState({bool4: (this.state.competitor3.email == "admin@admin.com").toString()})
               })
              });
         })      
    });

  }


  render() {
      console.log(this.state.bool1)
      console.log(this.state.bool2)
      console.log(this.state.bool3)
      console.log(this.state.bool4)

    if (this.state.bool1 && this.state.bool2 && this.state.bool3 && this.state.bool4) {
      var comp_name = this.state.competition1.name;
      
      return (
        <Page ref = "page" {...this.props}>
          <div className = {style.titles}>
            <p>{comp_name}</p>
          </div>
          {/*<div className={style.infoBoxEditCompetition}>*/}
          <div className = {style.infoBoxExpanded}>
            <Box admin = {true} title = {
              <div className = {style.titleContainers}><span>Competition Info</span> 
              </div>} 
              content = {
                  <div>
                    <div><p>add new competition test: {this.state.bool1}</p></div> 
                    <div><p>update competition test: {this.state.bool2}</p></div>
                    <div><p>add new competitor test: {this.state.bool3}</p></div>
                    <div><p>update competitor test: {this.state.bool4}</p></div>
                </div>
              }/>
          </div>
        </Page>
      );
    } else {
      return <Page ref = "page" {...this.props}/>
    }
  }
}
