import React from "react";

type Column<T> = {
  key: string;
  title: string;
  width?: string;
  sortable?: boolean; // reserved for future
  render?: (row: T, index: number) => React.ReactNode;
};

type TableProps<T> = {
  columns?: Column<T>[];
  data?: T[];
  rowKey?: (row: T, index: number) => string;
  empty?: React.ReactNode;
  className?: string;
  children?: React.ReactNode; // allow composed API (children)
};

/**
 * Table supports two usage patterns:
 * 1) Composed API (children): <Table><TableHeader>...<TableBody>...</Table>
 * 2) Programmatic API (columns + data): <Table columns={...} data={...} />
 *
 * The page.tsx uses the composed API, so children must be accepted.
 */
export function Table<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  empty = <div style={{ padding: 16 }}>No rows</div>,
  className,
  children,
}: TableProps<T>): JSX.Element {
  // If children are provided, render them directly (composed API)
  if (children) {
    return (
      <div style={{ width: "100%", overflowX: "auto" }} className={className}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "inherit",
          }}
        >
          {children}
        </table>
      </div>
    );
  }

  // Fallback to programmatic API (columns + data)
  const cols = columns || [];
  const rows = data || [];

  return (
    <div style={{ width: "100%", overflowX: "auto" }} className={className}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "inherit",
        }}
      >
        <thead>
          <tr>
            {cols.map(col => (
              <th
                key={col.key}
                style={{
                  textAlign: "left",
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--bo-border, rgba(0,0,0,0.08))",
                  fontSize: 14,
                  color: "var(--bo-text, #333)",
                  width: col.width,
                }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={cols.length} style={{ padding: 16 }}>
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr
                key={rowKey ? rowKey(row, rowIndex) : rowIndex}
                style={{ borderBottom: "1px solid var(--bo-border, rgba(0,0,0,0.04))" }}
              >
                {cols.map(col => (
                  <td
                    key={col.key}
                    style={{
                      padding: "12px 16px",
                      verticalAlign: "top",
                      fontSize: 14,
                      color: "var(--bo-text-muted, #444)",
                    }}
                  >
                    {col.render ? col.render(row, rowIndex) : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Small, composable primitives compatible with imports:
// import Table, { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, ...props }) => (
  <thead {...props}>{children}</thead>
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ children, style, ...props }) => (
  <th
    {...props}
    style={{
      textAlign: "left",
      padding: "12px 16px",
      borderBottom: "1px solid var(--bo-border, rgba(0,0,0,0.08))",
      fontSize: 14,
      color: "var(--bo-text, #333)",
      ...style,
    }}
  >
    {children}
  </th>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, ...props }) => (
  <tbody {...props}>{children}</tbody>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ children, style, ...props }) => (
  <tr {...props} style={{ borderBottom: "1px solid var(--bo-border, rgba(0,0,0,0.04))", ...style }}>
    {children}
  </tr>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, style, ...props }) => (
  <td {...props} style={{ padding: "12px 16px", verticalAlign: "top", fontSize: 14, color: "#444", ...style }}>
    {children}
  </td>
);

export default Table;
