// src/components/StudentTable.tsx
import React, { useMemo } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";

// Minimal local types to satisfy TypeScript and ESLint
type LocalHeaderGroup = {
  id: string;
  headers: LocalColumn[];
  getHeaderGroupProps: () => Record<string, unknown>;
};
type LocalColumn = {
  id: string;
  getHeaderProps: (props?: Record<string, unknown>) => Record<string, unknown>;
  getSortByToggleProps?: () => Record<string, unknown>;
  render: (type: string) => React.ReactNode;
  isSorted?: boolean;
  isSortedDesc?: boolean;
};
type LocalRow = {
  id: string;
  getRowProps: () => Record<string, unknown>;
  cells: LocalCell[];
};
type LocalCell = {
  column: { id: string };
  getCellProps: () => Record<string, unknown>;
  render: (type: string) => React.ReactNode;
};

type Student = {
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
};

interface StudentTableProps {
  data: Student[];
}

const StudentTable: React.FC<StudentTableProps> = ({ data }) => {
  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "student_id" },
      { Header: "Name", accessor: "name" },
      { Header: "Class", accessor: "class" },
      { Header: "Comprehension", accessor: "comprehension" },
      { Header: "Attention", accessor: "attention" },
      { Header: "Focus", accessor: "focus" },
      { Header: "Retention", accessor: "retention" },
      { Header: "Engagement Time", accessor: "engagement_time" },
      { Header: "Assessment Score", accessor: "assessment_score" },
      { Header: "Persona", accessor: "persona" },
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
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy
  );

  const hasQuery = (state.globalFilter || "").trim().length > 0;

  return (
    <div className="overflow-x-auto">
      <input
        value={state.globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search students..."
        className="mb-4 px-3 py-2 border rounded-md w-full text-black"
      />
      <table
        {...getTableProps()}
        className="min-w-full bg-white border border-gray-300"
      >
        <thead>
          {headerGroups.map((headerGroup: LocalHeaderGroup, headerGroupIdx: number) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={headerGroup.id || headerGroupIdx}
            >
              {headerGroup.headers.map((column: LocalColumn, columnIdx: number) => {
                const sortProps = column.getSortByToggleProps
                  ? column.getSortByToggleProps()
                  : {};
                return (
                  <th
                    {...column.getHeaderProps(sortProps)}
                    key={column.id || columnIdx}
                    className="px-4 py-2 border-b bg-gray-100 text-left font-medium text-gray-700"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.length > 0 ? (
            rows.map((row: LocalRow, rowIdx: number) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id || rowIdx}>
                  {row.cells.map((cell: LocalCell, cellIdx: number) => (
                    <td
                      {...cell.getCellProps()}
                      key={cell.column.id || cellIdx}
                      className="px-4 py-2 border-b text-gray-600"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-gray-500"
              >
                {hasQuery ? "No matching students found" : "No students"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
