import React from 'react';
import { motion } from 'framer-motion';

const getBlockStyle = (id) => {
  if (id === 'Idle') return 'bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cGF0aCBkPSJNMCA0TDQgMFpNMCAwTDAgMFpNNCA0TDQgNFoiIHN0cm9rZT0iIzMyMzIzOCIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==")] bg-zinc-900 border-t-zinc-700 text-zinc-500';
  
  const styles = [
    'bg-zinc-800 border-t-emerald-500 text-zinc-300',
    'bg-zinc-800 border-t-cyan-500 text-zinc-300',
    'bg-zinc-800 border-t-violet-500 text-zinc-300',
    'bg-zinc-800 border-t-pink-500 text-zinc-300',
    'bg-zinc-800 border-t-amber-500 text-zinc-300',
    'bg-zinc-800 border-t-blue-500 text-zinc-300',
  ];
  const num = parseInt(id.replace('P', ''));
  return styles[(num - 1) % styles.length];
};

const GanttChart = ({ gantt }) => {
  if (!gantt || gantt.length === 0) return null;

  // Non-linear scaling logic to prevent squashing
  const blocksWithWeight = gantt.map(block => {
    const duration = block.end - block.start;
    // Math.pow ensures larger values grow slower, base 3 ensures small values are visible
    const weight = duration === 0 ? 0 : Math.max(3, Math.pow(duration, 0.65));
    return { ...block, duration, weight };
  });

  const totalWeight = blocksWithWeight.reduce((acc, b) => acc + b.weight, 0);

  let currentLeft = 0;
  const visualBlocks = blocksWithWeight.map(b => {
    const widthPct = (b.weight / totalWeight) * 100;
    const block = { ...b, widthPct, startPct: currentLeft, endPct: currentLeft + widthPct };
    currentLeft += widthPct;
    return block;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scaleX: 0, transformOrigin: 'left' },
    show: { opacity: 1, scaleX: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-lg border border-white/5 shadow-sm mt-6">
      <h2 className="text-sm font-semibold text-zinc-100 mb-6">Execution Timeline</h2>
      
      <div className="relative pt-2 pb-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex w-full h-12 rounded-md overflow-hidden border border-white/10 bg-zinc-950"
        >
          {visualBlocks.map((block, i) => (
            <motion.div 
              variants={itemVariants}
              key={i} 
              className={`h-full flex items-center justify-center font-mono text-xs border-r border-zinc-900 last:border-r-0 border-t-2 ${getBlockStyle(block.id)} transition-colors hover:bg-zinc-700 relative group`}
              style={{ width: `${block.widthPct}%` }}
            >
              {block.widthPct > 4 ? block.id : ''}
              
              {/* Tooltip for small blocks */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-zinc-100 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 border border-white/10 shadow-lg">
                {block.id} ({block.start}-{block.end})
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="absolute left-0 w-full h-6 mt-2 flex">
          <div className="absolute transform -translate-x-1/2 text-[10px] font-mono text-zinc-500" style={{ left: '0%' }}>
            0
          </div>
          {visualBlocks.map((block, i) => (
            <div 
              key={i} 
              className="absolute transform -translate-x-1/2 text-[10px] font-mono text-zinc-500 mt-0.5" 
              style={{ left: `${block.endPct}%` }}
            >
              <div className="h-2 w-px bg-zinc-800 absolute -top-2.5 left-1/2 -translate-x-1/2" />
              {block.end}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
