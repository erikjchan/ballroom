
import React from 'react'
import * as Table from 'reactabular-table';

export default class YourEvents extends React.Component {

  render() {

    const columns = [
      {
        property: 'title',
        header: {
          label: 'Title',
          sortable: true,
          resizable: true
        }
      },
      {
        property: 'style',
        header: {
          label: 'Style',
          sortable: true,
          resizable: true
        }
      },
      {
        property: 'level',
        header: {
          label: 'Level',
          sortable: true,
          resizable: true
        }
      }
    ]

    if (this.props.extra_columns) this.props.extra_columns.forEach(e_column => {
      columns.push({
        cell: {
          formatters: [
            e_column.content
          ]
        }
      })
    })

    return (
      <Table.Provider
        className="pure-table pure-table-striped"
        columns={columns}>
        <Table.Header />
        <Table.Body rows={this.props.events} rowKey="id" />
      </Table.Provider>
    );
  }
}
