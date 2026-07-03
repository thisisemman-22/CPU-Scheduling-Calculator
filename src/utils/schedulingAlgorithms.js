export const FCFS = (processes) => {
  let gantt = [];
  let metrics = {};
  
  // Sort by Arrival Time, then by Process ID
  let sorted = [...processes].sort((a, b) => {
    if (a.at !== b.at) return a.at - b.at;
    return parseInt(a.id.substring(1)) - parseInt(b.id.substring(1));
  });

  let currentTime = 0;

  sorted.forEach(p => {
    if (currentTime < p.at) {
      gantt.push({ id: "Idle", start: currentTime, end: p.at });
      currentTime = p.at;
    }
    
    let st = currentTime;
    let ct = currentTime + p.bt;
    gantt.push({ id: p.id, start: st, end: ct });
    
    metrics[p.id] = {
      id: p.id,
      at: p.at,
      bt: p.bt,
      priority: p.priority,
      st: st,
      ct: ct,
      tat: ct - p.at,
      wt: (ct - p.at) - p.bt
    };
    
    currentTime = ct;
  });

  return { gantt, metrics };
};

export const SJF = (processes) => {
  let gantt = [];
  let metrics = {};
  
  let remaining = processes.map(p => ({...p}));
  let currentTime = 0;

  while (remaining.length > 0) {
    let available = remaining.filter(p => p.at <= currentTime);
    
    if (available.length === 0) {
      // Find next arrival
      let nextArrival = Math.min(...remaining.map(p => p.at));
      gantt.push({ id: "Idle", start: currentTime, end: nextArrival });
      currentTime = nextArrival;
      continue;
    }

    // Sort by BT, then AT, then ID
    available.sort((a, b) => {
      if (a.bt !== b.bt) return a.bt - b.bt;
      if (a.at !== b.at) return a.at - b.at;
      return parseInt(a.id.substring(1)) - parseInt(b.id.substring(1));
    });

    let p = available[0];
    let st = currentTime;
    let ct = currentTime + p.bt;
    
    gantt.push({ id: p.id, start: st, end: ct });
    
    metrics[p.id] = {
      id: p.id,
      at: p.at,
      bt: p.bt,
      priority: p.priority,
      st: st,
      ct: ct,
      tat: ct - p.at,
      wt: (ct - p.at) - p.bt
    };

    currentTime = ct;
    remaining = remaining.filter(r => r.id !== p.id);
  }

  return { gantt, metrics };
};

export const SRTF = (processes) => {
  let gantt = [];
  let metrics = {};
  let remainingProcesses = processes.map(p => ({...p, rt: p.bt, st: -1}));
  let currentTime = 0;
  let completed = 0;
  let prevId = null;
  let blockStart = 0;

  while (completed < processes.length) {
    let available = remainingProcesses.filter(p => p.at <= currentTime && p.rt > 0);
    
    if (available.length === 0) {
      if (prevId !== null) {
        gantt.push({ id: prevId, start: blockStart, end: currentTime });
        prevId = null;
      }
      let nextArrival = Math.min(...remainingProcesses.filter(p => p.rt > 0).map(p => p.at));
      if (prevId !== "Idle") {
        blockStart = currentTime;
        prevId = "Idle";
      }
      currentTime = nextArrival;
      continue;
    }

    available.sort((a, b) => {
      if (a.rt !== b.rt) return a.rt - b.rt;
      if (a.at !== b.at) return a.at - b.at;
      return parseInt(a.id.substring(1)) - parseInt(b.id.substring(1));
    });

    let p = available[0];
    
    if (prevId !== p.id) {
      if (prevId !== null) {
        gantt.push({ id: prevId, start: blockStart, end: currentTime });
      }
      blockStart = currentTime;
      prevId = p.id;
    }

    if (p.st === -1) p.st = currentTime;

    // Fast forward to next event (completion or new arrival)
    let nextArrival = Math.min(
      ...remainingProcesses
        .filter(r => r.at > currentTime && r.rt > 0)
        .map(r => r.at)
    );
    
    let timeToRun = Math.min(p.rt, isFinite(nextArrival) ? nextArrival - currentTime : p.rt);
    
    // We actually only run 1 unit if we want to re-evaluate strictly, but fast forward is safe
    // as long as we only fast-forward up to the next arrival.
    // Wait, SRTF might be preempted by a new arrival that has a shorter remaining time.
    // So fast forward to next arrival is safe.
    
    p.rt -= timeToRun;
    currentTime += timeToRun;

    if (p.rt === 0) {
      completed++;
      let ct = currentTime;
      metrics[p.id] = {
        id: p.id,
        at: p.at,
        bt: p.bt,
        priority: p.priority,
        st: p.st,
        ct: ct,
        tat: ct - p.at,
        wt: (ct - p.at) - p.bt
      };
    }
  }

  if (prevId !== null) {
    gantt.push({ id: prevId, start: blockStart, end: currentTime });
  }

  // merge contiguous idle blocks if any
  let finalGantt = [];
  gantt.forEach(b => {
    if (finalGantt.length > 0 && finalGantt[finalGantt.length - 1].id === b.id) {
      finalGantt[finalGantt.length - 1].end = b.end;
    } else {
      finalGantt.push(b);
    }
  });

  return { gantt: finalGantt, metrics };
};

