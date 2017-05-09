/* 
 * EDIT JUDGES  
 *
 * This page allows admins to define the information about the judges who will
 * partake in the competition.
 */

import { Link } from 'react-router'
import React from 'react'
import * as Table from 'reactabular-table';
import lib from './common/lib.js'
import Page from './Page.jsx'
import Box from './common/BoxAdmin.jsx'
import EventTable from './common/OfficialTable.jsx'
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import style from './style.css';
import { browserHistory } from 'react-router';
import crypto from 'crypto'

// editofficial/:competition_id
export default class EditOfficial extends React.Component {
  constructor(props) {
    super(props)
    try {this.competition_id = parseInt(this.props.params.competition_id)}
    catch (e) { alert('Invalid competition ID!') }
    this.state = {
      /** We will populate this w/ data from the API */
      competition: null,
      officials: [],
      official: {
                    firstname:'',
                    lastname:'',
                    email:'',
                    phonenumber: '',
                    token:'',
                    competitionid: this.competition_id,
                }
    }
    /** Take the competition ID from the URL (Router hands
    it to us; see the path for this Page on Router) and make
    sure it's an integer */
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

    this.props.api.get(`/api/competition/${this.competition_id}/judges`)
      .then(json => {
        // update the state of our component
        json.map(item => {
            item.name = item.firstname+" "+item.lastname
        })
        this.setState({ officials : json })
      })
      // todo; setup a timer to retry. Fingers crossed, hopefully the
      // connection comes back
      .catch(err => alert(
        `There was an error fetching the competition`))

  }

  onRemove(rowData) {
      if (!confirm('Are you sure you want to delete the judge?\n'+
                        "  id: "+rowData.id + "\n"+
                        "  name: "+rowData.firstname+" "+rowData.lastname+"\n"+
                        "  email: "+rowData.email+"\n"+
                        "  phone: "+rowData.phonenumber+"\n"
                        )) {
          return false;
      }
      fetch("/api/delete_judge", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: rowData.id
            })
        }).then(() => {
            window.location.reload();
        });
  }
  addOfficial(event){
      var official = this.state.official
      official.token = crypto.randomBytes(16).toString('hex');
      console.log(this.state.official)
      fetch("/api/create_judge", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(official)
        }).then(() => {
            window.location.reload();
        });
  }


  /********************************** Render **********************************/

  render() {
      if (this.state.competition){

            /*const official_table = (this.officials === null)
            ? <div className="container-content"> Empty </div>
            : <Table.Provider
                style={{width: '100%'}}
                className="pure-table pure-table-striped"
                columns={this.columnsForOfficials()}>
                <Table.Header />
                <Table.Body rows={this.state.officials.slice(0,this.state.officials.length)} rowKey="id" />
                </Table.Provider>*/

            return (<Page ref="page" {...this.props}>

                <h1>Edit Official: {this.state.competition.name}</h1>
                <Box title={"Add Official"}
                        content ={
                <div className={style.lines}>
                <div >
                    <label>
                        First Name: <br />
                        <input type="text" name="firstname" size = '20'
                               value = {this.state.official.firstname} 
                               onChange = {(e) => { var o = this.state.official; o.firstname = e.target.value; this.setState({official: o});}}
                        />
                    </label>
                    <label>
                         Last Name: <br />
                        <input type="text" name="lastname" size = '20'
                               value = {this.state.official.lastname} 
                               onChange = {(e) => { var o = this.state.official; o.lastname = e.target.value; this.setState({official: o});}}
                        />
                    </label>
                    <label>
                        Email:<br />
                        <input type="text" name="email" size = '20'
                               value = {this.state.official.email}  
                               onChange = {(e) => { var o = this.state.official; o.email = e.target.value; this.setState({email: o});}} 
                        />
                    </label>
                    <label>
                        Phone:<br />
                        <input type="tel" name="phonenumber" size = '10'
                               value = {this.state.official.phonenumber}  
                               onChange = {(e) => { var o = this.state.official; o.phonenumber = e.target.value; this.setState({number: o});}} 
                        />
                    </label>
                </div>
                <button className = {style.judgeEditBtns}
                       onClick={this.addOfficial.bind(this)}>Save Changes</button>
                    </div>} />

                <Box
                title = "Officials"
                content = {
                    <EventTable
          events={this.state.officials}
          extra_columns={[{
            content: (value, {rowData}) => (
                <div>
                <div>
                <span
                  onClick={() => this.onRemove(rowData)}
                  style={{ marginLeft: '1em', cursor: 'pointer' }}
                >
                  &#10007; Drop
                </span>
              </div>
              </div>
            )
          }]}
        />
                }
                
                />
            </Page>
        )
    }
    else{
        return <Page ref="page" {...this.props}/>
    }
  }
}
