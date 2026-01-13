import React, { useState, useEffect } from 'react';
import { AudioService } from '../services/audioService';

interface MultiplayerHoaxViewProps {
  player1Name: string;
  player2Name: string;
  timeLimit: number;
  onGameEnd: (p1Score: number, p2Score: number, p1Correct: number, p2Correct: number) => void;
}

interface Hoax {
  id: string;
  x: number;
  y: number;
  size: number;
  life: number;
}

export const MultiplayerHoaxView: React.FC<MultiplayerHoaxViewProps> = ({
  player1Name,
  player2Name,
  timeLimit,
  onGameEnd,
}) => {
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [p1Correct, setP1Correct] = useState(0);
  const [p2Correct, setP2Correct] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [gameActive, setGameActive] = useState(true);

  // Hoax management
  const [hoaxes, setHoaxes] = useState<Hoax[]>([]);
  const [nextId, setNextId] = useState(0);

  // Generate random hoax position and size
  const generateHoax = () => {
    const size = 60 + Math.random() * 40;
    const x = Math.random() * (100 - size / 4);
    const y = Math.random() * (80 - size / 4);
    return {
      id: `hoax-${nextId}`,
      x,
      y,
      size,
      life: 100,
    };
  };

  // Spawn hoaxes
  useEffect(() => {
    if (!gameActive) return;

    const spawnInterval = setInterval(() => {
      const newHoax = generateHoax();
      setNextId((prev) => prev + 1);
      setHoaxes((prev) => [...prev, newHoax]);
    }, 800); // Spawn every 800ms

    return () => clearInterval(spawnInterval);
  }, [gameActive, nextId]);

  // Fade hoaxes
  useEffect(() => {
    if (!gameActive) return;

    const fadeInterval = setInterval(() => {
      setHoaxes((prev) =>
        prev
          .map((h) => ({ ...h, life: h.life - 5 }))
          .filter((h) => h.life > 0)
      );
    }, 100);

    return () => clearInterval(fadeInterval);
  }, [gameActive]);

  // Timer countdown
  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setGameActive(false);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  // End game
  useEffect(() => {
    if (!gameActive && timeLeft === 0) {
      onGameEnd(p1Score, p2Score, p1Correct, p2Correct);
    }
  }, [gameActive, timeLeft, p1Score, p2Score, p1Correct, p2Correct, onGameEnd]);

  const handleTapHoax = (hoaxId: string, playerSide: 'left' | 'right') => {
    if (!gameActive) return;

    AudioService.playWin();
    setHoaxes((prev) => prev.filter((h) => h.id !== hoaxId));

    if (playerSide === 'left') {
      setP1Score((prev) => prev + 10);
      setP1Correct((prev) => prev + 1);
    } else {
      setP2Score((prev) => prev + 10);
      setP2Correct((prev) => prev + 1);
    }
  };

  const getLeftPlayerHoaxes = () => hoaxes.slice(0, Math.ceil(hoaxes.length / 2));
  const getRightPlayerHoaxes = () => hoaxes.slice(Math.ceil(hoaxes.length / 2));

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden relative">
      {/* Left Player - P1 */}
      <div className="w-1/2 bg-gradient-to-br from-green-900 via-gray-900 to-gray-800 border-4 border-green-500 relative overflow-hidden flex flex-col">
        {/* Score Bar */}
        <div className="bg-black/50 p-4 flex justify-between items-center z-10">
          <div className="text-white text-center flex-1">
            <p className="text-sm font-bold text-green-400">PEMAIN 1</p>
            <p className="text-2xl font-bold text-green-300">{player1Name}</p>
          </div>
          <div className="text-right text-white">
            <p className="text-sm font-bold text-green-400">SKOR</p>
            <p className="text-3xl font-bold text-green-300">{p1Score}</p>
            <p className="text-xs text-green-400">{p1Correct} hoax</p>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 relative">
          {getLeftPlayerHoaxes().map((hoax) => (
            <button
              key={hoax.id}
              onClick={() => handleTapHoax(hoax.id, 'left')}
              className="absolute transition-all"
              style={{
                left: `${hoax.x}%`,
                top: `${hoax.y}%`,
                width: `${hoax.size}px`,
                height: `${hoax.size}px`,
                opacity: hoax.life / 100,
              }}
              disabled={!gameActive}
            >
              <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-900 rounded-full flex items-center justify-center text-3xl font-bold shadow-2xl hover:shadow-lg transform hover:scale-110 transition cursor-pointer border-4 border-red-400">
                🚨
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Timer in Center */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center z-50 pointer-events-none">
        <div className="text-6xl font-bold drop-shadow-2xl">⏱️</div>
        <div className="text-5xl font-bold text-yellow-300 drop-shadow-2xl mt-2">
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
        {!gameActive && (
          <div className="text-3xl font-bold text-red-400 mt-4 drop-shadow-2xl">
            GAME OVER
          </div>
        )}
      </div>

      {/* Right Player - P2 */}
      <div className="w-1/2 bg-gradient-to-br from-red-900 via-gray-900 to-gray-800 border-4 border-red-500 relative overflow-hidden flex flex-col">
        {/* Score Bar */}
        <div className="bg-black/50 p-4 flex justify-between items-center z-10">
          <div className="text-left text-white">
            <p className="text-sm font-bold text-red-400">SKOR</p>
            <p className="text-3xl font-bold text-red-300">{p2Score}</p>
            <p className="text-xs text-red-400">{p2Correct} hoax</p>
          </div>
          <div className="text-white text-center flex-1">
            <p className="text-sm font-bold text-red-400">PEMAIN 2</p>
            <p className="text-2xl font-bold text-red-300">{player2Name}</p>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 relative">
          {getRightPlayerHoaxes().map((hoax) => (
            <button
              key={hoax.id}
              onClick={() => handleTapHoax(hoax.id, 'right')}
              className="absolute transition-all"
              style={{
                left: `${hoax.x}%`,
                top: `${hoax.y}%`,
                width: `${hoax.size}px`,
                height: `${hoax.size}px`,
                opacity: hoax.life / 100,
              }}
              disabled={!gameActive}
            >
              <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-900 rounded-full flex items-center justify-center text-3xl font-bold shadow-2xl hover:shadow-lg transform hover:scale-110 transition cursor-pointer border-4 border-red-400">
                🚨
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