export const PriorityNP = (processes) => {
  let gantt = [];
  let metrics = {};
  
  let remaining = processes.map(p => ({...p}));
  let currentTime = 0;

  while (remaining.length > 0) {
    let available = remaining.filter(p => p.at <= currentTime);
    
    if (available.length === 0) {
      let nextArrival = Math.min(...remaining.map(p => p.at));
      gantt.push({ id: "Idle", start: currentTime, end: nextArrival });
      currentTime = nextArrival;
      continue;
    }

    // Sort by Priority (lower is better), then AT, then ID
    available.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      if (a.at !== b.at) return a.at - b.at;
      return parseInt(a.id.substring(1)) - parseInt(b.id.substring(1));
    });

    let p = available[0];
    let st = currentTime;
    let ct = currentTime + p.bt;
    
    gantt.push({ id: p.id, start: st, end: ct });
    
    metrics[p.id] = {
      id: p.id,
      at: p.at,
      bt: p.bt,
      priority: p.priority,
      st: st,
      ct: ct,
      tat: ct - p.at,
      wt: (ct - p.at) - p.bt
    };

    currentTime = ct;
    remaining = remaining.filter(r => r.id !== p.id);
  }

  return { gantt, metrics };
};

export const PriorityP = (processes) => {
  let gantt = [];
  let metrics = {};
  let remainingProcesses = processes.map(p => ({...p, rt: p.bt, st: -1}));
  let currentTime = 0;
  let completed = 0;
  let prevId = null;
  let blockStart = 0;

  while (completed < processes.length) {
    let available = remainingProcesses.filter(p => p.at <= currentTime && p.rt > 0);
    
    if (available.length === 0) {
      if (prevId !== null) {
        gantt.push({ id: prevId, start: blockStart, end: currentTime });
        prevId = null;
      }
      let nextArrival = Math.min(...remainingProcesses.filter(p => p.rt > 0).map(p => p.at));
      if (prevId !== "Idle") {
        blockStart = currentTime;
        prevId = "Idle";
      }
      currentTime = nextArrival;
      continue;
    }

    available.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      if (a.at !== b.at) return a.at - b.at;
      return parseInt(a.id.substring(1)) - parseInt(b.id.substring(1));
    });

    let p = available[0];
    
    if (prevId !== p.id) {
      if (prevId !== null) {
        gantt.push({ id: prevId, start: blockStart, end: currentTime });
      }
      blockStart = currentTime;
      prevId = p.id;
    }

    if (p.st === -1) p.st = currentTime;

    let nextArrival = Math.min(
      ...remainingProcesses
        .filter(r => r.at > currentTime && r.rt > 0)
        .map(r => r.at)
    );
    
    let timeToRun = Math.min(p.rt, isFinite(nextArrival) ? nextArrival - currentTime : p.rt);
    
    p.rt -= timeToRun;
    currentTime += timeToRun;

    if (p.rt === 0) {
      completed++;
      let ct = currentTime;
      metrics[p.id] = {
        id: p.id,
        at: p.at,
        bt: p.bt,
        priority: p.priority,
        st: p.st,
        ct: ct,
        tat: ct - p.at,
        wt: (ct - p.at) - p.bt
      };
    }
  }

  if (prevId !== null) {
    gantt.push({ id: prevId, start: blockStart, end: currentTime });
  }

  let finalGantt = [];
  gantt.forEach(b => {
    if (finalGantt.length > 0 && finalGantt[finalGantt.length - 1].id === b.id) {
      finalGantt[finalGantt.length - 1].end = b.end;
    } else {
      finalGantt.push(b);
    }
  });

  return { gantt: finalGantt, metrics };
};

