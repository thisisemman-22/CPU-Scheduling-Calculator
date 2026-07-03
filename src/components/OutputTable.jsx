import React from 'react';

const OutputTable = ({ metrics }) => {
  const processList = Object.values(metrics);
  
  if (processList.length === 0) {
    return (
      <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 h-full flex items-center justify-center text-gray-500">
        Run calculation to see metrics and output.
      </div>
    );
  }

  const avgTAT = processList.reduce((acc, p) => acc + p.tat, 0) / processList.length;
  const avgWT = processList.reduce((acc, p) => acc + p.wt, 0) / processList.length;

  return (
    <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-neon-cyan">Output & Metrics</h2>
      
      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-dark-900 border border-dark-700 p-4 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-neon-amber"></div>
          <p className="text-xs text-gray-400 mb-1">Avg Turnaround Time</p>
          <p className="text-2xl font-bold text-white">{avgTAT.toFixed(2)} <span className="text-sm font-normal text-gray-500">ms</span></p>
        </div>
        <div className="flex-1 bg-dark-900 border border-dark-700 p-4 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-neon-pink"></div>
          <p className="text-xs text-gray-400 mb-1">Avg Waiting Time</p>
          <p className="text-2xl font-bold text-white">{avgWT.toFixed(2)} <span className="text-sm font-normal text-gray-500">ms</span></p>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-500 bg-dark-900">
            <tr>
              <th className="px-3 py-3 rounded-tl-lg">ID</th>
              <th className="px-3 py-3">AT</th>
              <th className="px-3 py-3">BT</th>
              <th className="px-3 py-3">Prio</th>
              <th className="px-3 py-3">ST</th>
              <th className="px-3 py-3">CT</th>
              <th className="px-3 py-3">TAT</th>
              <th className="px-3 py-3 rounded-tr-lg">WT</th>
            </tr>
          </thead>
          <tbody>
            {processList.sort((a,b) => parseInt(a.id.substring(1)) - parseInt(b.id.substring(1))).map(p => (
              <tr key={p.id} className="border-b border-dark-700 hover:bg-dark-700/50">
                <td className="px-3 py-3 font-medium text-white">{p.id}</td>
                <td className="px-3 py-3">{p.at}</td>
                <td className="px-3 py-3">{p.bt}</td>
                <td className="px-3 py-3">{p.priority}</td>
                <td className="px-3 py-3 text-neon-emerald">{p.st}</td>
                <td className="px-3 py-3 text-neon-cyan">{p.ct}</td>
                <td className="px-3 py-3 text-neon-amber font-medium">{p.tat}</td>
                <td className="px-3 py-3 text-neon-pink font-medium">{p.wt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OutputTable;
