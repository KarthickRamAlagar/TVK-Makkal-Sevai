import React from "react";
// for individual  district stats table
const DComplaintTable = ({
  columns = [],
  rows = [],
  emptyMessage = "No data.",
  onRowClick,
}) => {
  const sortedRows = [...rows].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="w-full lg:px-4 xl:px-7">
      <div className="overflow-x-scroll md:overflow-x-auto px-2 md:px-0">
        <table className="w-full border-collapse text-base md:text-lg whitespace-nowrap min-w-full md:min-w-[900px]">
          <thead>
            <tr className="text-red-600 font-extrabold tracking-normal text-lg text-center">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={col.thClassName || "py-5 px-6"}
                  onClick={col.onHeaderClick}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-10 text-center font-semibold md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-400"
                >
                  <span className="text-white">😟</span> {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-300 transition-all text-center cursor-pointer hover:bg-gray-50"
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={col.tdClassName || "py-5 px-6"}
                    >
                      {col.cell ? col.cell(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DComplaintTable;
