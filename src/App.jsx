import React, { useState, useRef } from 'react';
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

  const handleCalculate = () => {
    let res;
    const procs = processes.map(p => ({...p}));
    
    switch(algorithm) {
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
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-zinc-800">
      <Header 
        algorithm={algorithm} 
        setAlgorithm={setAlgorithm}
        timeQuantum={timeQuantum}
        setTimeQuantum={setTimeQuantum}
      />
      
      <main className="p-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <InputPanel 
              processes={processes} 
              setProcesses={setProcesses}
              onCalculate={handleCalculate}
              onClear={handleClear}
            />
          </div>
          <div className="lg:col-span-9 flex flex-col min-h-[calc(100vh-120px)]">
            <div ref={exportRef} className="flex-1 flex flex-col gap-0 pb-2">
              <div className="flex-1 min-h-[400px] mb-1">
                <OutputTable metrics={results.metrics} exportRef={exportRef} />
              </div>
              {results.gantt.length > 0 && (
                <div className="mt-5 border-t border-white/5 pt-1">
                  <GanttChart gantt={results.gantt} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
