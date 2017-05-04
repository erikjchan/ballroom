import { Link } from 'react-router'
import React from 'react'
import * as Table from 'reactabular-table';
import lib from './common/lib.js'
import Page from './Page.jsx'
import Box from './common/BoxAdmin.jsx'
import EventTable from './common/OfficialTable.jsx'
import style from './style.css';
import { browserHistory } from 'react-router';


export default class EditOfficial extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      competition: null,
      officials: [],
      official:[]
    }


    this.state.official = 
        {'name':'',
        'email':'',
        'number': '',
        'position':''
        }
    

    /** Take the competition ID from the URL (Router hands
    it to us; see the path for this Page on Router) and make
    sure it's an integer */
    try {this.competition_id = parseInt(this.props.params.competition_id)}
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

    fetch(`/api/judges`)
      .then(response => response.json()) // parse the result
      .then(json => {
        // update the state of our component
        this.setState({ officials : json })
      })
      // todo; setup a timer to retry. Fingers crossed, hopefully the
      // connection comes back
      .catch(this.refs.page.errorNotif(
        `There was an error fetching the competition`))

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

                <h1>Edit Official: {this.state.competition.Name}</h1>
                <Box title={"Add Official"}
                        content ={
                    <div className={style.lines}>
                        <form>
                <div >
                    <label>
                        Official Name: <br />
                        <input type="text" name="name" value = {this.state.official.Name} size = '20'/>
                    </label>
                    <label>
                        Email:<br />
                        <input type="text" name="location" value = {this.state.official.email}  size = '20'/>
                    </label>
                    <label>
                        Number:<br />
                        <input type="tel" name="number" value = {this.state.official.number}  size = '10'/>
                    </label>
                    <label>
                        Position:<br />
                        <input type="text" name="position" value = {this.state.official.position}  size = '20'/>
                    </label>
                </div>
                <input className = {style.judgeEditBtns} type="submit" value="Save Changes" />
            </form>
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
                  onClick={() => alert(`should remove: ${JSON.stringify(rowData, null, 2)}`)}
                  style={{ marginLeft: '1em', cursor: 'pointer' }}
                >
                  &#10004; Edit
                </span>
                </div>

                <div>
                <span
                  onClick={() => alert(`should remove: ${JSON.stringify(rowData, null, 2)}`)}
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
        return <Page ref="page" auth={{ profile: this.props.profile, isAuthenticated: this.props.isAuthenticated }} />
    }
  }
}
