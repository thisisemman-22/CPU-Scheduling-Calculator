import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileSpreadsheet } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const OutputTable = ({ metrics, exportRef }) => {
  const processList = Object.values(metrics);

  if (processList.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 h-full flex flex-col items-center justify-center min-h-[360px]">
        <div className="w-14 h-14 rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-elevated)] mb-4 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-muted)]">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M3 9h18M3 15h18M9 3v18M15 3v18" opacity="0.3"/>
          </svg>
        </div>
        <p className="text-[14px] font-medium text-[var(--text-secondary)]">No results yet</p>
        <p className="text-[13px] text-[var(--text-muted)] mt-1">Add processes and hit Calculate.</p>
      </div>
    );
  }

  const sorted = [...processList].sort((a, b) => parseInt(a.id.substring(1)) - parseInt(b.id.substring(1)));
  const avgTAT = processList.reduce((acc, p) => acc + p.tat, 0) / processList.length;
  const avgWT = processList.reduce((acc, p) => acc + p.wt, 0) / processList.length;

  const handleExportCSV = () => {
    let csv = "Process,Arrival,Burst,Priority,Start,End Time,Turnaround,Waiting\n";
    sorted.forEach(p => { csv += `${p.id},${p.at},${p.bt},${p.priority},${p.st},${p.ct},${p.tat},${p.wt}\n`; });
    csv += `\nAvg Turnaround,${avgTAT.toFixed(2)}\nAvg Waiting,${avgWT.toFixed(2)}\n`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'cpu_scheduling_results.csv'; a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    if (!exportRef?.current) return;
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-app').trim() || '#0c0c0f';
    const canvas = await html2canvas(exportRef.current, { backgroundColor: bgColor, scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('cpu_scheduling_report.pdf');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
  };
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 flex flex-col">
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">Execution Metrics</h2>
        <div className="flex gap-1.5">
          <button onClick={handleExportCSV} className="h-7 px-2.5 rounded-md border border-[var(--border-subtle)] bg-transparent text-[12px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.04] transition-all flex items-center gap-1.5">
            <FileSpreadsheet size={13} /> CSV
          </button>
          <button onClick={handleExportPDF} className="h-7 px-2.5 rounded-md border border-[var(--border-subtle)] bg-transparent text-[12px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.04] transition-all flex items-center gap-1.5">
            <Download size={13} /> PDF
          </button>
        </div>
      </div>

      {/* Metric highlight cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-xl bg-gradient-to-br from-indigo-500/[0.08] to-violet-500/[0.04] border border-indigo-500/15 p-4">
          <p className="text-[11px] font-medium text-indigo-300/60 uppercase tracking-wide mb-1">Avg. Turnaround</p>
          <p className="text-[22px] font-mono font-semibold text-indigo-400">{avgTAT.toFixed(2)} <span className="text-[12px] font-normal text-indigo-400/40">ms</span></p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-violet-500/[0.08] to-pink-500/[0.04] border border-violet-500/15 p-4">
          <p className="text-[11px] font-medium text-violet-300/60 uppercase tracking-wide mb-1">Avg. Waiting</p>
          <p className="text-[22px] font-mono font-semibold text-violet-400">{avgWT.toFixed(2)} <span className="text-[12px] font-normal text-violet-400/40">ms</span></p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-subtle)]">
              <th className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider pb-3 text-left">ID</th>
              <th className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider pb-3 text-left">AT</th>
              <th className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider pb-3 text-left">BT</th>
              <th className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider pb-3 text-left">Prio</th>
              <th className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider pb-3 text-left">ST</th>
              <th className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider pb-3 text-left">ET</th>
              <th className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider pb-3 text-left">TAT</th>
              <th className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider pb-3 text-left">WT</th>
            </tr>
          </thead>
          <motion.tbody variants={containerVariants} initial="hidden" animate="show">
            {sorted.map(p => (
              <motion.tr key={p.id} variants={rowVariants} className="border-b border-[var(--border-subtle)] hover:bg-white/[0.02] transition-colors">
                <td className="py-3 text-[var(--text-primary)] font-medium">{p.id}</td>
                <td className="py-3 font-mono text-[var(--text-secondary)]">{p.at}</td>
                <td className="py-3 font-mono text-[var(--text-secondary)]">{p.bt}</td>
                <td className="py-3 font-mono text-[var(--text-muted)]">{p.priority}</td>
                <td className="py-3 font-mono text-[var(--text-secondary)]">{p.st}</td>
                <td className="py-3 font-mono text-[var(--text-secondary)]">{p.ct}</td>
                <td className="py-3 font-mono font-medium text-[var(--text-primary)]">{p.tat}</td>
                <td className="py-3 font-mono font-medium text-[var(--text-primary)]">{p.wt}</td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};

export default OutputTable;
