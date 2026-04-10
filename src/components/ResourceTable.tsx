export interface Column {
  key: string;
  label: string;
}

interface Props {
  columns: Column[];
  rows: Record<string, string>[];
  loading: boolean;
}

export default function ResourceTable({ columns, rows, loading }: Props) {
  if (loading) {
    return <p className="py-12 text-center text-sm text-zinc-500">Loading…</p>;
  }

  if (rows.length === 0) {
    return <p className="py-12 text-center text-sm text-zinc-500">No rows</p>;
  }

  return (
    <table className="w-full text-sm text-left">
      <thead>
        <tr className="border-b border-zinc-800">
          {columns.map((col) => (
            <th
              key={col.key}
              className="px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider"
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={JSON.stringify(row)}
            className="border-b border-zinc-800/50 hover:bg-zinc-800/40 transition-colors"
          >
            {columns.map((col) => (
              <td
                key={col.key}
                className="px-4 py-3 font-mono text-zinc-200 text-xs"
              >
                {row[col.key] ?? "—"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
