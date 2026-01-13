import React, { useState } from 'react';
import { AudioService } from '../services/audioService';

interface MultiplayerLobbyProps {
  onStart: (player1Name: string, player2Name: string) => void;
  onExit: () => void;
}

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ onStart, onExit }) => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  const handleStart = () => {
    if (!player1Name.trim() || !player2Name.trim()) {
      alert('Kedua pemain harus memasukkan nama!');
      return;
    }
    AudioService.playWin();
    onStart(player1Name.trim(), player2Name.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-news-blue via-news-purple to-news-pink p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
            🎮 MULTIPLAYER ARENA
          </h1>
          <p className="text-white/90 text-lg font-bold">Siapa yang akan jadi jurnalis terbaik?</p>
        </div>

        {/* 2 Player Input Split Screen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Player 1 - LEFT */}
          <div className="glass-panel rounded-3xl p-8 border-4 border-news-green">
            <div className="text-center mb-6">
              <i className="fas fa-user-tie text-5xl text-news-green mb-3"></i>
              <h2 className="font-display text-3xl font-bold text-gray-800">PEMAIN 1</h2>
              <p className="text-sm text-gray-500 font-bold mt-1">Sebelah Kiri</p>
            </div>
            
            <input
              type="text"
              placeholder="Masukkan nama..."
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStart()}
              maxLength={20}
              className="w-full px-4 py-3 rounded-xl border-2 border-news-green/30 focus:border-news-green bg-white/80 text-gray-800 font-bold text-center placeholder-gray-400 focus:outline-none transition"
            />
            
            <div className="mt-4 p-3 bg-news-green/10 rounded-lg text-center">
              <p className="text-xs text-gray-600 font-bold">Area touch: Sebelah kiri layar</p>
            </div>
          </div>

          {/* Player 2 - RIGHT */}
          <div className="glass-panel rounded-3xl p-8 border-4 border-news-red">
            <div className="text-center mb-6">
              <i className="fas fa-user-secret text-5xl text-news-red mb-3"></i>
              <h2 className="font-display text-3xl font-bold text-gray-800">PEMAIN 2</h2>
              <p className="text-sm text-gray-500 font-bold mt-1">Sebelah Kanan</p>
            </div>
            
            <input
              type="text"
              placeholder="Masukkan nama..."
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStart()}
              maxLength={20}
              className="w-full px-4 py-3 rounded-xl border-2 border-news-red/30 focus:border-news-red bg-white/80 text-gray-800 font-bold text-center placeholder-gray-400 focus:outline-none transition"
            />
            
            <div className="mt-4 p-3 bg-news-red/10 rounded-lg text-center">
              <p className="text-xs text-gray-600 font-bold">Area touch: Sebelah kanan layar</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleStart}
            className="bg-gradient-to-r from-news-green to-news-blue text-white font-bold text-xl px-12 py-4 rounded-full shadow-lg hover:scale-105 transition transform"
          >
            <i className="fas fa-play mr-2"></i>MULAI GAME
          </button>
          <button
            onClick={onExit}
            className="bg-white text-news-dark font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            <i className="fas fa-arrow-left mr-2"></i>KEMBALI
          </button>
        </div>

        {/* Info */}
        <div className="mt-12 glass-panel rounded-2xl p-6 text-center">
          <p className="text-gray-700 font-bold">
            💡 Tip: Pastikan kedua pemain siap di masing-masing sisi layar sebelum memulai!
          </p>
        </div>
      </div>
    </div>
  );
};
