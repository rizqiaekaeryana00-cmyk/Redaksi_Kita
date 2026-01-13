import React, { useState, useEffect, useRef } from 'react';
import { DataService } from '../services/dataService';
import { AudioService } from '../services/audioService';
import { NewsItem } from '../types';

interface HoaxGameProps {
  onExit: () => void;
}

interface Target {
  id: number;
  news: NewsItem;
  top: number; // percentage
  left: number; // percentage
}

export const HoaxGameView: React.FC<HoaxGameProps> = ({ onExit }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [lives, setLives] = useState(3);
  const [targets, setTargets] = useState<Target[]>([]);
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  
  // Refs untuk interval agar bisa di-clear dengan benar
  const timerIntervalRef = useRef<number | null>(null);
  const spawnerIntervalRef = useRef<number | null>(null);
  
  // Ref untuk akses state terbaru di dalam interval
  const allNewsRef = useRef<NewsItem[]>([]);

  // Load News Data
  useEffect(() => {
    DataService.getNews().then((data) => {
        setAllNews(data);
        allNewsRef.current = data;
    });
  }, []);

  // Effect 1: TIMER LOOP
  useEffect(() => {
    if (isPlaying && timer > 0 && lives > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    } else if (timer === 0 || lives === 0) {
       if (isPlaying) endGame();
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isPlaying, timer, lives]);

  // Effect 2: SPAWNER LOOP (Terpisah dari timer agar tidak reset tiap detik)
  useEffect(() => {
      if (isPlaying && !gameOver) {
          spawnerIntervalRef.current = window.setInterval(spawnTarget, 1200); // Muncul tiap 1.2 detik
      }
      return () => {
          if (spawnerIntervalRef.current) clearInterval(spawnerIntervalRef.current);
      };
  }, [isPlaying, gameOver]);

  const spawnTarget = () => {
    // Gunakan ref untuk memastikan data berita tersedia
    const newsPool = allNewsRef.current;
    if (!newsPool || newsPool.length === 0) return;

    const randomNews = newsPool[Math.floor(Math.random() * newsPool.length)];
    const newTarget: Target = {
      id: Date.now(),
      news: randomNews,
      top: 15 + Math.random() * 60, // Batasi area agar tidak tertutup HUD
      left: 10 + Math.random() * 70,
    };

    setTargets(prev => [...prev, newTarget]);
    
    // Auto remove target after 3s if not clicked
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== newTarget.id));
    }, 3000);
  };

  const startGame = () => {
    if (allNews.length === 0) {
        alert("Sedang memuat data berita... coba sesaat lagi.");
        return;
    }
    setScore(0);
    setTimer(60);
    setLives(3);
    setTargets([]);
    setIsPlaying(true);
    setGameOver(false);
    AudioService.playClick();
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    setTargets([]); // Clear targets visual
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (spawnerIntervalRef.current) clearInterval(spawnerIntervalRef.current);
    AudioService.playWrong();
  };

  const handleShoot = (target: Target) => {
    // Prevent clicking if game is over
    if (gameOver) return;

    if (target.news.type === 'hoax') {
      AudioService.playShoot();
      setScore(s => s + 100);
    } else {
      AudioService.playWrong();
      setLives(l => {
          const newLives = l - 1;
          if (newLives <= 0) endGame();
          return newLives;
      });
      setScore(s => Math.max(0, s - 50));
    }
    // Remove clicked target immediately
    setTargets(prev => prev.filter(t => t.id !== target.id));
  };

  return (
    <div className="fixed inset-0 bg-gray-900 cursor-crosshair overflow-hidden font-sans select-none">
      
      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
          <button onClick={onExit} className="pointer-events-auto bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-xl font-bold backdrop-blur-sm border border-white/30 transition flex items-center gap-2">
              <i className="fas fa-arrow-left"></i> Keluar
          </button>
          
          <div className="flex gap-4 pointer-events-auto">
                <div className="bg-gray-800/80 backdrop-blur text-white px-6 py-2 rounded-full border-2 border-gray-600 flex flex-col items-center min-w-[100px]">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Waktu</span>
                  <span className="text-2xl font-mono font-bold text-news-yellow">{timer}</span>
              </div>
              <div className="bg-gray-800/80 backdrop-blur text-white px-6 py-2 rounded-full border-2 border-news-red flex flex-col items-center min-w-[120px]">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Skor</span>
                  <span className="text-2xl font-mono font-bold text-news-red">{score}</span>
              </div>
          </div>

          <div className="bg-gray-800/80 backdrop-blur px-4 py-2 rounded-full border border-white/20 flex gap-2 pointer-events-auto">
            {[...Array(3)].map((_, i) => (
               <i key={i} className={`fas fa-heart ${i < lives ? 'text-red-500' : 'text-gray-600'}`}></i>
            ))}
          </div>
      </div>

      {/* Game Area */}
      <div className="absolute inset-0 z-10">
        {targets.map(t => (
          <div 
            key={t.id}
            onMouseDown={(e) => { e.stopPropagation(); handleShoot(t); }}
            className={`absolute px-6 py-4 rounded-xl shadow-lg border-b-4 cursor-pointer transform hover:scale-110 active:scale-95 transition-transform animate-pop-in max-w-xs text-center font-bold text-white select-none
              ${t.news.type === 'hoax' 
                ? 'bg-red-500 border-red-700 hover:bg-red-400' 
                : 'bg-green-500 border-green-700 hover:bg-green-400'
              }`}
            style={{ top: `${t.top}%`, left: `${t.left}%`, zIndex: 20 }}
          >
            {t.news.text}
          </div>
        ))}
      </div>

      {/* Start / Game Over Screen */}
      {(!isPlaying || gameOver) && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
            <div className="max-w-md w-full animate-float">
                {gameOver ? (
                   <>
                    <h1 className="font-display text-6xl font-black text-news-yellow mb-4">{lives > 0 ? "MISI SELESAI" : "GAME OVER"}</h1>
                    <div className="text-white text-2xl mb-2">Skor Akhir</div>
                    <div className="text-news-yellow text-6xl font-mono font-bold mb-8">{score}</div>
                   </>
                ) : (
                  <>
                    <i className="fas fa-crosshairs text-6xl text-news-red mb-4"></i>
                    <h1 className="font-display text-5xl font-black text-white mb-2 tracking-wide">HOAX BUSTER</h1>
                    <p className="text-gray-300 font-bold text-lg mb-6">Misi: Tembak Judul Berita Palsu!</p>
                  </>
                )}
                
                <div className="bg-white/10 rounded-2xl p-6 text-left mb-8 border border-white/20">
                    <ul className="space-y-2 text-sm text-white">
                        <li className="flex items-center"><i className="fas fa-bullseye text-red-500 w-6 mr-2"></i> Tembak berita <b>HOAKS</b>.</li>
                        <li className="flex items-center"><i className="fas fa-ban text-green-500 w-6 mr-2"></i> JANGAN tembak berita <b>ASLI</b>.</li>
                        <li className="flex items-center"><i className="fas fa-heart text-pink-500 w-6 mr-2"></i> 3 Nyawa. Habis = Game Over.</li>
                    </ul>
                </div>

                <div className="flex gap-4 justify-center">
                   <button onClick={startGame} className="bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-xl py-4 px-12 rounded-full shadow-lg hover:scale-105 transition">
                      {gameOver ? 'Main Lagi' : 'Mulai Misi'}
                   </button>
                   {gameOver && <button onClick={onExit} className="bg-white text-gray-800 font-bold py-3 px-8 rounded-full">Keluar</button>}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};