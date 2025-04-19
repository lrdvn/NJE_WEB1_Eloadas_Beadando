import React, { useState } from 'react';

const choices = ['Rock', 'Paper', 'Scissors'];

function getRandomChoice() {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function determineWinner(userChoice, computerChoice) {
  if (userChoice === computerChoice) return "Döntetlen!";
  if (
    (userChoice === "Rock" && computerChoice === "Scissors") ||
    (userChoice === "Paper" && computerChoice === "Rock") ||
    (userChoice === "Scissors" && computerChoice === "Paper")
  ) {
    return "Nyertél!";
  }
  return "Vesztettél!";
}

export default function RockPaperScissors() {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState("");

  const handleChoice = (choice) => {
    const compChoice = getRandomChoice();
    const outcome = determineWinner(choice, compChoice);
    setUserChoice(choice);
    setComputerChoice(compChoice);
    setResult(outcome);
  };

  return (
    <div>
      <h2>Rock-Paper-Scissors Game</h2>
      <div>
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => handleChoice(choice)}
            style={{ marginRight: '10px', padding: '10px' }}
          >
            {choice}
          </button>
        ))}
      </div>
      {userChoice && (
        <div style={{ marginTop: '20px' }}>
          <p><strong>Te:</strong> {userChoice}</p>
          <p><strong>Számítógép:</strong> {computerChoice}</p>
          <h3>Eredmény: {result}</h3>
        </div>
      )}
    </div>
  );
}
