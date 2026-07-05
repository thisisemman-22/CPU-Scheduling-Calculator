import React from 'react';

const Header = ({ algorithm, setAlgorithm, timeQuantum, setTimeQuantum }) => {
  return (
    <header className="flex items-center justify-between p-6 bg-zinc-950 border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 bg-zinc-100 rounded-[3px] flex items-center justify-center shadow-sm">
          <div className="w-2 h-2 bg-zinc-950 rounded-[1px]" />
        </div>
        <h1 className="text-sm font-semibold tracking-tight text-zinc-100">
          CPU Scheduler
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <select 
          className="bg-zinc-900 border border-white/10 rounded-md px-3 py-1.5 text-xs font-medium text-zinc-300 focus:outline-none focus:border-zinc-500 transition-colors shadow-sm cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%23a1a1aa%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22M4.646%206.646a.5.5%200%200%201%20.708%200L8%209.293l2.646-2.647a.5.5%200%200%201%20.708.708l-3%203a.5.5%200%200%201-.708%200l-3-3a.5.5%200%200%201%200-.708z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.5rem_center]"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="FCFS">First-Come, First-Serve</option>
          <option value="SJF">Shortest Job First (NP)</option>
          <option value="SRTF">Shortest Remaining Time (P)</option>
          <option value="PriorityNP">Priority (NP)</option>
          <option value="PriorityP">Priority (P)</option>
          <option value="RR">Round Robin</option>
        </select>
        
        {algorithm === 'RR' && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">TQ</span>
            <input 
              type="number" 
              min="1" 
              className="bg-zinc-900 border border-white/10 rounded-md px-2 py-1.5 w-14 text-xs font-mono text-zinc-300 focus:outline-none focus:border-zinc-500 transition-colors shadow-sm text-center"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
