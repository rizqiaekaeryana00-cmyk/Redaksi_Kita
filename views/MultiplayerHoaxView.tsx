import React, { useState, useEffect, useRef } from 'react';
import { DataService } from '../services/dataService';
import { AudioService } from '../services/audioService';
import { NewsItem } from '../types';

interface MultiplayerHoaxViewProps {
  player1Name: string;
  player2Name: string;
  timeLimit: number;
  onGameEnd: (p1Score: number, p2Score: number, p1Correct: number, p2Correct: number) => void;
}

interface SpawnedNews {
  id: string;
  news: NewsItem;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  spawnTime: number;
}

export const MultiplayerHoaxView: React.FC<MultiplayerHoaxViewProps> = ({
  player1Name,
  player2Name,
  timeLimit,
  onGameEnd,
}) => {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [p1Correct, setP1Correct] = useState(0); // Count of Hoaxes Busted
  const [p2Correct, setP2Correct] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [gameActive, setGameActive] = useState(true);

  const [p1Items, setP1Items] = useState<SpawnedNews[]>([]);
  const [p2Items, setP2Items] = useState<SpawnedNews[]>([]);

  // Refs for items/intervals
  const timerRef = useRef<number | null>(null);
  const spawnerRef = useRef<number | null>(null);
  const newsRef = useRef<NewsItem[]>([]);

  // 1. Fetch News Data
  useEffect(() => {
    DataService.getNews().then((data) => {
      setAllNews(data);
      newsRef.current = data;
    });
  }, []);

  // 2. Timer Logic
  useEffect(() => {
    if (!gameActive) return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameActive]);

  // 3. Spawner Logic
  useEffect(() => {
    if (!gameActive) return;

    spawnerRef.current = window.setInterval(() => {
      spawnItems();
    }, 1000); // Check spawn every 1 second

    return () => {
      if (spawnerRef.current) clearInterval(spawnerRef.current);
    };
  }, [gameActive]);

  const endGame = () => {
    setGameActive(false);
    AudioService.playWin();
  };

  // Watch for game end
  useEffect(() => {
    if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      onGameEnd(p1Score, p2Score, p1Correct, p2Correct);
    }
  }, [timeLeft, gameActive, p1Score, p2Score, p1Correct, p2Correct, onGameEnd]);


  const spawnItems = () => {
    const newsPool = newsRef.current;
    if (newsPool.length === 0) return;

    // Spawn for P1 (70% chance)
    if (Math.random() < 0.7) {
      const item = newsPool[Math.floor(Math.random() * newsPool.length)];
      const spawned: SpawnedNews = {
        id: `p1-${Date.now()}-${Math.random()}`,
        news: item,
        x: Math.random() * 60 + 10, // 10-70% width
        y: Math.random() * 60 + 15, // 15-75% height
        spawnTime: Date.now(),
      };
      setP1Items(prev => [...prev, spawned]);
      
      // Auto remove after 3s
      setTimeout(() => {
        setP1Items(prev => prev.filter(i => i.id !== spawned.id));
      }, 3000);
    }

    // Spawn for P2 (70% chance)
    if (Math.random() < 0.7) {
      const item = newsPool[Math.floor(Math.random() * newsPool.length)];
      const spawned: SpawnedNews = {
        id: `p2-${Date.now()}-${Math.random()}`,
        news: item,
        x: Math.random() * 60 + 10,
        y: Math.random() * 60 + 15,
        spawnTime: Date.now(),
      };
      setP2Items(prev => [...prev, spawned]);
      
      // Auto remove after 3s
      setTimeout(() => {
        setP2Items(prev => prev.filter(i => i.id !== spawned.id));
      }, 3000);
    }
  };

  const handleTap = (item: SpawnedNews, player: 'p1' | 'p2') => {
    if (!gameActive) return;

    if (item.news.type === 'hoax') {
      // Correct!
      AudioService.playShoot();
      if (player === 'p1') {
        setP1Score(s => s + 10);
        setP1Correct(c => c + 1);
        setP1Items(prev => prev.filter(i => i.id !== item.id));
      } else {
        setP2Score(s => s + 10);
        setP2Correct(c => c + 1);
        setP2Items(prev => prev.filter(i => i.id !== item.id));
      }
    } else {
      // Wrong! Penalty
      AudioService.playWrong();
      if (player === 'p1') {
        setP1Score(s => Math.max(0, s - 5)); // -5 Penalty
        // Shake effect or visual feedback could be added here
        setP1Items(prev => prev.filter(i => i.id !== item.id));
      } else {
        setP2Score(s => Math.max(0, s - 5));
        setP2Items(prev => prev.filter(i => i.id !== item.id));
      }
    }
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
         <div className="text-center mt-2 text-white font-bold text-shadow text-sm uppercase tracking-wider">Detik</div>
      </div>

      {/* PLAYER 1 AREA (Left) */}
      <div className="w-1/2 border-r-2 border-white/10 relative bg-gradient-to-br from-green-900/40 to-gray-900">
         {/* HUD P1 */}
         <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-40 bg-gradient-to-b from-black/80 to-transparent">
             <div>
                <div className="text-news-green font-bold text-xs tracking-[0.2em] uppercase mb-1">Pemain 1</div>
                <div className="text-white text-3xl font-black drop-shadow-md">{player1Name}</div>
             </div>
             <div className="text-right">
                <div className="text-gray-400 font-bold text-xs uppercase mb-1">Skor</div>
                <div className="text-news-green text-5xl font-mono font-bold drop-shadow-lg">{p1Score}</div>
             </div>
         </div>

         {/* Game Field P1 */}
         <div className="absolute inset-0 top-24 z-10 overflow-hidden">
            {p1Items.map(item => (
              <div
                key={item.id}
                onMouseDown={(e) => { e.preventDefault(); handleTap(item, 'p1'); }}
                onTouchStart={(e) => { e.preventDefault(); handleTap(item, 'p1'); }}
                className={`absolute p-4 rounded-xl shadow-lg border-b-4 cursor-pointer transform transition-transform animate-pop-in max-w-[200px] text-center
                   ${item.news.type === 'hoax' 
                      ? 'bg-red-500 border-red-700 hover:bg-red-400 text-white' 
                      : 'bg-green-500 border-green-700 hover:bg-green-400 text-white'
                   }
                `}
                style={{ 
                   top: `${item.y}%`, 
                   left: `${item.x}%`, 
                   transform: 'translate(-50%, -50%) scale(1.0)',
                }}
              >
                  <div className="text-[10px] uppercase font-bold opacity-80 mb-2 tracking-wider">
                    {item.news.type === 'hoax' ? 'BERITA HOAX' : 'BERITA ASLI'}
                  </div>
                  <div className="font-bold text-sm leading-tight line-clamp-3 drop-shadow-sm">
                    {item.news.headline}
                  </div>
              </div>
            ))}
         </div>
      </div>

      {/* PLAYER 2 AREA (Right) */}
      <div className="w-1/2 border-l-2 border-white/10 relative bg-gradient-to-bl from-red-900/40 to-gray-900">
         {/* HUD P2 */}
         <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-40 bg-gradient-to-b from-black/80 to-transparent">
             <div className="text-left">
                <div className="text-gray-400 font-bold text-xs uppercase mb-1">Skor</div>
                <div className="text-news-red text-5xl font-mono font-bold drop-shadow-lg">{p2Score}</div>
             </div>
             <div className="text-right">
                <div className="text-news-red font-bold text-xs tracking-[0.2em] uppercase mb-1">Pemain 2</div>
                <div className="text-white text-3xl font-black drop-shadow-md">{player2Name}</div>
             </div>
         </div>

         {/* Game Field P2 */}
         <div className="absolute inset-0 top-24 z-10 overflow-hidden">
            {p2Items.map(item => (
              <div
                key={item.id}
                onMouseDown={(e) => { e.preventDefault(); handleTap(item, 'p2'); }}
                onTouchStart={(e) => { e.preventDefault(); handleTap(item, 'p2'); }}
                className={`absolute p-4 rounded-xl shadow-lg border-b-4 cursor-pointer transform transition-transform animate-pop-in max-w-[200px] text-center
                   ${item.news.type === 'hoax' 
                      ? 'bg-red-500 border-red-700 hover:bg-red-400 text-white' 
                      : 'bg-green-500 border-green-700 hover:bg-green-400 text-white'
                   }
                `}
                style={{ 
                   top: `${item.y}%`, 
                   left: `${item.x}%`, 
                   transform: 'translate(-50%, -50%) scale(1.0)'
                }}
              >
                  <div className="text-[10px] uppercase font-bold opacity-80 mb-2 tracking-wider">
                    {item.news.type === 'hoax' ? 'BERITA HOAX' : 'BERITA ASLI'}
                  </div>
                  <div className="font-bold text-sm leading-tight line-clamp-3 drop-shadow-sm">
                    {item.news.headline}
                  </div>
              </div>
            ))}
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
