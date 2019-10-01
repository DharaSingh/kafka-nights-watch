import React from 'react';
import ReactDataGrid from 'react-data-grid';

const columns = [
  { key: 'name', name: 'Topic' },
  { key: 'partitions', name: 'Partitions' },
  { key: 'leader', name: 'Leader' } ];

const rows = [{id: 0, title: 'row1', count: 20}, {id: 1, title: 'row1', count: 40}, {id: 2, title: 'row1', count: 60}];

function Topics() {
  return (<ReactDataGrid
  columns={columns}
  rowGetter={i => rows[i]}
  rowsCount={3}
  minHeight={150}
  resizable='true'
  sortable='true'
   />);
}

export default Topics;