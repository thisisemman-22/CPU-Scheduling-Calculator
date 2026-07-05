import React, { useState } from 'react';
import { motion } from 'framer-motion';

const COLORS = [
  { bg: 'rgba(59,130,246,0.15)',  border: '#3b82f6', text: '#93c5fd', label: 'blue' },
  { bg: 'rgba(16,185,129,0.15)',  border: '#10b981', text: '#6ee7b7', label: 'emerald' },
  { bg: 'rgba(139,92,246,0.15)',  border: '#8b5cf6', text: '#c4b5fd', label: 'violet' },
  { bg: 'rgba(245,158,11,0.15)',  border: '#f59e0b', text: '#fcd34d', label: 'amber' },
  { bg: 'rgba(236,72,153,0.15)',  border: '#ec4899', text: '#f9a8d4', label: 'pink' },
  { bg: 'rgba(6,182,212,0.15)',   border: '#06b6d4', text: '#67e8f9', label: 'cyan' },
  { bg: 'rgba(244,63,94,0.15)',   border: '#f43f5e', text: '#fda4af', label: 'rose' },
  { bg: 'rgba(20,184,166,0.15)',  border: '#14b8a6', text: '#5eead4', label: 'teal' },
];

const getColor = (id) => {
  if (id === 'Idle') return null;
  const num = parseInt(id.replace('P', ''));
  return COLORS[(num - 1) % COLORS.length];
};

const GanttChart = ({ gantt }) => {
  if (!gantt || gantt.length === 0) return null;

  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Non-linear scaling
  const blocks = gantt.map(block => {
    const duration = block.end - block.start;
    const weight = duration === 0 ? 0 : Math.max(3, Math.pow(duration, 0.6));
    return { ...block, duration, weight };
  });
  const totalWeight = blocks.reduce((acc, b) => acc + b.weight, 0);

  let runningLeft = 0;
  const visual = blocks.map(b => {
    const widthPct = (b.weight / totalWeight) * 100;
    const out = { ...b, widthPct, leftPct: runningLeft, rightPct: runningLeft + widthPct };
    runningLeft += widthPct;
    return out;
  });

  // Time markers (deduplicated)
  const timeMarkers = [{ time: 0, pct: 0 }];
  visual.forEach(b => {
    const last = timeMarkers[timeMarkers.length - 1];
    if (b.end !== last.time) timeMarkers.push({ time: b.end, pct: b.rightPct });
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
  };
  const blockVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    show: { scaleX: 1, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 18 } },
  };

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6">
      <h2 className="text-[15px] font-semibold text-[var(--text-primary)] mb-5">Execution Timeline</h2>

      {/* Chart area — NO overflow-hidden here so tooltips are visible */}
      <div className="relative pb-2 pt-8">

        {/* Tooltip layer (rendered above the track) */}
        {hoveredIdx !== null && (() => {
          const block = visual[hoveredIdx];
          const centerPct = block.leftPct + block.widthPct / 2;
          return (
            <div
              className="absolute z-30 pointer-events-none"
              style={{ left: `${centerPct}%`, top: 0, transform: 'translateX(-50%)' }}
            >
              <div className="bg-[var(--bg-elevated)] text-[var(--text-primary)] text-[11px] font-mono px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] shadow-xl whitespace-nowrap">
                {block.id} · {block.start}–{block.end} ({block.duration}ms)
              </div>
            </div>
          );
        })()}

        {/* Track */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex w-full h-12 rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-input)]"
        >
          {visual.map((block, i) => {
            const color = getColor(block.id);
            const isIdle = block.id === 'Idle';

            return (
              <motion.div
                key={i}
                variants={blockVariants}
                style={{
                  width: `${block.widthPct}%`,
                  transformOrigin: 'left',
                  backgroundColor: isIdle ? 'transparent' : color.bg,
                  borderTopWidth: '2px',
                  borderTopStyle: 'solid',
                  borderTopColor: isIdle ? 'var(--text-muted)' : color.border,
                  color: isIdle ? 'var(--text-muted)' : color.text,
                }}
                className={`h-full flex items-center justify-center font-mono text-[12px] font-medium border-r border-black/10 last:border-r-0 cursor-default transition-[filter] duration-150 hover:brightness-[1.3] ${isIdle ? 'idle-stripe' : ''}`}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {block.widthPct > 4.5 ? block.id : ''}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Time markers */}
        <div className="relative w-full h-6 mt-1">
          {timeMarkers.map((marker, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${marker.pct}%` }}
            >
              <div className="w-px h-1.5 bg-[var(--border-subtle)]" />
              <span className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">{marker.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
