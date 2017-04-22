import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import * as Table from 'reactabular-table';
import * as dnd from 'reactabular-dnd';
import * as resolve from 'table-resolver';
import * as search from 'searchtabular';
import style from '../style.css';
import { compose } from 'redux';


export default class CompetitorList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: {},
      sortingColumns: {},
      columns: [
        {
            id: 'name',
            property: 'name',
            props: {
                style: {
                    width: 250
                }
            },
            header: {
                label: 'Name',
            }
        },
        {
          id: 'organization_name',
          property: 'organization_name',
          props: {
            style: {
              width: 250
            }
          },
          header: {
            label: 'Organization',
          }
        },
        {
          id: 'lead_number',
          property: 'lead_number',
          props: {
            style: {
              width: 150
            }
          },
          header: {
            label: 'Number',
          }
        },
        {
          id: 'amount_owed',
          property: 'amount_owed',
          props: {
            style: {
              width: 200
            }
          },
          header: {
            label: 'Owes',
          }
        },
        {
          id: 'pay_w_org',
          property: 'pay_w_org',
          props: {
            style: {
              width: 100
            }
          },
          header: {
            label: 'Paying w/ Organization?',
          }
        },
      	{
            cell: {
      		    formatters: [
                    (value, { rowData }) => (
                        <div>
                            <input type="button"
                                   value="Edit/See More"
                                   onClick={() => alert(`${JSON.stringify(rowData, null, 2)}`)} />
      			        </div>
      		        )
      		    ]
      	    },
      		width: 100
        },
        {
          props: {
            style: {
              width: 100
            }
          }
        }
      ],
      rows: [],
      levels: ["Newcomer", "Bronze", "Silver", "Gold", "Open"],
      styles: [
          {
            title: "Smooth",
            dances: ["Waltz", "Tango", "Foxtrot", "V. Waltz"]
          },
          {
            title: "Standard",
            dances: ["Waltz", "Tango", "Foxtrot", "Quickstep"]
          },
          {
            title: "Rhythm",
            dances: ["Cha Cha", "Rhumba", "Swing", "Mambo"]
          },
          {
            title: "Latin",
            dances: ["Cha Cha", "Rhumba", "Jive", "V. Samba"]
          }
      ],
      rounds: ["Round 1", "Round 2", "Round 3", "Round 4", "Quarterfinals", "Semifinals", "Finals"],
      selectedNumber: "",
      selectedLevel: "",
      selectedStyle: "",
      selectedDance: "",
      selectedRound: ""
    };
  }

  getColumns() {
      	  return [
               {
      		    id: 'name',
      		    property: 'name',
      		    header: {
      		        label: 'Name',
      		        sortable: true,
      		        resizable: true
      		    },
      		    cell: {
      		        highlight: true
      		    },
      		    width: 250
      		 },
      		 {
      		     id: 'organization_name',
      		     property: 'organization_name',
      		     header: {
      		        label: 'Organization',
      		        sortable: true,
      		        resizable: true
      		    },
      		    cell: {
      		        highlight: true
      		    },
      		    width: 250
      		 },
      		 {
      		    id: 'lead_number',
      		    property: 'lead_number',
      		    header: {
      		        label: 'Number',
      		        sortable: true,
      		        resizable: true
      		    },
      		    cell: {
      		        highlight: true
      		    },
      		    width: 150
      		 },
      		 {
      		    id: 'amount_owed',
      		    property: 'amount_owed',
      		    header: {
      		        label: 'Owes',
      		        sortable: true,
      		        resizable: true
      		    },
      		    cell: {
      		        highlight: true
      		    },
      		    width: 200
      		 },
      		 {
      		     id: 'pay_w_org',
      		     property: 'pay_w_org',
      		     header: {
      		         label: 'Paying w/ Organization?',
      		         sortable: true,
      		         resizable: true
      		     },
      		     cell: {
      		         highlight: true
      		     },
      		     width: 100
      		 },
      		 {
      		     cell: {
      		         formatters: [
                         (value, { rowData }) => (
                             <div>
                               <input type="button"
                                      value="Edit/See More"
                                      onClick={() => alert(`${JSON.stringify(rowData, null, 2)}`)} />
      			             </div>
      		             )
      		         ]
      		     },
      		     width: 100
      		 },
      		 ];
      		 }

  componentWillMount() {
		if (this.props.data){
			this.setState({query: this.props.data.query})
		}
  }

  componentDidMount() {
    fetch("/api/competitors/competition/:id2")
	      .then(response => response.json())
		  .then(json => {
            this.rows = json;
            for (let i = 0; i < this.rows.length; i++) {
                if (this.rows[i].amount_owed != 0) {
                    this.rows[i].amount_owed = "$" + this.rows[i].amount_owed.toString();
		        }
                if (this.rows[i].pay_w_org) {
                    this.rows[i].pay_w_org = "Yes";
		        } else {
                    this.rows[i].pay_w_org = "No";
		        }
		    }
		    this.setState({ rows: json, }); 
		 })
		 .catch(err => alert(err));
  }

  render() {
    const components = {
      header: {
        wrapper: 'thead',
        row: 'tr',
        cell: 'th'
      },
      body: {
        row: dnd.Row
      }
    };
    const { columns, rows, query } = this.state;
    for (let i = 0; i < rows.length; i++) {
        rows[i].order_number = (i + 1);
    }
    //const resolvedColumns = resolve.columnChildren({ columns });
    const resolvedRows = compose(
      search.multipleColumns({ columns: columns, query }),
      resolve.resolve({
		     columns: columns,
		     method: (extra) => compose(
                resolve.byFunction('cell.resolve')(extra),
                resolve.nested(extra)
            )
		 })
    )(rows);

    return (
      <Table.Provider
        components={components}
        columns={columns}
        className={style.tableWrapper}
      >
        <Table.Header
          headerRows={resolve.headerRows({ columns })}
          className={style.tableHeader}
        >
                <search.Columns
                  query={query}
                  columns={columns}
                  onChange={query => this.setState({ query })}
                />
        </Table.Header>
        <Table.Body
          className={style.tableBody}
          rows={resolvedRows}
          rowKey="id"
          onRow={this.onRow}
        />
      </Table.Provider>
    );
  }
}
