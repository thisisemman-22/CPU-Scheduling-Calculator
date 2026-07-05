import React from 'react';
import { Cpu, Moon, Sun } from 'lucide-react';

const Header = ({ algorithm, setAlgorithm, timeQuantum, setTimeQuantum, theme, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] theme-transition" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-app) 80%, transparent)' , backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Cpu size={14} className="text-white" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[var(--text-primary)]">
            CPU Scheduler
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <select
            className="h-8 rounded-lg border border-[var(--border-input)] bg-[var(--bg-input)] px-3 pr-8 text-[13px] text-[var(--text-primary)] cursor-pointer outline-none transition-all hover:border-[var(--border-input-hover)] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22%2371717a%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22M4.646%206.646a.5.5%200%200%201%20.708%200L8%209.293l2.646-2.647a.5.5%200%200%201%20.708.708l-3%203a.5.5%200%200%201-.708%200l-3-3a.5.5%200%200%201%200-.708z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.5rem_center] shadow-sm theme-transition"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <option value="FCFS">First-Come, First-Serve</option>
            <option value="SJF">Shortest Job First (NP)</option>
            <option value="SRTF">Shortest Remaining Time (P)</option>
            <option value="PriorityNP">Priority (Non-Preemptive)</option>
            <option value="PriorityP">Priority (Preemptive)</option>
            <option value="RR">Round Robin</option>
          </select>

          {algorithm === 'RR' && (
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-subtle)]">
              <label className="text-xs text-[var(--text-muted)]">Quantum</label>
              <input
                type="number"
                min="1"
                className="h-8 w-14 rounded-lg border border-[var(--border-input)] bg-[var(--bg-input)] px-2 text-[13px] font-mono text-[var(--text-primary)] text-center outline-none transition-all hover:border-[var(--border-input-hover)] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 shadow-sm theme-transition"
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
              />
            </div>
          )}

          {/* Theme Toggle */}
          <div className="pl-2 border-l border-[var(--border-subtle)]">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-all active:scale-95 theme-transition"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
