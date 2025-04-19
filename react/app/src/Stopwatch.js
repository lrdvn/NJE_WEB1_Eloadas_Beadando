import React, { useState, useEffect, useRef } from 'react';

export default function Stopwatch() {
  const [time, setTime] = useState(0); // az idő másodpercben
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      // Ha fut a stopper, indítsuk el az időmérést
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000); // minden másodpercben növeljük az időt
    } else if (!running && intervalRef.current) {
      // Ha leállítjuk, töröljük a setInterval-t
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Cleanup függvény a komponens unmountolásakor
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const handleStartStop = () => {
    setRunning(!running);
  };

  const handleReset = () => {
    setRunning(false);
    setTime(0);
  };

  // Segédfüggvény az idő formázására (mm:ss)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return (
      String(minutes).padStart(2, '0') +
      ':' +
      String(seconds).padStart(2, '0')
    );
  };

  return (
    <div>
      <h2>Stopwatch</h2>
      <p style={{ fontSize: '2rem' }}>{formatTime(time)}</p>
      <button onClick={handleStartStop} style={{ marginRight: '10px', padding: '10px' }}>
        {running ? 'Stop' : 'Start'}
      </button>
      <button onClick={handleReset} style={{ padding: '10px' }}>Reset</button>
    </div>
  );
}
