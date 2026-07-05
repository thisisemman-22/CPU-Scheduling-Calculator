import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const OutputTable = ({ metrics, exportRef }) => {
  const processList = Object.values(metrics);
  
  if (processList.length === 0) {
    return (
      <div className="bg-zinc-900 p-6 rounded-lg border border-white/5 h-full flex flex-col items-center justify-center text-zinc-500">
        <div className="w-12 h-12 rounded-full border border-dashed border-zinc-700 mb-4" />
        <p className="text-sm font-medium text-zinc-400">Awaiting Data</p>
        <p className="text-xs text-zinc-600 mt-1">Add processes and calculate to view metrics</p>
      </div>
    );
  }

  const avgTAT = processList.reduce((acc, p) => acc + p.tat, 0) / processList.length;
  const avgWT = processList.reduce((acc, p) => acc + p.wt, 0) / processList.length;

  const handleExportCSV = () => {
    let csv = "ID,AT,BT,Priority,ST,CT,TAT,WT\n";
    processList.sort((a,b) => parseInt(a.id.substring(1)) - parseInt(b.id.substring(1))).forEach(p => {
      csv += `${p.id},${p.at},${p.bt},${p.priority},${p.st},${p.ct},${p.tat},${p.wt}\n`;
    });
    csv += `\nAverage TAT,${avgTAT.toFixed(2)}\n`;
    csv += `Average WT,${avgWT.toFixed(2)}\n`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cpu_scheduling_metrics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    if (!exportRef.current) return;
    
    const canvas = await html2canvas(exportRef.current, {
      backgroundColor: '#09090b', // zinc-950
      scale: 2,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('cpu_scheduling_report.pdf');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-lg border border-white/5 h-full flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-zinc-100">Execution Metrics</h2>
        
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 p-1.5 rounded transition-colors" title="Export CSV">
            <FileText size={16} />
          </button>
          <button onClick={handleExportPDF} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 p-1.5 rounded transition-colors" title="Export PDF">
            <Download size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-zinc-950 border border-white/5 p-4 rounded-md">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 mb-1">Average Turnaround</p>
          <p className="text-xl font-mono text-zinc-100">{avgTAT.toFixed(2)} <span className="text-xs font-sans text-zinc-600">ms</span></p>
        </div>
        <div className="flex-1 bg-zinc-950 border border-white/5 p-4 rounded-md">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 mb-1">Average Waiting</p>
          <p className="text-xl font-mono text-zinc-100">{avgWT.toFixed(2)} <span className="text-xs font-sans text-zinc-600">ms</span></p>
        </div>
      </div>

      <div className="flex-grow overflow-auto pr-1">
        <table className="w-full text-xs text-left">
          <thead className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 sticky top-0 bg-zinc-900 z-10 border-b border-white/5">
            <tr>
              <th className="py-2.5">ID</th>
              <th className="py-2.5">AT</th>
              <th className="py-2.5">BT</th>
              <th className="py-2.5">Prio</th>
              <th className="py-2.5 text-zinc-400">ST</th>
              <th className="py-2.5 text-zinc-400">CT</th>
              <th className="py-2.5 text-zinc-300">TAT</th>
              <th className="py-2.5 text-zinc-300">WT</th>
            </tr>
          </thead>
          <motion.tbody 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="font-mono text-zinc-400"
          >
            {processList.sort((a,b) => parseInt(a.id.substring(1)) - parseInt(b.id.substring(1))).map(p => (
              <motion.tr variants={itemVariants} key={p.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-3 font-sans font-medium text-zinc-200">{p.id}</td>
                <td className="py-3">{p.at}</td>
                <td className="py-3">{p.bt}</td>
                <td className="py-3 text-zinc-600">{p.priority}</td>
                <td className="py-3 text-zinc-300">{p.st}</td>
                <td className="py-3 text-zinc-300">{p.ct}</td>
                <td className="py-3 text-zinc-100">{p.tat}</td>
                <td className="py-3 text-zinc-100">{p.wt}</td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};

export default OutputTable;
