import React from 'react';

const Header = ({ algorithm, setAlgorithm, timeQuantum, setTimeQuantum }) => {
  return (
    <header className="flex items-center justify-between p-6 bg-dark-800 border-b border-dark-700 shadow-sm">
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-emerald to-neon-cyan">
        CPU Scheduling Calculator
      </h1>
      <div className="flex items-center gap-4">
        <select 
          className="bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-cyan transition-colors"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="FCFS">First-Come, First-Serve (FCFS)</option>
          <option value="SJF">Shortest Job First (SJF - NP)</option>
          <option value="SRTF">Shortest Remaining Time First (SRTF - P)</option>
          <option value="PriorityNP">Priority (Non-Preemptive)</option>
          <option value="PriorityP">Priority (Preemptive)</option>
          <option value="RR">Round Robin (RR)</option>
        </select>
        
        {algorithm === 'RR' && (
          <div className="flex items-center gap-2 transition-all duration-300">
            <label className="text-sm text-gray-400">Time Quantum:</label>
            <input 
              type="number" 
              min="1" 
              className="bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 w-20 text-sm focus:outline-none focus:border-neon-amber transition-colors"
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
