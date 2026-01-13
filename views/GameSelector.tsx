import React from 'react';
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
  const timeLimits = [60, 120, 180, 300];
  const games = [
    {
      id: 'quiz',
      name: 'Uji Kompetensi',
      description: 'Race jawab soal berita dengan cepat dan tepat!',
      icon: 'brain',
      color: 'bg-blue-500',
      borderColor: 'border-blue-500',
    },
    {
      id: 'hoax',
      name: 'Hoax Buster Battle',
      description: 'Tap berita hoaks secepat kilat!',
      icon: 'shield-alt',
      color: 'bg-red-500',
      borderColor: 'border-red-500',
    },
    {
      id: 'puzzle',
      name: 'Puzzle Redaksi',
      description: 'Drag-drop susun berita dengan tepat!',
      icon: 'puzzle-piece',
      color: 'bg-purple-500',
      borderColor: 'border-purple-500',
    },
  ];

  const handleGameSelect = (gameMode: 'quiz' | 'hoax' | 'puzzle', timeLimit: number) => {
    AudioService.playClick();
    onSelectGame(gameMode, timeLimit);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-news-yellow via-news-pink to-news-purple p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
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

        {/* Time Limit Selection */}
        <div className="glass-panel rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-gray-800 mb-4">⏱️ PILIH BATAS WAKTU:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {timeLimits.map((time) => (
              <div key={time} className="text-center">
                <button
                  onClick={() => handleGameSelect('quiz', time)}
                  className="group w-full bg-news-blue hover:bg-news-blue/80 text-white p-3 rounded-lg font-bold transition transform hover:scale-105"
                  title="Waktu berlaku untuk semua game"
                >
                  <div className="text-2xl mb-1">{time === 60 ? '1' : time === 120 ? '2' : time === 180 ? '3' : '5'}</div>
                  <div className="text-xs">
                    {time === 60 ? '1 Menit' : time === 120 ? '2 Menit' : time === 180 ? '3 Menit' : '5 Menit'}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Game Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game: any) => (
            <div
              key={game.id}
              className={`glass-panel rounded-3xl p-8 border-4 ${game.borderColor} hover:shadow-2xl transition transform hover:-translate-y-2 cursor-pointer`}
              onClick={() => {
                AudioService.playClick();
                // Open time selector modal for this game
              }}
            >
              <div className={`${game.color} rounded-2xl p-6 mb-6 text-white`}>
                <i className={`fas fa-${game.icon} text-5xl`}></i>
              </div>
              
              <h3 className="font-display text-2xl font-bold text-gray-800 mb-2">
                {game.name}
              </h3>
              
              <p className="text-gray-600 font-bold mb-6">{game.description}</p>

              {/* Time buttons for each game */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-bold uppercase mb-3">Pilih waktu:</p>
                <div className="grid grid-cols-2 gap-2">
                  {timeLimits.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleGameSelect(game.id as 'quiz' | 'hoax' | 'puzzle', time)}
                      className={`${game.color} text-white py-2 px-3 rounded-lg font-bold text-sm hover:opacity-90 transition`}
                    >
                      {time === 60 ? '1m' : time === 120 ? '2m' : time === 180 ? '3m' : '5m'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
