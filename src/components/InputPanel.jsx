import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Check } from 'lucide-react';

const InputPanel = ({ processes, setProcesses, onCalculate, onClear }) => {
  const [at, setAt] = useState('');
  const [bt, setBt] = useState('');
  const [priority, setPriority] = useState('');
  const [errors, setErrors] = useState({ at: false, bt: false });

  // Tracks which cell is being edited: { index, field } or null
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Re-number all process IDs sequentially from their array index
  const renumber = (list) => list.map((p, i) => ({ ...p, id: `P${i + 1}` }));

  const handleAdd = (e) => {
    e.preventDefault();
    let hasError = false;
    const newErrors = { at: false, bt: false };
    if (at === '' || parseInt(at) < 0 || isNaN(parseInt(at))) { newErrors.at = true; hasError = true; }
    if (bt === '' || parseInt(bt) <= 0 || isNaN(parseInt(bt))) { newErrors.bt = true; hasError = true; }
    if (hasError) {
      setErrors(newErrors);
      setTimeout(() => setErrors({ at: false, bt: false }), 400);
      return;
    }
    const newProcess = {
      id: `P${processes.length + 1}`,
      at: parseInt(at),
      bt: parseInt(bt),
      priority: priority === '' ? 1 : parseInt(priority),
    };
    setProcesses([...processes, newProcess]);
    setAt(''); setBt(''); setPriority('');
  };

  const removeProcess = (index) => {
    const updated = [...processes];
    updated.splice(index, 1);
    setProcesses(renumber(updated));
    setEditing(null);
  };

  // Inline editing handlers
  const startEdit = (index, field, currentValue) => {
    setEditing({ index, field });
    setEditValue(String(currentValue));
  };

  const commitEdit = () => {
    if (!editing) return;
    const { index, field } = editing;
    const val = parseInt(editValue);

    // Validate
    if (isNaN(val)) { setEditing(null); return; }
    if (field === 'at' && val < 0) { setEditing(null); return; }
    if (field === 'bt' && val <= 0) { setEditing(null); return; }
    if (field === 'priority' && val < 1) { setEditing(null); return; }

    const updated = [...processes];
    updated[index] = { ...updated[index], [field]: val };
    setProcesses(updated);
    setEditing(null);
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') setEditing(null);
  };

  const inputCls = (hasErr) =>
    `w-full h-9 rounded-lg border bg-[var(--bg-input)] px-3 text-[13px] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all shadow-sm ${
      hasErr ? 'border-red-500/60 shake focus:ring-1 focus:ring-red-500/40' : 'border-[var(--border-input)] hover:border-[var(--border-input-hover)] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'
    }`;

  // Renders a table cell — either static (clickable to edit) or an inline input
  const EditableCell = ({ index, field, value, isMuted }) => {
    const isEditing = editing && editing.index === index && editing.field === field;

    if (isEditing) {
      return (
        <td className="py-1.5 pr-1">
          <div className="flex items-center gap-1">
            <input
              type="number"
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyDown}
              onBlur={commitEdit}
              className="w-full h-7 rounded-md border border-indigo-500 bg-[var(--bg-input)] px-2 text-[12px] font-mono text-[var(--text-primary)] outline-none ring-1 ring-indigo-500/50"
            />
          </div>
        </td>
      );
    }

    return (
      <td
        className={`py-2.5 font-mono cursor-pointer rounded transition-colors hover:bg-white/[0.04] ${isMuted ? 'text-[var(--text-muted)]' : 'text-[var(--text-secondary)]'}`}
        onClick={() => startEdit(index, field, value)}
        title="Click to edit"
      >
        {value}
      </td>
    );
  };

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Add Process */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5">
        <h2 className="text-[15px] font-semibold text-[var(--text-primary)] mb-4">Add Process</h2>
        <form onSubmit={handleAdd} className="flex flex-col gap-3.5">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">Arrival Time</label>
              <input type="number" value={at} onChange={e => setAt(e.target.value)} className={inputCls(errors.at).replace('h-9','h-10')} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">Burst Time</label>
              <input type="number" value={bt} onChange={e => setBt(e.target.value)} className={inputCls(errors.bt).replace('h-9','h-10')} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">Priority</label>
              <input type="number" value={priority} onChange={e => setPriority(e.target.value)} className={inputCls(false).replace('h-9','h-10')} />
            </div>
          </div>
          <button type="submit" className="h-10 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-[13px] font-medium transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-500/20">
            <Plus size={15} strokeWidth={2.5} />
            Add Process
          </button>
        </form>
      </div>

      {/* Ready Queue */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">Ready Queue</h2>
          <span className="text-[11px] font-mono text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2 py-0.5 rounded-md border border-[var(--border-subtle)]">{processes.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {processes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-[var(--text-muted)] text-[13px]">
              <div className="w-10 h-10 rounded-xl border border-dashed border-[var(--border-subtle)] mb-3 flex items-center justify-center">
                <Plus size={16} className="text-[var(--text-muted)]" />
              </div>
              No processes yet
            </div>
          ) : (
            <>
              <p className="text-[11px] text-[var(--text-muted)] mb-2">Click a value to edit it</p>
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider pb-2.5 text-left">ID</th>
                    <th className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider pb-2.5 text-left">AT</th>
                    <th className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider pb-2.5 text-left">BT</th>
                    <th className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider pb-2.5 text-left">Prio</th>
                    <th className="pb-2.5 w-7"></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {processes.map((p, idx) => (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -12, transition: { duration: 0.15 } }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="border-b border-[var(--border-subtle)] group"
                      >
                        <td className="py-2.5 text-[var(--text-primary)] font-medium">{p.id}</td>
                        <EditableCell index={idx} field="at" value={p.at} />
                        <EditableCell index={idx} field="bt" value={p.bt} />
                        <EditableCell index={idx} field="priority" value={p.priority} isMuted />
                        <td className="py-2.5 text-right">
                          <button onClick={() => removeProcess(idx)} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-red-400 p-0.5 rounded hover:bg-red-500/10">
                            <X size={13} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex gap-2.5">
          <button onClick={onCalculate} disabled={processes.length === 0}
            className="flex-1 h-9 rounded-lg bg-[var(--text-primary)] text-[var(--bg-app)] text-[13px] font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-30 disabled:pointer-events-none shadow-sm">
            Calculate
          </button>
          <button onClick={onClear} disabled={processes.length === 0}
            className="h-9 px-3.5 rounded-lg border border-[var(--border-subtle)] bg-transparent text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04] transition-all disabled:opacity-30 disabled:pointer-events-none">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;
