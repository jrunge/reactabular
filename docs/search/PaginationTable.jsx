/* eslint-disable no-shadow */
import React from 'react';
import { compose } from 'redux';
import {
  Paginator, paginate, Search, generateData
} from '../helpers';
import {
  Table, search
} from '../../src';

const schema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    age: {
      type: 'integer'
    }
  },
  required: ['id', 'name', 'age']
};
const data = generateData(100, schema);
const columns = [
  {
    header: {
      label: 'Name'
    },
    cell: {
      property: 'name'
    }
  },
  {
    header: {
      label: 'Age'
    },
    cell: {
      property: 'age'
    }
  }
];

export default class PaginationTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: {}, // Search query
      columns,
      data,
      pagination: { // initial pagination settings
        page: 1,
        perPage: 10
      }
    };

    this.onSelect = this.onSelect.bind(this);
  }
  render() {
    const { data, columns, pagination, query } = this.state;
    const paginated = compose(
      paginate(pagination),
      search.multipleColumns({ columns, query })
    )(data);

    return (
      <div>
        <div className="search-container">
          <span>Search</span>
          <Search
            columns={columns}
            data={data}
            onChange={query => this.setState({ query })}
          />
        </div>

        <Table.Provider columns={columns} data={paginated.data} rowKey="id">
          <Table.Header />

          <Table.Body />
        </Table.Provider>

        <div className="controls">
          <Paginator
            pagination={pagination}
            pages={paginated.amount}
            onSelect={this.onSelect}
          />
        </div>
      </div>
    );
  }
  onSelect(page) {
    const pages = Math.ceil(
      this.state.data.length / this.state.pagination.perPage
    );

    this.setState({
      pagination: {
        ...this.state.pagination,
        page: Math.min(Math.max(page, 1), pages)
      }
    });
  }
}
