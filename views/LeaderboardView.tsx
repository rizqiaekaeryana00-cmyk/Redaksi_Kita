import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';
import { DataService } from '../services/dataService';
import { AudioService } from '../services/audioService';

interface LeaderboardViewProps {
  onExit: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onExit }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    const data = await DataService.getLeaderboard(100);
    setLeaderboard(data);
    setLoading(false);
  };

  const filteredLeaderboard = leaderboard.filter(player =>
    player.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-news-blue to-news-purple p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
            🏆 PAPAN PERINGKAT
          </h1>
          <p className="text-white/80">Lihat ranking terbaik jurnalis REDaksi KITA</p>
        </div>
        <button
          onClick={() => {
            AudioService.playClick();
            onExit();
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold transition-transform hover:scale-105"
        >
          ← Kembali
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari pemain atau sekolah..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border-2 border-white/20 focus:border-white/50 bg-white/10 text-white placeholder-white/50 focus:outline-none"
        />
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div className="text-center text-white text-xl">Memuat data...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full glass-panel rounded-2xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-news-yellow/30 to-news-pink/30">
                <th className="px-4 py-3 text-left font-bold text-gray-800">Rank</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Nama</th>
                <th className="px-4 py-3 text-left font-bold text-gray-800">Sekolah</th>
                <th className="px-4 py-3 text-center font-bold text-gray-800">Skor</th>
                <th className="px-4 py-3 text-center font-bold text-gray-800">Akurasi</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaderboard.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    Belum ada pemain
                  </td>
                </tr>
              ) : (
                filteredLeaderboard.map((player) => (
                  <tr key={player.userId} className="border-t border-gray-200 hover:bg-white/20 transition">
                    <td className="px-4 py-3 font-bold text-lg">
                      {getMedalIcon(player.rank)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-800">{player.userName}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{player.school}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-news-blue text-white px-3 py-1 rounded-full font-bold">
                        {player.totalScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-news-green h-2 rounded-full transition-all"
                            style={{ width: `${player.accuracy}%` }}
                          />
                        </div>
                        <span className="font-bold text-gray-800 w-8">{player.accuracy}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Stats Summary */}
      {leaderboard.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-news-blue">
              {leaderboard[0]?.totalScore || 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">Skor Tertinggi</div>
          </div>
          <div className="glass-panel rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-news-green">
              {leaderboard.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Peserta</div>
          </div>
          <div className="glass-panel rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-news-yellow">
              {leaderboard.reduce((sum, p) => sum + p.achievements.length, 0)}
            </div>
            <div className="text-sm text-gray-600 mt-1">Pencapaian Total</div>
          </div>
          <div className="glass-panel rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-news-red">
              {Math.round(
                leaderboard.reduce((sum, p) => sum + p.accuracy, 0) / leaderboard.length
              )}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Akurasi Rata-rata</div>
          </div>
        </div>
      )}
    </div>
  );
};
