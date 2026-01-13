import React, { useState, useEffect } from 'react';
import { AudioService } from '../services/audioService';

interface MultiplayerPuzzleViewProps {
  player1Name: string;
  player2Name: string;
  timeLimit: number;
  onGameEnd: (p1Score: number, p2Score: number, p1Correct: number, p2Correct: number) => void;
}

interface PuzzlePiece {
  id: string;
  text: string;
  correctPosition: number;
}

const PUZZLE_TEXTS = [
  ['Presiden', 'mengumumkan', 'kebijakan', 'baru', 'untuk', 'ekonomi'],
  ['Bencana', 'alam', 'melanda', 'daerah', 'perkotaan', 'kemarin'],
  ['Tim', 'olahraga', 'nasional', 'memenangkan', 'medali', 'emas'],
  ['Teknologi', 'terbaru', 'merevolusi', 'cara', 'kita', 'bekerja'],
  ['Pendidikan', 'digital', 'berkembang', 'pesat', 'di', 'negara'],
];

export const MultiplayerPuzzleView: React.FC<MultiplayerPuzzleViewProps> = ({
  player1Name,
  player2Name,
  timeLimit,
  onGameEnd,
}) => {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [p1Correct, setP1Correct] = useState(0);
  const [p2Correct, setP2Correct] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [gameActive, setGameActive] = useState(true);

  // Each player has their own puzzle state
  const [p1Solution, setP1Solution] = useState<string[]>([]);
  const [p2Solution, setP2Solution] = useState<string[]>([]);
  const [p1Completed, setP1Completed] = useState(false);
  const [p2Completed, setP2Completed] = useState(false);

  const currentPuzzle = PUZZLE_TEXTS[puzzleIndex];
  const [p1Shuffled, setP1Shuffled] = useState<string[]>([]);
  const [p2Shuffled, setP2Shuffled] = useState<string[]>([]);

  // Initialize shuffled pieces
  useEffect(() => {
    const shufflePuzzle = (arr: string[]) => {
      return [...arr].sort(() => Math.random() - 0.5);
    };
    setP1Shuffled(shufflePuzzle(currentPuzzle));
    setP2Shuffled(shufflePuzzle(currentPuzzle));
  }, [puzzleIndex]);

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

  const checkIfCorrect = (solution: string[], player: 'p1' | 'p2') => {
    return JSON.stringify(solution) === JSON.stringify(currentPuzzle);
  };

  const handleAddPiece = (
    piece: string,
    player: 'p1' | 'p2'
  ) => {
    if (!gameActive) return;

    if (player === 'p1') {
      const newSolution = [...p1Solution, piece];
      setP1Solution(newSolution);
      setP1Shuffled(p1Shuffled.filter((p) => p !== piece));

      if (newSolution.length === currentPuzzle.length) {
        if (checkIfCorrect(newSolution, 'p1')) {
          AudioService.playWin();
          setP1Score((prev) => prev + 10);
          setP1Correct((prev) => prev + 1);
          setP1Completed(true);

          // Auto next puzzle in 2 seconds
          setTimeout(() => {
            if (puzzleIndex < PUZZLE_TEXTS.length - 1) {
              setPuzzleIndex((prev) => prev + 1);
              setP1Solution([]);
              setP1Completed(false);
            }
          }, 2000);
        } else {
          AudioService.playClick();
          setP1Solution([]);
          setP1Shuffled(currentPuzzle.sort(() => Math.random() - 0.5));
        }
      }
    } else {
      const newSolution = [...p2Solution, piece];
      setP2Solution(newSolution);
      setP2Shuffled(p2Shuffled.filter((p) => p !== piece));

      if (newSolution.length === currentPuzzle.length) {
        if (checkIfCorrect(newSolution, 'p2')) {
          AudioService.playWin();
          setP2Score((prev) => prev + 10);
          setP2Correct((prev) => prev + 1);
          setP2Completed(true);

          // Auto next puzzle in 2 seconds
          setTimeout(() => {
            if (puzzleIndex < PUZZLE_TEXTS.length - 1) {
              setPuzzleIndex((prev) => prev + 1);
              setP2Solution([]);
              setP2Completed(false);
            }
          }, 2000);
        } else {
          AudioService.playClick();
          setP2Solution([]);
          setP2Shuffled(currentPuzzle.sort(() => Math.random() - 0.5));
        }
      }
    }
  };

  const handleRemovePiece = (
    index: number,
    player: 'p1' | 'p2'
  ) => {
    if (!gameActive) return;

    if (player === 'p1') {
      const piece = p1Solution[index];
      setP1Solution(p1Solution.filter((_, i) => i !== index));
      setP1Shuffled([...p1Shuffled, piece]);
    } else {
      const piece = p2Solution[index];
      setP2Solution(p2Solution.filter((_, i) => i !== index));
      setP2Shuffled([...p2Shuffled, piece]);
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex overflow-hidden relative">
      {/* Left Player - P1 */}
      <div className="w-1/2 bg-gradient-to-br from-blue-900 via-gray-900 to-gray-800 border-4 border-green-500 relative overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-black/50 p-4 z-10 border-b border-green-500">
          <div className="text-white">
            <p className="text-sm font-bold text-green-400">PEMAIN 1</p>
            <p className="text-lg font-bold text-green-300">{player1Name}</p>
            <p className="text-2xl font-bold text-green-300 mt-1">{p1Score} poin</p>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 p-4 overflow-auto flex flex-col justify-between">
          {/* Solution Display */}
          <div className="space-y-3">
            <p className="text-green-300 font-bold text-sm">Susunan Berita:</p>
            <div className="bg-green-900/30 rounded-lg p-3 min-h-20">
              {p1Completed ? (
                <div className="text-center">
                  <p className="text-2xl text-green-400 font-bold">✅ BENAR!</p>
                  <p className="text-green-300 text-sm mt-1">+10 poin</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {p1Solution.map((piece, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRemovePiece(idx, 'p1')}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-bold"
                    >
                      {piece} ✕
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Available Pieces */}
          <div className="space-y-3">
            <p className="text-green-300 font-bold text-sm">Kata Tersedia:</p>
            <div className="flex flex-wrap gap-2 bg-gray-800/50 p-3 rounded-lg">
              {p1Shuffled.map((piece) => (
                <button
                  key={piece}
                  onClick={() => handleAddPiece(piece, 'p1')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-bold transition"
                >
                  {piece}
                </button>
              ))}
            </div>
          </div>
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
      <div className="w-1/2 bg-gradient-to-br from-blue-900 via-gray-900 to-gray-800 border-4 border-red-500 relative overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-black/50 p-4 z-10 border-b border-red-500">
          <div className="text-white text-right">
            <p className="text-sm font-bold text-red-400">PEMAIN 2</p>
            <p className="text-lg font-bold text-red-300">{player2Name}</p>
            <p className="text-2xl font-bold text-red-300 mt-1">{p2Score} poin</p>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 p-4 overflow-auto flex flex-col justify-between">
          {/* Solution Display */}
          <div className="space-y-3">
            <p className="text-red-300 font-bold text-sm">Susunan Berita:</p>
            <div className="bg-red-900/30 rounded-lg p-3 min-h-20">
              {p2Completed ? (
                <div className="text-center">
                  <p className="text-2xl text-red-400 font-bold">✅ BENAR!</p>
                  <p className="text-red-300 text-sm mt-1">+10 poin</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {p2Solution.map((piece, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRemovePiece(idx, 'p2')}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-bold"
                    >
                      {piece} ✕
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Available Pieces */}
          <div className="space-y-3">
            <p className="text-red-300 font-bold text-sm">Kata Tersedia:</p>
            <div className="flex flex-wrap gap-2 bg-gray-800/50 p-3 rounded-lg">
              {p2Shuffled.map((piece) => (
                <button
                  key={piece}
                  onClick={() => handleAddPiece(piece, 'p2')}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-bold transition"
                >
                  {piece}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
