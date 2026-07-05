import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';

const InputPanel = ({ processes, setProcesses, onCalculate, onClear }) => {
  const [at, setAt] = useState('');
  const [bt, setBt] = useState('');
  const [priority, setPriority] = useState('');
  
  const [errors, setErrors] = useState({ at: false, bt: false });

  const handleAdd = (e) => {
    e.preventDefault();
    
    let hasError = false;
    const newErrors = { at: false, bt: false };

    if (at === '' || parseInt(at) < 0) {
      newErrors.at = true;
      hasError = true;
    }
    if (bt === '' || parseInt(bt) <= 0) {
      newErrors.bt = true;
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      setTimeout(() => setErrors({ at: false, bt: false }), 400);
      return;
    }
    
    const newId = `P${processes.length + 1}`;
    const newProcess = {
      id: newId,
      at: parseInt(at),
      bt: parseInt(bt),
      priority: priority === '' ? 1 : parseInt(priority)
    };
    
    setProcesses([...processes, newProcess]);
    setAt('');
    setBt('');
    setPriority('');
  };

  const removeProcess = (id) => {
    setProcesses(processes.filter(p => p.id !== id));
  };

  return (
    <div className="bg-zinc-900 p-5 rounded-lg border border-white/5 flex flex-col h-full shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-zinc-100">Add Process</h2>
      </div>
      
      <form onSubmit={handleAdd} className="flex flex-col gap-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-semibold text-zinc-500 mb-1.5">Arrival</label>
            <input type="number" value={at} onChange={e => setAt(e.target.value)}
              className={`w-full bg-zinc-950 border rounded-md px-2.5 py-1.5 text-sm font-mono text-zinc-200 focus:outline-none transition-colors ${errors.at ? 'border-red-500/50 shake' : 'border-white/10 focus:border-zinc-500'}`} placeholder="0" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-semibold text-zinc-500 mb-1.5">Burst</label>
            <input type="number" value={bt} onChange={e => setBt(e.target.value)}
              className={`w-full bg-zinc-950 border rounded-md px-2.5 py-1.5 text-sm font-mono text-zinc-200 focus:outline-none transition-colors ${errors.bt ? 'border-red-500/50 shake' : 'border-white/10 focus:border-zinc-500'}`} placeholder="1" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-semibold text-zinc-500 mb-1.5">Priority</label>
            <input type="number" value={priority} onChange={e => setPriority(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-md px-2.5 py-1.5 text-sm font-mono text-zinc-200 focus:border-zinc-500 focus:outline-none transition-colors" placeholder="1" />
          </div>
        </div>
        
        <button type="submit" className="mt-1 bg-zinc-100 hover:bg-white text-zinc-950 font-medium py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 text-sm shadow-sm">
          <Plus size={16} />
          Add to Queue
        </button>
      </form>

      <div className="flex-grow flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
          <h3 className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">Ready Queue</h3>
          <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">{processes.length}</span>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-1">
          {processes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-xs">
              <div className="w-8 h-8 rounded-full border border-dashed border-zinc-700 mb-2 flex items-center justify-center">
                <span className="text-zinc-700 block">+</span>
              </div>
              No processes added
            </div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="text-zinc-500 sticky top-0 bg-zinc-900 z-10">
                <tr>
                  <th className="py-2 font-medium">ID</th>
                  <th className="py-2 font-medium">AT</th>
                  <th className="py-2 font-medium">BT</th>
                  <th className="py-2 font-medium">Prio</th>
                  <th className="py-2 font-medium w-6"></th>
                </tr>
              </thead>
              <tbody className="font-mono text-zinc-300">
                <AnimatePresence>
                  {processes.map(p => (
                    <motion.tr 
                      key={p.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="border-b border-white/5 hover:bg-white/5 group"
                    >
                      <td className="py-2.5 font-sans font-medium text-zinc-100">{p.id}</td>
                      <td className="py-2.5">{p.at}</td>
                      <td className="py-2.5">{p.bt}</td>
                      <td className="py-2.5 text-zinc-500">{p.priority}</td>
                      <td className="py-2.5">
                        <button 
                          onClick={() => removeProcess(p.id)}
                          className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-white/5 flex gap-2">
        <button onClick={onCalculate} disabled={processes.length === 0} 
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-white/10 disabled:opacity-50 disabled:hover:bg-zinc-800 text-zinc-100 font-medium py-1.5 rounded-md transition-all text-sm flex items-center justify-center btn-glow">
          Calculate
        </button>
        <button onClick={onClear} disabled={processes.length === 0}
          className="px-3 bg-zinc-950 border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 disabled:opacity-50 text-zinc-400 font-medium py-1.5 rounded-md transition-colors text-sm flex items-center justify-center">
          Clear
        </button>
      </div>
    </div>
  );
};

export default InputPanel;
