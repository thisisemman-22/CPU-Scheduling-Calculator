import React from 'react';

const getColor = (id) => {
  if (id === 'Idle') return 'bg-gray-600';
  const colors = [
    'bg-emerald-500', 'bg-cyan-500', 'bg-violet-500', 'bg-pink-500', 
    'bg-amber-500', 'bg-blue-500', 'bg-red-500', 'bg-indigo-500'
  ];
  const num = parseInt(id.replace('P', ''));
  return colors[(num - 1) % colors.length];
};

const GanttChart = ({ gantt }) => {
  if (!gantt || gantt.length === 0) return null;

  const totalTime = gantt[gantt.length - 1].end;

  return (
    <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 mt-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-6 text-white">Gantt Chart</h2>
      
      <div className="relative pt-2 pb-8">
        <div className="flex w-full h-16 rounded-lg overflow-hidden shadow-lg border border-dark-700">
          {gantt.map((block, i) => {
            const widthPct = ((block.end - block.start) / totalTime) * 100;
            return (
              <div 
                key={i} 
                className={`h-full flex items-center justify-center font-bold text-white border-r border-dark-900 last:border-r-0 ${getColor(block.id)} transition-all hover:brightness-110`}
                style={{ width: `${widthPct}%` }}
                title={`${block.id} (${block.start} - ${block.end})`}
              >
                {widthPct > 3 ? block.id : ''}
              </div>
            );
          })}
        </div>
        
        <div className="absolute left-0 w-full h-6 mt-2 flex">
          <div className="absolute transform -translate-x-1/2 text-xs text-gray-400 font-medium" style={{ left: '0%' }}>
            0
          </div>
          {gantt.map((block, i) => {
            const leftPct = (block.end / totalTime) * 100;
            return (
              <div 
                key={i} 
                className="absolute transform -translate-x-1/2 text-xs text-gray-400 font-medium" 
                style={{ left: `${leftPct}%` }}
              >
                {block.end}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
