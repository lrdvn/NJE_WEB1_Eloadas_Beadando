import React, { useState } from 'react';
import RockPaperScissors from './RockPaperScissors';
import Stopwatch from './Stopwatch';

function App() {
  const [activeApp, setActiveApp] = useState('rps'); // 'rps' vagy 'stopwatch'

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3399ee',
    color: 'white',
    cursor: 'pointer',
    border: 'none',
    marginRight: '10px'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    fontWeight: 'bold',
    borderBottom: '3px solid blue'
  };

  return (
    <div>
      <header>
        <h1>React SPA – Web-programozás-1 Előadás Házi feladat</h1>
      </header>
      <nav>
        <button
          style={activeApp === 'rps' ? activeButtonStyle : buttonStyle}
          onClick={() => setActiveApp('rps')}
        >
          Rock-Paper-Scissors
        </button>
        <button
          style={activeApp === 'stopwatch' ? activeButtonStyle : buttonStyle}
          onClick={() => setActiveApp('stopwatch')}
        >
          Stopwatch
        </button>
      </nav>
      <main style={{ padding: '20px' }}>
        {activeApp === 'rps' && <RockPaperScissors />}
        {activeApp === 'stopwatch' && <Stopwatch />}
      </main>
      <footer style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
        <p>Készítette: [Radványi Levente] – [CQDOGV]</p>
      </footer>
    </div>
  );
}

export default App;
