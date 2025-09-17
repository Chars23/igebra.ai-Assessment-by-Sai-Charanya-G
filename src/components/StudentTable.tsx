import React from "react";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  HeaderGroup,
  Row,
  Cell,
  Column as TableColumn, // ✅ Rename import to avoid conflict
} from "react-table";

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
  const columns = React.useMemo<TableColumn<Student>[]>(
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
  } = useTable<Student>({ columns, data }, useGlobalFilter, useSortBy);

  const hasQuery = (state.globalFilter || "").trim().length > 0;

  return (
    <div>
      <input
        className="mb-4 p-2 border-2 border-black rounded-lg w-full focus:ring-2 focus:ring-black/30 outline-none text-black bg-white"
        value={state.globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search by name, class, or persona..."
      />
      {hasQuery ? (
        <div className="overflow-x-auto">
          <table
            {...getTableProps()}
            className="min-w-full bg-white rounded-xl shadow-card border border-gray-200"
          >
            <thead>
              {headerGroups.map((headerGroup: HeaderGroup<Student>, idx) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                  {headerGroup.headers.map((column, colIdx) => {
                    const sortProps = column.getSortByToggleProps
                      ? column.getSortByToggleProps()
                      : {};
                    return (
                      <th
                        {...column.getHeaderProps(sortProps)}
                        className="p-3 border-b cursor-pointer text-black bg-white text-lg font-semibold"
                        key={colIdx}
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
              {rows.map((row: Row<Student>, rowIdx) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={rowIdx}>
                    {row.cells.map((cell: Cell<Student>, cellIdx) => (
                      <td
                        {...cell.getCellProps()}
                        className="p-2 border-b text-center text-black text-base"
                        key={cellIdx}
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500 text-center py-8">
          Start typing to search for students...
        </div>
      )}
    </div>
  );
};

export default StudentTable;
