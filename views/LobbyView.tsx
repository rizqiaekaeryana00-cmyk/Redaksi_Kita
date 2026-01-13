import React from 'react';
import { User } from '../types';

interface LobbyProps {
  user: User;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
}

export const LobbyView: React.FC<LobbyProps> = ({ user, onNavigate, onLogout, onOpenAdmin }) => {
  return (
    <div className="flex-1 flex flex-col pb-16">
       {/* Header */}
       <div className="sticky top-0 z-40 glass-panel shadow-sm px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-news-blue text-white flex items-center justify-center border-2 border-white shadow animate-pulse">
                    <i className="fas fa-id-card"></i>
                </div>
                <div>
                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-wider">Jurnalis Aktif</div>
                    <div className="font-display text-lg font-bold text-news-dark leading-none">{user.name}</div>
                </div>
            </div>
            <div className="flex gap-2">
                {user.role === 'admin' && (
                  <button onClick={onOpenAdmin} className="bg-gray-800 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-black transition">
                     <i className="fas fa-tools mr-2"></i>Admin
                  </button>
                )}
                <button onClick={onLogout} className="bg-white text-red-500 border border-red-200 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-50 transition">
                    Keluar
                </button>
            </div>
        </div>

        <div className="container mx-auto p-4 md:p-8 max-w-6xl">
            {/* Hero */}
            <div className="text-center mb-10 mt-4">
                <h1 className="font-display text-5xl md:text-7xl font-black text-news-dark drop-shadow-sm tracking-wide mb-2">
                    REDaksi <span className="text-news-blue">KITA</span>
                </h1>
                <p className="text-gray-500 font-bold text-sm md:text-base">Belajar. Bermain. Berkarya.</p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MenuCard 
                    icon="tv" color="text-news-blue" bg="bg-blue-100" 
                    title="Ruang Berita" subtitle="Materi & Contoh" 
                    onClick={() => onNavigate('briefing')} 
                />
                <MenuCard 
                    icon="puzzle-piece" color="text-news-purple" bg="bg-purple-100" 
                    title="Puzzle Redaksi" subtitle="Game Susun Berita" 
                    onClick={() => onNavigate('arena')} 
                />
                <MenuCard 
                    icon="pen-nib" color="text-news-green" bg="bg-green-100" 
                    title="Meja Tulis" subtitle="Praktik Menulis" 
                    onClick={() => onNavigate('writing-desk')} 
                />
                <MenuCard 
                    icon="star" color="text-news-pink" bg="bg-pink-100" 
                    title="Uji Kompetensi" subtitle="Kuis Interaktif" 
                    onClick={() => onNavigate('evaluation')} 
                />
                
                {/* Large Hoax Buster Card */}
                <div onClick={() => onNavigate('hoax-game')} className="group glass-panel rounded-3xl p-6 cursor-pointer hover:border-news-red relative overflow-hidden transition-all duration-300 transform hover:-translate-y-2 md:col-span-2 bg-gradient-to-r from-white to-red-50">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-100 rounded-full opacity-50 group-hover:scale-150 transition duration-500"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="bg-red-100 p-4 rounded-full">
                            <i className="fas fa-shield-alt text-5xl text-news-red drop-shadow-sm animate-pulse"></i>
                        </div>
                        <div>
                            <h3 className="font-display text-2xl font-bold text-news-red">HOAX BUSTER</h3>
                            <p className="text-sm font-bold text-gray-500 mt-1">Game Tembak Berita Palsu!</p>
                            <span className="inline-block bg-red-600 text-white text-[10px] px-2 py-1 rounded-full mt-2 font-bold uppercase tracking-wider">Mode Arcade</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Ticker */}
        <div className="fixed bottom-0 w-full bg-news-dark text-white py-2 overflow-hidden z-50 border-t-4 border-news-yellow shadow-lg">
            <div className="whitespace-nowrap animate-[ticker_20s_linear_infinite] font-mono font-bold text-sm px-4">
                +++ BREAKING NEWS: HOAX BUSTER Mode Kini Telah Dibuka! +++ Basmi berita palsu sekarang juga +++ Jadilah jurnalis cerdas anti-hoaks +++ REDaksi KITA Siap Mengudara +++
            </div>
        </div>
    </div>
  );
};

const MenuCard: React.FC<{icon: string, color: string, bg: string, title: string, subtitle: string, onClick: () => void}> = ({icon, color, bg, title, subtitle, onClick}) => (
    <div onClick={onClick} className={`group glass-panel rounded-3xl p-6 cursor-pointer hover:border-current relative overflow-hidden transition-all duration-300 transform hover:-translate-y-2 ${color}`}>
        <div className={`absolute -right-6 -top-6 w-24 h-24 ${bg} rounded-full opacity-50 group-hover:scale-150 transition duration-500`}></div>
        <i className={`fas fa-${icon} text-5xl mb-4 drop-shadow-sm relative z-10`}></i>
        <h3 className="font-display text-xl font-bold text-gray-800 relative z-10">{title}</h3>
        <p className="text-xs font-bold text-gray-400 mt-1 relative z-10">{subtitle}</p>
    </div>
);