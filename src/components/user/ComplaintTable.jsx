// components/ComplaintTable.jsx
import React from "react";

const ComplaintTable = ({
  columns = [],
  rows = [],
  emptyMessage = "No data.",
  onRowClick,
}) => {
  return (
    <div className="w-full lg:px-4 xl:px-7">
      {/* Scroll only below lg */}
      <div className="overflow-x-scroll md:overflow-x-auto px-2 md:px-0">
        <table className="w-full border-collapse text-lg md:text-lg whitespace-nowrap min-w-full md:min-w-[700px]">
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
              rows.map((row) => (
                <tr
                  key={row.complaintId}
                  className="border-b border-gray-300 transition-all text-center cursor-pointer"
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

export default ComplaintTable;
