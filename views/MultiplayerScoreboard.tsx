import React, { useEffect, useState } from 'react';
import { AudioService } from '../services/audioService';

interface MultiplayerScoreboardProps {
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  gameMode: string;
  onPlayAgain: () => void;
  onExit: () => void;
}

export const MultiplayerScoreboard: React.FC<MultiplayerScoreboardProps> = ({
  player1Name,
  player2Name,
  player1Score,
  player2Score,
  gameMode,
  onPlayAgain,
  onExit,
}) => {
  const [showWinner, setShowWinner] = useState(false);
  const winner = player1Score > player2Score ? 1 : player2Score > player1Score ? 2 : 0;

  useEffect(() => {
    AudioService.playWin();
    setTimeout(() => setShowWinner(true), 500);
  }, []);

  const getGameModeName = () => {
    switch (gameMode) {
      case 'quiz':
        return 'Uji Kompetensi';
      case 'hoax':
        return 'Hoax Buster Battle';
      case 'puzzle':
        return 'Puzzle Redaksi';
      default:
        return 'Multiplayer Game';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-news-yellow via-news-pink to-news-purple p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl font-black text-white drop-shadow-lg mb-2">
            ⏱️ WAKTU HABIS!
          </h1>
          <p className="text-white/90 font-bold text-lg">{getGameModeName()}</p>
        </div>

        {/* Scores Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Player 1 */}
          <div
            className={`glass-panel rounded-3xl p-8 text-center border-4 border-news-green transform transition ${
              showWinner && winner === 1 ? 'scale-110' : ''
            }`}
          >
            {winner === 1 && showWinner && (
              <div className="mb-4 animate-bounce">
                <i className="fas fa-crown text-5xl text-yellow-500"></i>
              </div>
            )}
            <h2 className="font-display text-3xl font-bold text-gray-800 mb-4">{player1Name}</h2>
            <div className={`text-6xl font-black mb-2 ${winner === 1 ? 'text-news-green' : 'text-gray-400'}`}>
              {player1Score}
            </div>
            <p className="text-sm text-gray-600 font-bold">POIN</p>

            {winner === 1 && showWinner && (
              <div className="mt-6 p-4 bg-news-green/20 rounded-2xl">
                <p className="text-news-green font-black text-xl">🏆 PEMENANG! 🏆</p>
              </div>
            )}
          </div>

          {/* Player 2 */}
          <div
            className={`glass-panel rounded-3xl p-8 text-center border-4 border-news-red transform transition ${
              showWinner && winner === 2 ? 'scale-110' : ''
            }`}
          >
            {winner === 2 && showWinner && (
              <div className="mb-4 animate-bounce">
                <i className="fas fa-crown text-5xl text-yellow-500"></i>
              </div>
            )}
            <h2 className="font-display text-3xl font-bold text-gray-800 mb-4">{player2Name}</h2>
            <div className={`text-6xl font-black mb-2 ${winner === 2 ? 'text-news-red' : 'text-gray-400'}`}>
              {player2Score}
            </div>
            <p className="text-sm text-gray-600 font-bold">POIN</p>

            {winner === 2 && showWinner && (
              <div className="mt-6 p-4 bg-news-red/20 rounded-2xl">
                <p className="text-news-red font-black text-xl">🏆 PEMENANG! 🏆</p>
              </div>
            )}
          </div>
        </div>

        {/* Draw message */}
        {winner === 0 && showWinner && (
          <div className="mb-12 glass-panel rounded-3xl p-8 text-center border-4 border-news-yellow">
            <i className="fas fa-handshake text-5xl text-news-yellow mb-4"></i>
            <h2 className="font-display text-3xl font-bold text-gray-800">SERI!</h2>
            <p className="text-gray-600 font-bold mt-2">Kedua jurnalis sama hebatnya! 👏</p>
          </div>
        )}

        {/* Ranking Table */}
        <div className="mb-12">
          <h3 className="font-bold text-white text-lg mb-4 text-center">PERINGKAT AKHIR</h3>
          <div className="glass-panel rounded-2xl p-6 overflow-hidden">
            <table className="w-full">
              <tbody>
                {winner === 1 ? (
                  <>
                    <tr className="border-b-2 border-news-green/20 hover:bg-news-green/10">
                      <td className="py-4 px-4 font-bold text-2xl text-news-green">🥇</td>
                      <td className="py-4 px-4 font-bold text-lg text-gray-800">{player1Name}</td>
                      <td className="py-4 px-4 text-right font-black text-2xl text-news-green">{player1Score}</td>
                    </tr>
                    <tr className="hover:bg-news-red/10">
                      <td className="py-4 px-4 font-bold text-2xl text-gray-400">🥈</td>
                      <td className="py-4 px-4 font-bold text-lg text-gray-800">{player2Name}</td>
                      <td className="py-4 px-4 text-right font-black text-2xl text-gray-400">{player2Score}</td>
                    </tr>
                  </>
                ) : winner === 2 ? (
                  <>
                    <tr className="border-b-2 border-news-red/20 hover:bg-news-red/10">
                      <td className="py-4 px-4 font-bold text-2xl text-news-red">🥇</td>
                      <td className="py-4 px-4 font-bold text-lg text-gray-800">{player2Name}</td>
                      <td className="py-4 px-4 text-right font-black text-2xl text-news-red">{player2Score}</td>
                    </tr>
                    <tr className="hover:bg-news-green/10">
                      <td className="py-4 px-4 font-bold text-2xl text-gray-400">🥈</td>
                      <td className="py-4 px-4 font-bold text-lg text-gray-800">{player1Name}</td>
                      <td className="py-4 px-4 text-right font-black text-2xl text-gray-400">{player1Score}</td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr className="border-b-2 border-news-yellow/20 hover:bg-news-yellow/10">
                      <td className="py-4 px-4 font-bold text-2xl">🥇</td>
                      <td className="py-4 px-4 font-bold text-lg text-gray-800">{player1Name}</td>
                      <td className="py-4 px-4 text-right font-black text-2xl text-news-yellow">{player1Score}</td>
                    </tr>
                    <tr className="hover:bg-news-yellow/10">
                      <td className="py-4 px-4 font-bold text-2xl">🥇</td>
                      <td className="py-4 px-4 font-bold text-lg text-gray-800">{player2Name}</td>
                      <td className="py-4 px-4 text-right font-black text-2xl text-news-yellow">{player2Score}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onPlayAgain}
            className="bg-gradient-to-r from-news-green to-news-blue text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:scale-105 transition"
          >
            <i className="fas fa-redo mr-2"></i>MAIN LAGI
          </button>
          <button
            onClick={onExit}
            className="bg-white text-news-dark font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            <i className="fas fa-home mr-2"></i>KEMBALI KE LOBBY
          </button>
        </div>
      </div>
    </div>
  );
};