export const RR = (processes, timeQuantum) => {
  let gantt = [];
  let metrics = {};
  
  let remainingProcesses = processes.map(p => ({...p, rt: p.bt, st: -1}));
  
  // Sort initially by AT, then ID
  remainingProcesses.sort((a, b) => {
    if (a.at !== b.at) return a.at - b.at;
    return parseInt(a.id.substring(1)) - parseInt(b.id.substring(1));
  });

  let currentTime = 0;
  let queue = [];
  let completed = 0;
  
  let i = 0; // index for remainingProcesses that haven't arrived yet
  
  // Enqueue processes arriving at time 0
  while (i < remainingProcesses.length && remainingProcesses[i].at <= currentTime) {
    queue.push(remainingProcesses[i]);
    i++;
  }

  let prevId = null;
  let blockStart = 0;

  while (completed < processes.length) {
    if (queue.length === 0) {
      if (prevId !== null && prevId !== "Idle") {
        gantt.push({ id: prevId, start: blockStart, end: currentTime });
      }
      
      let nextArrival = remainingProcesses[i].at;
      if (prevId !== "Idle") {
        blockStart = currentTime;
        prevId = "Idle";
      }
      currentTime = nextArrival;
      
      while (i < remainingProcesses.length && remainingProcesses[i].at <= currentTime) {
        queue.push(remainingProcesses[i]);
        i++;
      }
      continue;
    }

    let p = queue.shift();
    
    if (prevId !== p.id) {
      if (prevId !== null) {
        gantt.push({ id: prevId, start: blockStart, end: currentTime });
      }
      blockStart = currentTime;
      prevId = p.id;
    }

    if (p.st === -1) p.st = currentTime;

    let timeToRun = Math.min(p.rt, timeQuantum);
    p.rt -= timeToRun;
    currentTime += timeToRun;
    
    // Check for arrivals during this execution block
    while (i < remainingProcesses.length && remainingProcesses[i].at <= currentTime) {
      queue.push(remainingProcesses[i]);
      i++;
    }

    if (p.rt === 0) {
      completed++;
      metrics[p.id] = {
        id: p.id,
        at: p.at,
        bt: p.bt,
        priority: p.priority,
        st: p.st,
        ct: currentTime,
        tat: currentTime - p.at,
        wt: (currentTime - p.at) - p.bt
      };
    } else {
      queue.push(p); // Put back in queue if not finished
    }
  }

  if (prevId !== null) {
    gantt.push({ id: prevId, start: blockStart, end: currentTime });
  }

  // Merge contiguous
  let finalGantt = [];
  gantt.forEach(b => {
    if (finalGantt.length > 0 && finalGantt[finalGantt.length - 1].id === b.id) {
      finalGantt[finalGantt.length - 1].end = b.end;
    } else {
      finalGantt.push(b);
    }
  });

  return { gantt: finalGantt, metrics };
};
