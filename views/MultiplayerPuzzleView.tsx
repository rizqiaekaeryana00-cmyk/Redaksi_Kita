import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { AudioService } from '../services/audioService';
import { PuzzleLevel } from '../types';

interface MultiplayerPuzzleViewProps {
  player1Name: string;
  player2Name: string;
  timeLimit: number;
  onGameEnd: (p1Score: number, p2Score: number, p1Correct: number, p2Correct: number) => void;
}

interface PuzzlePiece {
  id: string;
  text: string;
  correctZone: 'headline' | 'lead' | 'body';
}

interface PlayerPuzzleState {
  pieces: PuzzlePiece[];
  zones: { headline: string | null; lead: string | null; body: string | null };
  puzzleSolved: boolean;
}

export const MultiplayerPuzzleView: React.FC<MultiplayerPuzzleViewProps> = ({
  player1Name,
  player2Name,
  timeLimit,
  onGameEnd,
}) => {
  const [puzzles, setPuzzles] = useState<PuzzleLevel[]>([]);
  const [p1State, setP1State] = useState<PlayerPuzzleState>({
    pieces: [],
    zones: { headline: null, lead: null, body: null },
    puzzleSolved: false,
  });
  const [p2State, setP2State] = useState<PlayerPuzzleState>({
    pieces: [],
    zones: { headline: null, lead: null, body: null },
    puzzleSolved: false,
  });

  const [currentPuzzleIdx, setCurrentPuzzleIdx] = useState(0);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [p1Correct, setP1Correct] = useState(0);
  const [p2Correct, setP2Correct] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [gameActive, setGameActive] = useState(true);
  const [draggedPiece, setDraggedPiece] = useState<{ playerId: 'p1' | 'p2'; pieceId: string } | null>(null);

  // Load puzzles
  useEffect(() => {
    DataService.getPuzzles().then((data) => {
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setPuzzles(shuffled.slice(0, 5)); // 5 puzzles for multiplayer
    });
  }, []);

  // Initialize puzzle for both players
  useEffect(() => {
    if (puzzles.length > 0 && currentPuzzleIdx < puzzles.length) {
      const puzzle = puzzles[currentPuzzleIdx];
      const pieces: PuzzlePiece[] = [
        { id: 'h', text: puzzle.headline, correctZone: 'headline' },
        { id: 'l', text: puzzle.lead, correctZone: 'lead' },
        { id: 'b', text: puzzle.body, correctZone: 'body' },
      ].sort(() => Math.random() - 0.5);

      setP1State({ pieces: [...pieces], zones: { headline: null, lead: null, body: null }, puzzleSolved: false });
      setP2State({ pieces: [...pieces], zones: { headline: null, lead: null, body: null }, puzzleSolved: false });
    }
  }, [currentPuzzleIdx, puzzles]);

  // Timer countdown
  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  // End game
  useEffect(() => {
    if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      onGameEnd(p1Score, p2Score, p1Correct, p2Correct);
    }
  }, [timeLeft, gameActive, p1Score, p2Score, p1Correct, p2Correct, onGameEnd]);

  const handleDragStart = (playerId: 'p1' | 'p2', pieceId: string) => {
    setDraggedPiece({ playerId, pieceId });
  };

  const handleDrop = (playerId: 'p1' | 'p2', zone: 'headline' | 'lead' | 'body') => {
    if (!draggedPiece || draggedPiece.playerId !== playerId) {
      setDraggedPiece(null);
      return;
    }

    const state = playerId === 'p1' ? p1State : p2State;
    const piece = state.pieces.find((p) => p.id === draggedPiece.pieceId);

    if (!piece) {
      setDraggedPiece(null);
      return;
    }

    if (piece.correctZone === zone) {
      // Correct
      AudioService.playCorrect();
      const newZones = { ...state.zones, [zone]: piece.text };
      const newPieces = state.pieces.filter((p) => p.id !== piece.id);

      if (playerId === 'p1') {
        setP1State({ pieces: newPieces, zones: newZones, puzzleSolved: false });
      } else {
        setP2State({ pieces: newPieces, zones: newZones, puzzleSolved: false });
      }

      // Check if puzzle complete
      if (newZones.headline && newZones.lead && newZones.body) {
        if (playerId === 'p1') {
          setP1Score((s) => s + 10);
          setP1Correct((c) => c + 1);
          setP1State((prev) => ({ ...prev, puzzleSolved: true }));
        } else {
          setP2Score((s) => s + 10);
          setP2Correct((c) => c + 1);
          setP2State((prev) => ({ ...prev, puzzleSolved: true }));
        }

        // Auto next puzzle in 2 seconds
        setTimeout(() => {
          if (currentPuzzleIdx + 1 < puzzles.length) {
            setCurrentPuzzleIdx((prev) => prev + 1);
          }
        }, 2000);
      }
    } else {
      // Wrong
      AudioService.playWrong();
    }

    setDraggedPiece(null);
  };

  return (
    <div className="h-screen flex bg-gray-900 overflow-hidden relative font-sans select-none">
      {/* GLOBAL TIMER */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none drop-shadow-2xl">
        <div className="bg-gray-800/90 backdrop-blur-md rounded-full w-24 h-24 flex items-center justify-center border-4 border-white/20 shadow-2xl animate-pulse">
          <span className={`text-4xl font-black ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>
            {timeLeft}
          </span>
        </div>
      </div>

      {/* PLAYER 1 AREA (Left) */}
      <div className="w-1/2 border-r-2 border-white/10 relative bg-gradient-to-br from-blue-900/40 to-gray-900 flex flex-col">
        {/* HUD P1 */}
        <div className="bg-black/60 p-4 flex justify-between items-center z-40 border-b border-white/10">
          <div>
            <div className="text-news-green font-bold text-xs tracking-widest uppercase">Pemain 1</div>
            <div className="text-white text-xl font-black">{player1Name}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 font-bold text-xs uppercase">SKOR</div>
            <div className="text-news-green text-4xl font-mono font-bold">{p1Score}</div>
          </div>
        </div>

        {/* Game Field P1 */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Pieces Sidebar */}
          <div className="mb-6">
            <h4 className="text-gray-400 font-bold text-xs uppercase mb-3 tracking-wider">Potongan</h4>
            <div className="space-y-2">
              {p1State.pieces.map((p) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={() => handleDragStart('p1', p.id)}
                  className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg shadow cursor-grab active:cursor-grabbing border-l-4 border-blue-400 text-sm font-bold transition"
                >
                  {p.text.substring(0, 40)}...
                </div>
              ))}
              {p1State.pieces.length === 0 && (
                <div className="text-center py-4 text-green-400 font-bold">✅ Selesai!</div>
              )}
            </div>
          </div>

          {/* Drop Zones */}
          <div className="space-y-3">
            {/* Headline */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop('p1', 'headline')}
              className={`min-h-[60px] rounded-lg border-2 border-dashed p-3 transition ${
                p1State.zones.headline
                  ? 'bg-blue-600/20 border-blue-400 text-blue-300'
                  : 'bg-gray-800/50 border-gray-600 text-gray-500'
              }`}
            >
              {p1State.zones.headline ? (
                <h5 className="font-bold text-sm">{p1State.zones.headline}</h5>
              ) : (
                <div className="text-xs">📰 HEADLINE</div>
              )}
            </div>

            {/* Lead */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop('p1', 'lead')}
              className={`min-h-[60px] rounded-lg border-2 border-dashed p-3 transition ${
                p1State.zones.lead
                  ? 'bg-green-600/20 border-green-400 text-green-300'
                  : 'bg-gray-800/50 border-gray-600 text-gray-500'
              }`}
            >
              {p1State.zones.lead ? (
                <p className="text-xs font-bold">{p1State.zones.lead}</p>
              ) : (
                <div className="text-xs">✏️ LEAD</div>
              )}
            </div>

            {/* Body */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop('p1', 'body')}
              className={`min-h-[80px] rounded-lg border-2 border-dashed p-3 transition ${
                p1State.zones.body
                  ? 'bg-gray-500/20 border-gray-400 text-gray-300'
                  : 'bg-gray-800/50 border-gray-600 text-gray-500'
              }`}
            >
              {p1State.zones.body ? (
                <p className="text-xs">{p1State.zones.body}</p>
              ) : (
                <div className="text-xs">📄 BODY</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PLAYER 2 AREA (Right) */}
      <div className="w-1/2 border-l-2 border-white/10 relative bg-gradient-to-bl from-red-900/40 to-gray-900 flex flex-col">
        {/* HUD P2 */}
        <div className="bg-black/60 p-4 flex justify-between items-center z-40 border-b border-white/10">
          <div className="text-left">
            <div className="text-gray-400 font-bold text-xs uppercase">SKOR</div>
            <div className="text-news-red text-4xl font-mono font-bold">{p2Score}</div>
          </div>
          <div className="text-right">
            <div className="text-news-red font-bold text-xs tracking-widest uppercase">Pemain 2</div>
            <div className="text-white text-xl font-black">{player2Name}</div>
          </div>
        </div>

        {/* Game Field P2 */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Pieces Sidebar */}
          <div className="mb-6">
            <h4 className="text-gray-400 font-bold text-xs uppercase mb-3 tracking-wider">Potongan</h4>
            <div className="space-y-2">
              {p2State.pieces.map((p) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={() => handleDragStart('p2', p.id)}
                  className="bg-red-600 hover:bg-red-500 text-white p-3 rounded-lg shadow cursor-grab active:cursor-grabbing border-l-4 border-red-400 text-sm font-bold transition"
                >
                  {p.text.substring(0, 40)}...
                </div>
              ))}
              {p2State.pieces.length === 0 && (
                <div className="text-center py-4 text-green-400 font-bold">✅ Selesai!</div>
              )}
            </div>
          </div>

          {/* Drop Zones */}
          <div className="space-y-3">
            {/* Headline */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop('p2', 'headline')}
              className={`min-h-[60px] rounded-lg border-2 border-dashed p-3 transition ${
                p2State.zones.headline
                  ? 'bg-blue-600/20 border-blue-400 text-blue-300'
                  : 'bg-gray-800/50 border-gray-600 text-gray-500'
              }`}
            >
              {p2State.zones.headline ? (
                <h5 className="font-bold text-sm">{p2State.zones.headline}</h5>
              ) : (
                <div className="text-xs">📰 HEADLINE</div>
              )}
            </div>

            {/* Lead */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop('p2', 'lead')}
              className={`min-h-[60px] rounded-lg border-2 border-dashed p-3 transition ${
                p2State.zones.lead
                  ? 'bg-green-600/20 border-green-400 text-green-300'
                  : 'bg-gray-800/50 border-gray-600 text-gray-500'
              }`}
            >
              {p2State.zones.lead ? (
                <p className="text-xs font-bold">{p2State.zones.lead}</p>
              ) : (
                <div className="text-xs">✏️ LEAD</div>
              )}
            </div>

            {/* Body */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop('p2', 'body')}
              className={`min-h-[80px] rounded-lg border-2 border-dashed p-3 transition ${
                p2State.zones.body
                  ? 'bg-gray-500/20 border-gray-400 text-gray-300'
                  : 'bg-gray-800/50 border-gray-600 text-gray-500'
              }`}
            >
              {p2State.zones.body ? (
                <p className="text-xs">{p2State.zones.body}</p>
              ) : (
                <div className="text-xs">📄 BODY</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Game Over Overlay */}
      {!gameActive && timeLeft === 0 && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <h1 className="text-6xl font-black text-white animate-bounce">WAKTU HABIS!</h1>
        </div>
      )}
    </div>
  );
};
