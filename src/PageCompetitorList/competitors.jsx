import React from 'react';
import {Table, Column, Cell} from 'fixed-data-table';
import * as resolve from 'table-resolver';
import style from '../style.css';

export default class SearchTable extends React.Component {
    constructor(props) {
        super(props);

        this.rows = [];
        this.state = {
            columns: [
            {
                dataKey: 'name',
                label: 'Name',
                props: {
                    style: {
                        width: 300
                    }
                },
                headerRenderer: this._renderHeader.bind(this),
            },
            {
                dataKey: 'organization_name',
                label: 'Organization',
                props: {
                    style: {
                        width: 300
                    }
                },
                headerRenderer: this._renderHeader.bind(this),

            },
            {
                dataKey: 'lead_number',
                label: 'Number',          
                props: {
                    style: {
                        width: 300
                    }
                },
                headerRenderer: this._renderHeader.bind(this),

            },
            {
                dataKey: 'amount_owed',
                label: 'Owes',
                props: {
                    style: {
                        width: 100
                    }
                },
                headerRenderer: this._renderHeader.bind(this),
            },
            {
                props: {
                    style: {
                        width: 200
                    }
                }
            }

            ],
            filteredDataList: this.rows,
        };
    }

    componentDidMount() {
        fetch("/api/competitors/competition/:id2")
          .then(response => response.json())
          .then(json => {
              this.rows = json
              console.log("rows length is" + this.rows.length)
              this.setState({
                  filteredDataList: this.rows, })
              console.log("filter length is" + this.state.filteredDataList.length)

          })
          .catch(err => alert(err))
    }

    render() {
        const { columns, rows, filteredDataList } = this.state;

        //const resolvedColumns = resolve.columnChildren({ columns });
        const resolvedRows = resolve.resolve({
            columns: columns,
            method: resolve.nested
        })(filteredDataList);

        return <Table
        height={40+((this.state.filteredDataList.length+1) * 30)}
        width={1150}
        rowsCount={this.state.filteredDataList.length}
        rowHeight={30}
        headerHeight={30}
        rowGetter={function(rowIndex) {return this.state.filteredDataList[rowIndex]; }.bind(this)}>
        <Column dataKey = 'name' width = {300} label = 'Name'
        headerRenderer =  {this._renderHeader.bind(this)}/>
        <Column dataKey = 'organization_name' width = {300} label = 'Organization'
        headerRenderer =  {this._renderHeader.bind(this)}/>
        <Column dataKey = 'lead_number' width = {300} label = 'Number'
        headerRenderer =  {this._renderHeader.bind(this)}/>
        <Column dataKey = 'amount_owed' width = {300} label = 'Owes'
        headerRenderer =  {this._renderHeader.bind(this)}/>
        </Table>;
  }

_renderHeader(label, cellDataKey) {
    return <div>
          <span>{label}</span>
            <div>
              <br />
              <input style={{width:90+'%'}} onChange={this._onFilterChange.bind(this, cellDataKey)}/>
            </div>
        </div>;
  }
 
  _onFilterChange(cellDataKey, event) {
    if (!event.target.value) {
      this.setState({
        filteredDataList: this.rows,
      });
    }
    var filterBy = event.target.value.toString().toLowerCase();
    var size = this.rows.length;
    var filteredList = [];
    for (var index = 0; index < size; index++) {
      var v = this.rows[index][cellDataKey];
      if (v.toString().toLowerCase().indexOf(filterBy) !== -1) {
        filteredList.push(this.rows[index]);
      }
    }
    this.setState({
      filteredDataList: filteredList,
    });
  }
}