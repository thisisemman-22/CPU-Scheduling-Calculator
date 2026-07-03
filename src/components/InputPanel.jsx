import React, { useState } from 'react';

const InputPanel = ({ processes, setProcesses, onCalculate, onClear }) => {
  const [at, setAt] = useState('');
  const [bt, setBt] = useState('');
  const [priority, setPriority] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (at === '' || bt === '') return;
    
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

  return (
    <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-neon-violet">Add Process</h2>
      
      <form onSubmit={handleAdd} className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Arrival Time (AT)</label>
          <input type="number" min="0" required value={at} onChange={e => setAt(e.target.value)}
            className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm focus:border-neon-violet focus:outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Burst Time (BT)</label>
          <input type="number" min="1" required value={bt} onChange={e => setBt(e.target.value)}
            className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm focus:border-neon-violet focus:outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Priority (Lower = Higher Prio)</label>
          <input type="number" min="1" value={priority} onChange={e => setPriority(e.target.value)}
            className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm focus:border-neon-violet focus:outline-none transition-colors" />
        </div>
        
        <button type="submit" className="mt-2 bg-neon-violet hover:bg-violet-600 text-white font-medium py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(139,92,246,0.3)]">
          Add Process
        </button>
      </form>

      <div className="flex-grow overflow-auto">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Ready Queue</h3>
        {processes.length === 0 ? (
          <div className="text-xs text-gray-500 text-center py-4 border border-dashed border-dark-700 rounded-lg">No processes added.</div>
        ) : (
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-500 bg-dark-900">
              <tr>
                <th className="px-2 py-2 rounded-tl-lg">ID</th>
                <th className="px-2 py-2">AT</th>
                <th className="px-2 py-2">BT</th>
                <th className="px-2 py-2 rounded-tr-lg">Prio</th>
              </tr>
            </thead>
            <tbody>
              {processes.map(p => (
                <tr key={p.id} className="border-b border-dark-700 hover:bg-dark-700/50">
                  <td className="px-2 py-2 font-medium text-white">{p.id}</td>
                  <td className="px-2 py-2">{p.at}</td>
                  <td className="px-2 py-2">{p.bt}</td>
                  <td className="px-2 py-2">{p.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={onCalculate} disabled={processes.length === 0} 
          className="flex-1 bg-neon-emerald hover:bg-emerald-600 disabled:bg-dark-700 disabled:text-gray-500 disabled:shadow-none text-white font-medium py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          Calculate
        </button>
        <button onClick={onClear} disabled={processes.length === 0}
          className="flex-1 bg-dark-900 border border-dark-700 hover:bg-red-900/30 hover:border-red-500/50 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-colors">
          Clear All
        </button>
      </div>
    </div>
  );
};

export default InputPanel;
