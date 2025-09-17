import React from 'react';
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import type { Row, Cell } from 'react-table';

interface Student {
  student_id: string;
  name: string;
  class: string;
  comprehension: number;
  attention: number;
  focus: number;
  retention: number;
  engagement_time: number;
  assessment_score: number;
  persona: string;
}

interface StudentTableProps {
  data: Student[];
}

const StudentTable: React.FC<StudentTableProps> = ({ data }) => {
  const columns = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'student_id' },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Class', accessor: 'class' },
      { Header: 'Comprehension', accessor: 'comprehension' },
      { Header: 'Attention', accessor: 'attention' },
      { Header: 'Focus', accessor: 'focus' },
      { Header: 'Retention', accessor: 'retention' },
      { Header: 'Engagement Time', accessor: 'engagement_time' },
      { Header: 'Assessment Score', accessor: 'assessment_score' },
      { Header: 'Persona', accessor: 'persona' },
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable<Student>({ columns, data }, useGlobalFilter, useSortBy);

  const hasQuery = (state.globalFilter || '').trim().length > 0;
  return (
    <div>
      <input
        className="mb-4 p-2 border-2 border-black rounded-lg w-full focus:ring-2 focus:ring-black/30 outline-none text-black bg-white"
        value={state.globalFilter || ''}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search by name, class, or persona (anonymous, e.g., 'High Performer', 'Average Learner', 'At-risk Student')"
      />
      {hasQuery ? (
        <div className="overflow-x-auto">
          <table {...getTableProps()} className="min-w-full bg-white rounded-xl shadow-card border border-gray-200">
            <thead>
              {(headerGroups as unknown[]).map((headerGroupUnknown) => {
                // type guard for headerGroup
                if (
                  typeof headerGroupUnknown !== 'object' ||
                  headerGroupUnknown === null ||
                  !('getHeaderGroupProps' in headerGroupUnknown) ||
                  !('headers' in headerGroupUnknown) ||
                  !('id' in headerGroupUnknown)
                ) {
                  return null;
                }
                const headerGroup = headerGroupUnknown as {
                  getHeaderGroupProps: () => object;
                  headers: unknown[];
                  id: string | number;
                };
                return (
                  <tr {...headerGroup.getHeaderGroupProps()} key={String(headerGroup.id)}>
                    {headerGroup.headers.map((columnUnknown) => {
                      // Type guard for dynamic react-table properties (no 'any' usage)
                      const hasSortProps = (
                        col: unknown
                      ): col is { getSortByToggleProps: () => object; isSorted: boolean; isSortedDesc: boolean } => {
                        return (
                          typeof col === 'object' &&
                          col !== null &&
                          'getSortByToggleProps' in col &&
                          typeof (col as Record<string, unknown>).getSortByToggleProps === 'function' &&
                          'isSorted' in col &&
                          'isSortedDesc' in col
                        );
                      };
                      const column = columnUnknown as {
                        getHeaderProps: (props?: object) => object;
                        id: string | number;
                        render: (type: string) => React.ReactNode;
                      };
                      let sortProps: object | undefined = undefined;
                      if (hasSortProps(columnUnknown)) {
                        sortProps = (columnUnknown as { getSortByToggleProps: () => object }).getSortByToggleProps();
                      }
                      let isSorted = false;
                      let isSortedDesc = false;
                      if (hasSortProps(columnUnknown)) {
                        isSorted = (columnUnknown as { isSorted: boolean }).isSorted;
                        isSortedDesc = (columnUnknown as { isSortedDesc: boolean }).isSortedDesc;
                      }
                      return (
                        <th
                          {...column.getHeaderProps(sortProps)}
                          className="p-3 border-b cursor-pointer text-black bg-white text-lg font-semibold"
                          key={String(column.id)}
                        >
                          {column.render('Header')}
                          <span>
                            {isSorted ? (isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                );
              })}
            </thead>
            <tbody {...getTableBodyProps()}>
              {(rows as unknown[]).map((rowUnknown) => {
                // type guard for row
                if (
                  typeof rowUnknown !== 'object' ||
                  rowUnknown === null ||
                  !('getRowProps' in rowUnknown) ||
                  !('id' in rowUnknown) ||
                  !('cells' in rowUnknown) ||
                  !('original' in rowUnknown)
                ) {
                  return null;
                }
                const row = rowUnknown as {
                  getRowProps: () => object;
                  id: string | number;
                  cells: unknown[];
                  original: unknown;
                };
                // prepareRow expects a specific type, but we avoid 'any' by using unknown and type assertion to unknown first
                prepareRow(row as unknown);
                return (
                  <tr {...row.getRowProps()} key={String(row.id)}>
                    {row.cells.map((cellUnknown) => {
                      // type guard for cell
                      if (
                        typeof cellUnknown !== 'object' ||
                        cellUnknown === null ||
                        !('getCellProps' in cellUnknown) ||
                        !('column' in cellUnknown) ||
                        !('render' in cellUnknown)
                      ) {
                        return null;
                      }
                      const cell = cellUnknown as {
                        getCellProps: () => object;
                        column: { id: string | number };
                        render: (type: string) => React.ReactNode;
                      };
                      return (
                        <td {...cell.getCellProps()} className="p-2 border-b text-center text-black text-base" key={String(cell.column.id)}>
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500 text-center py-8">Start typing to search for students by name, class, or persona. No data is shown until you search.</div>
      )}
    </div>
  );
};

export default StudentTable;
