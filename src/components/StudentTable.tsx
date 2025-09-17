// src/components/StudentTable.tsx
import React, { useMemo } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  type Column,
  type HeaderGroup,
  type ColumnInstance,
} from "react-table";

type Student = {
  student_id: string;
  name: string;
  email: string;
  course: string;
};

interface StudentTableProps {
  data: Student[];
}

const StudentTable: React.FC<StudentTableProps> = ({ data }) => {
  const columns: Column<Student>[] = useMemo(
    () => [
      { Header: "ID", accessor: "student_id" },
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      { Header: "Course", accessor: "course" },
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
  } = useTable<Student>(
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
        className="mb-4 px-3 py-2 border rounded-md w-full"
      />
      <table
        {...getTableProps()}
        className="min-w-full bg-white border border-gray-300"
      >
        <thead>
          {headerGroups.map(
            (headerGroup: HeaderGroup<Student>, headerGroupIdx: number) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                key={headerGroup.id || headerGroupIdx}
              >
                {headerGroup.headers.map(
                  (column: ColumnInstance<Student>, columnIdx: number) => (
                    <th
                      {...column.getHeaderProps(
                        column.getSortByToggleProps?.() ?? {}
                      )}
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
                  )
                )}
              </tr>
            )
          )}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.length > 0 ? (
            rows.map((row, rowIdx) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id || rowIdx}>
                  {row.cells.map((cell, cellIdx) => (
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
