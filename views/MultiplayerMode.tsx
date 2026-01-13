import React, { useState } from 'react';
import { MultiplayerLobby } from './MultiplayerLobby';
import { GameSelector } from './GameSelector';
import { MultiplayerQuizView } from './MultiplayerQuizView';
import { MultiplayerHoaxView } from './MultiplayerHoaxView';
import { MultiplayerPuzzleView } from './MultiplayerPuzzleView';
import { MultiplayerScoreboard } from './MultiplayerScoreboard';

interface MultiplayerModeProps {
  onExit: () => void;
}

type GameState = 'lobby' | 'selector' | 'quiz' | 'hoax' | 'puzzle' | 'scoreboard';

export const MultiplayerMode: React.FC<MultiplayerModeProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<GameState>('lobby');
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [gameMode, setGameMode] = useState<'quiz' | 'hoax' | 'puzzle'>('quiz');
  const [timeLimit, setTimeLimit] = useState(60);
  const [scores, setScores] = useState({ p1: 0, p2: 0, p1Correct: 0, p2Correct: 0 });

  const handleStartMultiplayer = (name1: string, name2: string) => {
    setPlayer1Name(name1);
    setPlayer2Name(name2);
    setGameState('selector');
  };

  const handleSelectGame = (mode: 'quiz' | 'hoax' | 'puzzle', time: number) => {
    setGameMode(mode);
    setTimeLimit(time);
    setGameState(mode);
  };

  const handleGameEnd = (p1Score: number, p2Score: number, p1Correct: number, p2Correct: number) => {
    setScores({ p1: p1Score, p2: p2Score, p1Correct, p2Correct });
    setGameState('scoreboard');
  };

  const handlePlayAgain = () => {
    setGameState('selector');
  };

  const handleBackToLobby = () => {
    setGameState('lobby');
  };

  // Render different game states
  if (gameState === 'lobby') {
    return <MultiplayerLobby onStart={handleStartMultiplayer} onExit={onExit} />;
  }

  if (gameState === 'selector') {
    return (
      <GameSelector
        player1Name={player1Name}
        player2Name={player2Name}
        onSelectGame={handleSelectGame}
        onBack={handleBackToLobby}
      />
    );
  }

  if (gameState === 'quiz') {
    return (
      <MultiplayerQuizView
        player1Name={player1Name}
        player2Name={player2Name}
        timeLimit={timeLimit}
        onGameEnd={handleGameEnd}
      />
    );
  }

  if (gameState === 'hoax') {
    return (
      <MultiplayerHoaxView
        player1Name={player1Name}
        player2Name={player2Name}
        timeLimit={timeLimit}
        onGameEnd={handleGameEnd}
      />
    );
  }

  if (gameState === 'puzzle') {
    return (
      <MultiplayerPuzzleView
        player1Name={player1Name}
        player2Name={player2Name}
        timeLimit={timeLimit}
        onGameEnd={handleGameEnd}
      />
    );
  }

  if (gameState === 'scoreboard') {
    return (
      <MultiplayerScoreboard
        player1Name={player1Name}
        player2Name={player2Name}
        player1Score={scores.p1}
        player2Score={scores.p2}
        gameMode={gameMode}
        onPlayAgain={handlePlayAgain}
        onExit={() => onExit()}
      />
    );
  }

  return null;
};
