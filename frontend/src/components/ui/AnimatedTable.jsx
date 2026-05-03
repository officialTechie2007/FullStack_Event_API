import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import { tableRowVariants } from '../../utils/motion';

const AnimatedTable = ({ columns, data, emptyMessage = 'No data found', actions }) => {
  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--surface-glass)] py-14 text-center"
      >
        <Inbox className="mb-3 h-10 w-10 text-[var(--text-muted)]" />
        <p className="text-[var(--text-muted)]">{emptyMessage}</p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--surface-glass)] shadow-[var(--shadow-card)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-[var(--surface-hover)]">
              {columns.map((col, i) => (
                <th key={i} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                  {col.header}
                </th>
              ))}
              {actions && <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">Actions</th>}
            </tr>
          </thead>
          <motion.tbody initial="initial" animate="animate" className="divide-y divide-[var(--border-color)]">
            {data.map((row, rowIndex) => (
              <motion.tr
                key={row.id || row.ID || row.registration_id || rowIndex}
                custom={rowIndex}
                variants={tableRowVariants}
                className="group transition-colors hover:bg-[var(--surface-hover)]"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="whitespace-nowrap px-5 py-4 text-sm text-[var(--text-primary)]">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
                {actions && (
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">{actions(row)}</div>
                  </td>
                )}
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};

export default AnimatedTable;
