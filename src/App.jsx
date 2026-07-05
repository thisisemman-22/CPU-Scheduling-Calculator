import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import OutputTable from './components/OutputTable';
import GanttChart from './components/GanttChart';
import { FCFS, SJF, SRTF, PriorityNP, PriorityP, RR } from './utils/schedulingAlgorithms';

function App() {
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [processes, setProcesses] = useState([]);
  const [results, setResults] = useState({ gantt: [], metrics: {} });
  const exportRef = useRef(null);

  // Theme: persist to localStorage, default to dark
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('cpu-scheduler-theme') || 'dark'; } catch { return 'dark'; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('cpu-scheduler-theme', theme); } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleCalculate = () => {
    const procs = processes.map(p => ({ ...p }));
    let res;
    switch (algorithm) {
      case 'FCFS': res = FCFS(procs); break;
      case 'SJF': res = SJF(procs); break;
      case 'SRTF': res = SRTF(procs); break;
      case 'PriorityNP': res = PriorityNP(procs); break;
      case 'PriorityP': res = PriorityP(procs); break;
      case 'RR': res = RR(procs, timeQuantum); break;
      default: res = FCFS(procs);
    }
    setResults(res);
  };

  const handleClear = () => {
    setProcesses([]);
    setResults({ gantt: [], metrics: {} });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] font-sans theme-transition">
      <Header
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        timeQuantum={timeQuantum}
        setTimeQuantum={setTimeQuantum}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 xl:col-span-3">
            <InputPanel
              processes={processes}
              setProcesses={setProcesses}
              onCalculate={handleCalculate}
              onClear={handleClear}
            />
          </div>
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            <div ref={exportRef} className="flex flex-col gap-6">
              <OutputTable metrics={results.metrics} exportRef={exportRef} />
              {results.gantt.length > 0 && <GanttChart gantt={results.gantt} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
