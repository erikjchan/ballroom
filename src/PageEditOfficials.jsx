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
import Box from './common/Box.jsx'
import EventTable from './common/OfficialTable.jsx'
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import style from './style.css';
import { browserHistory } from 'react-router';
import crypto from 'crypto'

// editofficials/:competition_id
export default class EditOfficials extends React.Component {
  constructor(props) {
    super(props)
    try {this.competition_id = parseInt(this.props.params.competition_id)}
    catch (e) { alert('Invalid competition ID!') }
    this.state = {
      /** We will populate this w/ data from the API */
      competition: lib.flat_loading_proxy,
      officials: [],
      inputFirstName: '',
      inputLastName: '',
      selectedRoleId: '',
      roles: []
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
      .catch(err => { alert("There was an error fetching the competition"); console.log(err)})

    this.props.api.get('/api/roles')
      .then(json => {
        this.setState({roles: json});
      })
      .catch(err => alert('There was an error fetcihng official roles'));

    this.props.api.get(`/api/competition/${this.competition_id}/officials`)
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
        `There was an error fetching the officials`))
  }

  onRemove(rowData) {
      if (!confirm('Are you sure you want to delete the judge?\n'+
                        "  id: "+rowData.id + "\n"+
                        "  name: "+rowData.firstname+" "+rowData.lastname+"\n"+
                        "  email: "+rowData.rolename
                        )) {
          return false;
      }
      this.props.api.post("/api/delete_official", {id: rowData.id});
      const officials = cloneDeep(this.state.officials);
      const idx = findIndex(officials, { id: rowData.id });

      // this could go through flux etc.
      const officialToRemove = officials[idx];
      officials.splice(idx, 1);
      this.setState({officials: officials});
  }

  addOfficial(event){
      if (this.state.selectedRoleId == "") {
        return false;
      }
      const official = {
        firstname: this.state.inputFirstName,
        lastname: this.state.inputLastName,
        roleid: this.state.selectedRoleId,
        competitionid: this.competition_id
      }
      official.token = crypto.randomBytes(16).toString('hex');
      this.props.api.post("/api/create_official", official)
        .then((res) => {
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

                <h1>Edit Officials: {this.state.competition.name}</h1>
                <Box admin={true} title={"Add Official"}
                        content ={
                <div className={style.lines}>
                <div >
                    <label className="addLabel">
                        First Name: <br />
                        <input type="text" name="firstname" size = '20'
                               value = {this.state.inputFirstName} 
                               onChange = {(event) => this.setState({inputFirstName: event.target.value})}
                        />
                    </label>
                    <label className="addLabel">
                         Last Name: <br />
                        <input type="text" name="lastname" size = '20'
                               value = {this.state.inputLastName} 
                               onChange = {(event) => this.setState({inputLastName: event.target.value})}
                        />
                    </label>
                    <label className="addLabel">
                        Role:<br />
                        <select value={this.state.selectedRoleId} onChange={(event) => this.setState({selectedRoleId: event.target.value})}>
                          <option value="" disabled></option>
                          {this.state.roles.map(role => (<option key={"role_id_" + role.id} value={role.id}>{role.name}</option>))}
                        </select>
                    </label>
                </div>
                <button className = {style.judgeEditBtns}
                       onClick={this.addOfficial.bind(this)}>Add Official</button>
                    </div>} />

                <Box
                admin={true} 
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
