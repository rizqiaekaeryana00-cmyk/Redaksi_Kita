import React, { useState } from 'react';
import { AudioService } from '../services/audioService';

interface GameSelectorProps {
  player1Name: string;
  player2Name: string;
  onSelectGame: (gameMode: 'quiz' | 'hoax' | 'puzzle', timeLimit: number) => void;
  onBack: () => void;
}

export const GameSelector: React.FC<GameSelectorProps> = ({
  player1Name,
  player2Name,
  onSelectGame,
  onBack,
}) => {
  const [selectedGame, setSelectedGame] = useState<'quiz' | 'hoax' | 'puzzle' | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  const timeLimits = [60, 120, 180, 300];

  const handleGameSelect = (gameId: 'quiz' | 'hoax' | 'puzzle') => {
    AudioService.playClick();
    setSelectedGame(gameId);
  };

  const handleTimeSelect = (time: number) => {
    AudioService.playClick();
    setSelectedTime(time);
  };

  const handlePlay = () => {
    if (selectedGame && selectedTime) {
      AudioService.playWin();
      onSelectGame(selectedGame, selectedTime);
    }
  };

  const canPlay = selectedGame !== null && selectedTime !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-news-yellow via-news-pink to-news-purple p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold text-white drop-shadow-lg mb-2">
              🎮 PILIH GAME
            </h1>
            <p className="text-white/90 font-bold">
              {player1Name} vs {player2Name}
            </p>
          </div>
          <button
            onClick={onBack}
            className="bg-white text-news-dark px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition"
          >
            ← Kembali
          </button>
        </div>

        {/* Game Mode Selection */}
        <div className="glass-panel rounded-2xl p-8 mb-8">
          <h2 className="font-bold text-gray-800 mb-6 text-xl">🎮 PILIH JENIS GAME:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quiz Game Card */}
            <div
              onClick={() => handleGameSelect('quiz')}
              className={`cursor-pointer group relative overflow-hidden p-6 rounded-2xl transition-all duration-300 transform ${
                selectedGame === 'quiz'
                  ? 'bg-gradient-to-br from-blue-600 to-blue-400 text-white scale-105 shadow-2xl ring-4 ring-blue-300'
                  : 'bg-white text-gray-800 hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              <div className={`absolute -right-4 -top-4 text-9xl opacity-10 transition-transform group-hover:scale-110 ${selectedGame === 'quiz' ? 'text-white' : 'text-blue-500'}`}>
                <i className="fas fa-brain"></i>
              </div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`text-5xl mb-4 ${selectedGame === 'quiz' ? 'text-white' : 'text-blue-500'}`}>
                   <i className="fas fa-question-circle"></i>
                </div>
                <h3 className="font-display font-black text-2xl mb-2 tracking-wide">UJI KOMPETENSI</h3>
                <p className={`font-medium text-sm ${selectedGame === 'quiz' ? 'text-blue-100' : 'text-gray-500'}`}>
                  Adu wawasan berita terkini & pengetahuan umum
                </p>
              </div>
            </div>

            {/* Hoax Game Card */}
            <div
              onClick={() => handleGameSelect('hoax')}
              className={`cursor-pointer group relative overflow-hidden p-6 rounded-2xl transition-all duration-300 transform ${
                selectedGame === 'hoax'
                  ? 'bg-gradient-to-br from-red-600 to-red-400 text-white scale-105 shadow-2xl ring-4 ring-red-300'
                  : 'bg-white text-gray-800 hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              <div className={`absolute -right-4 -top-4 text-9xl opacity-10 transition-transform group-hover:scale-110 ${selectedGame === 'hoax' ? 'text-white' : 'text-red-500'}`}>
                 <i className="fas fa-shield-alt"></i>
              </div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`text-5xl mb-4 ${selectedGame === 'hoax' ? 'text-white' : 'text-red-500'}`}>
                   <i className="fas fa-user-secret"></i>
                </div>
                <h3 className="font-display font-black text-2xl mb-2 tracking-wide">HOAX BUSTER</h3>
                <p className={`font-medium text-sm ${selectedGame === 'hoax' ? 'text-red-100' : 'text-gray-500'}`}>
                  Tangkap berita palsu sebelum menyebar luas
                </p>
              </div>
            </div>

            {/* Puzzle Game Card */}
            <div
              onClick={() => handleGameSelect('puzzle')}
              className={`cursor-pointer group relative overflow-hidden p-6 rounded-2xl transition-all duration-300 transform ${
                selectedGame === 'puzzle'
                  ? 'bg-gradient-to-br from-purple-600 to-purple-400 text-white scale-105 shadow-2xl ring-4 ring-purple-300'
                  : 'bg-white text-gray-800 hover:shadow-xl hover:-translate-y-1'
              }`}
            >
               <div className={`absolute -right-4 -top-4 text-9xl opacity-10 transition-transform group-hover:scale-110 ${selectedGame === 'puzzle' ? 'text-white' : 'text-purple-500'}`}>
                 <i className="fas fa-puzzle-piece"></i>
              </div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`text-5xl mb-4 ${selectedGame === 'puzzle' ? 'text-white' : 'text-purple-500'}`}>
                   <i className="fas fa-cubes"></i>
                </div>
                <h3 className="font-display font-black text-2xl mb-2 tracking-wide">REDAKSI PUZZLE</h3>
                <p className={`font-medium text-sm ${selectedGame === 'puzzle' ? 'text-purple-100' : 'text-gray-500'}`}>
                  Susun potongan berita menjadi utuh
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Time Limit Selection */}
        <div className="glass-panel rounded-2xl p-8 mb-8">
          <h2 className="font-bold text-gray-800 mb-6 text-xl">⏱️ PILIH BATAS WAKTU:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {timeLimits.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`py-4 px-4 rounded-lg font-bold text-lg transition-all transform ${
                  selectedTime === time
                    ? 'bg-news-blue text-white scale-110 shadow-xl ring-4 ring-news-blue'
                    : 'bg-blue-200 text-gray-700 hover:bg-blue-300 hover:scale-105'
                }`}
              >
                <div className="text-2xl">{time === 60 ? '1' : time === 120 ? '2' : time === 180 ? '3' : '5'}</div>
                <div className="text-xs">Menit</div>
              </button>
            ))}
          </div>
        </div>

        {/* Play Button - Only shows when both game and time selected */}
        {canPlay && (
          <div className="flex justify-center">
            <button
              onClick={handlePlay}
              className="bg-gradient-to-r from-news-green to-news-blue hover:from-news-green/80 hover:to-news-blue/80 text-white px-12 py-4 rounded-full font-bold text-2xl transition transform hover:scale-105 shadow-xl animate-pulse"
            >
              ▶️ MAINKAN GAME
            </button>
          </div>
        )}

        {/* Guidance Text */}
        {!canPlay && (
          <div className="text-center">
            <p className="text-white/80 font-bold text-lg drop-shadow-lg">
              Pilih jenis game dan waktu untuk memulai
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
