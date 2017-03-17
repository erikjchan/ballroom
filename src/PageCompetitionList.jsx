
import styles from "./style.css"
import React from 'react'
import * as Table from 'reactabular-table';
import lib from './common/lib.js'
import Page from './Page.jsx'

// /competitions
export default class PageCompetitionList extends React.Component {

	constructor(props) {
    super(props)
    this.state = {
      /** We will populate this w/ data from the API */
      competitions: [],
    }

    this.competition_id = 2
  }

  componentDidMount() {

    console.log('this', this)

    /* Call the API for competitions info */
    fetch(`/api/competitions`)
      .then(response => response.json()) // parse the result
      .then(json => { 
        // update the state of our component
        this.setState({ competitions : json })
      })
      // todo; display a nice (sorry, there's no connection!) error
      // and setup a timer to retry. Fingers crossed, hopefully the 
      // connection comes back
      .catch(this.refs.page.errorNotif(
        `There was an error fetching the competitions`))

  }

 render() {

 	const yourColumns = [
    {
      property: 'Name',
      header: {
        label: 'Name',
        sortable: true,
        resizable: true
      }
    },
    {
      property: 'RegPrice',
      header: {
        label: 'Amount Owed',
        sortable: true,
        resizable: true
      }
    },
    {
      property: 'StartDate',
      header: {
        label: 'Date',
        sortable: true,
        resizable: true
      }
    }
  ]

  const otherColumns = [
    {
      property: 'Name',
      header: {
        label: 'Name',
        sortable: true,
        resizable: true
      }
    },
    {
      property: 'RegPrice',
      header: {
        label: 'Price',
        sortable: true,
        resizable: true
      }
    },
    {
      property: 'RegEndDate',
      header: {
        label: 'Reg Deadline',
        sortable: true,
        resizable: true
      }
    }
  ]

   return (
   		<Page ref="page">

     		<div className={styles.content}>
       		<h1>Competitions Page</h1>

       		<div>
       		<h2>Your Competitions</h2>
       		<Table.Provider
        		className="pure-table pure-table-striped"
        		columns={yourColumns}>
        		<Table.Header />
        		<Table.Body rows={this.state.competitions || []} rowKey="id" />
      		</Table.Provider>

      		<button className={styles.goMain} disabled>Go to Main Page</button>
      		</div>

      		<div>
       		<h2>Other Competitions</h2>
       		<Table.Provider
        		className="pure-table pure-table-striped"
        		columns={otherColumns}>
        		<Table.Header />
        		<Table.Body rows={this.state.competitions || []} rowKey="id" />
      		</Table.Provider>

      		<button className={styles.search} disabled>Search</button>
      		<button className={styles.createNew} disabled>Create New</button>
      		<button className={styles.register} disabled>Register</button>
      		</div>
     		</div>
     </Page>
   );
 }
}


