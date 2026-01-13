import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { AudioService } from '../services/audioService';
import { PuzzleLevel, User, PlayerStats } from '../types';

interface PuzzlePiece {
  id: string;
  text: string;
  correctZone: 'headline' | 'lead' | 'body';
}

export const PuzzleView: React.FC<{ user: User; onExit: () => void }> = ({ user, onExit }) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [difficulty, setDifficulty] = useState<'mudah' | 'sulit'>('mudah');
  const [levels, setLevels] = useState<PuzzleLevel[]>([]);
  const [solvedCount, setSolvedCount] = useState(0);
  
  // Gameplay State
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [zones, setZones] = useState<{headline: string|null, lead: string|null, body: string|null}>({
    headline: null, lead: null, body: null
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  // Load Puzzles
  useEffect(() => {
    DataService.getPuzzles().then((data) => {
        // Randomize the order of levels for variety
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setLevels(shuffled);
    });
  }, []);

  const startGame = (diff: 'mudah' | 'sulit') => {
    AudioService.playClick();
    setDifficulty(diff);
    // Filter levels based on difficulty
    const filteredLevels = levels.filter(l => l.difficulty === diff);
    // Limit: Mudah (10), Sulit (20) - or as many as available
    const maxLevels = diff === 'mudah' ? 10 : 20;
    setLevels(filteredLevels.slice(0, maxLevels));
    setCurrentLevelIdx(0);
    setGameState('playing');
  };

  // Initialize Level
  useEffect(() => {
    if (gameState === 'playing' && levels[currentLevelIdx]) {
        const lvl = levels[currentLevelIdx];
        const newPieces: PuzzlePiece[] = [
            { id: 'h', text: lvl.headline, correctZone: 'headline' },
            { id: 'l', text: lvl.lead, correctZone: 'lead' },
            { id: 'b', text: lvl.body, correctZone: 'body' }
        ];
        // Shuffle pieces
        setPieces(newPieces.sort(() => 0.5 - Math.random()));
        setZones({ headline: null, lead: null, body: null });
        setFeedback(null);
    }
  }, [currentLevelIdx, gameState, levels]);

  const handleDragStart = (e: React.DragEvent, pieceId: string) => {
    e.dataTransfer.setData("pieceId", pieceId);
  };

  const handleDrop = (e: React.DragEvent, zone: 'headline' | 'lead' | 'body') => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData("pieceId");
    const piece = pieces.find(p => p.id === pieceId);

    if (!piece) return;

    // Check correctness immediately
    if (piece.correctZone === zone) {
        // Correct placement
        setZones(prev => ({ ...prev, [zone]: piece.text }));
        setPieces(prev => prev.filter(p => p.id !== pieceId));
        AudioService.playCorrect();
        
        // Check if level complete (all zones filled)
        const isFinished = 
            (zone === 'headline' || zones.headline) && 
            (zone === 'lead' || zones.lead) && 
            (zone === 'body' || zones.body);
            
        if (isFinished) {
            setTimeout(nextLevel, 1000);
        }
    } else {
        // Wrong placement
        setFeedback("Salah tempat! Coba baca lagi isinya.");
        AudioService.playWrong();
        setTimeout(() => setFeedback(null), 2000);
    }
  };

  const nextLevel = () => {
    if (currentLevelIdx + 1 < levels.length) {
        setCurrentLevelIdx(curr => curr + 1);
        setSolvedCount(s => s + 1);
        AudioService.playCorrect();
    } else {
        setSolvedCount(s => s + 1);
        setGameState('finished');
        AudioService.playWin();
    }
  };

  if (gameState === 'menu') {
      return (
          <div className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
              <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-pop-in">
                  <div className="md:w-1/2 p-10 flex flex-col justify-center items-center bg-news-purple text-white text-center">
                      <i className="fas fa-puzzle-piece text-8xl mb-6 animate-bounce"></i>
                      <h1 className="font-display text-4xl font-bold mb-2">PUZZLE REDAKSI</h1>
                      <p className="text-lg opacity-90">Susun potongan naskah menjadi berita utuh yang benar.</p>
                  </div>
                  <div className="md:w-1/2 p-10 flex flex-col justify-center gap-6">
                      <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">Pilih Tingkat Kesulitan</h2>
                      
                      <button onClick={() => startGame('mudah')} className="group relative p-6 bg-green-50 border-2 border-green-200 rounded-2xl hover:bg-green-100 transition shadow-sm text-left flex items-center">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 group-hover:scale-110 transition">1</div>
                          <div>
                              <h3 className="font-bold text-xl text-green-700">Wartawan Magang (Mudah)</h3>
                              <p className="text-sm text-gray-500">Target: 10 Berita Sekolah</p>
                          </div>
                      </button>

                      <button onClick={() => startGame('sulit')} className="group relative p-6 bg-red-50 border-2 border-red-200 rounded-2xl hover:bg-red-100 transition shadow-sm text-left flex items-center">
                          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 group-hover:scale-110 transition">2</div>
                          <div>
                              <h3 className="font-bold text-xl text-red-700">Pemimpin Redaksi (Sulit)</h3>
                              <p className="text-sm text-gray-500">Target: 20 Berita Nasional</p>
                          </div>
                      </button>

                      <button onClick={onExit} className="mt-4 text-gray-400 font-bold hover:text-gray-600">Kembali ke Lobi</button>
                  </div>
              </div>
          </div>
      );
  }

  if (gameState === 'finished') {
      const saveStats = async () => {
        const stats: PlayerStats = {
          userId: user.id,
          userName: user.name,
          school: user.school,
          totalScore: solvedCount * 100,
          quizCompleted: 0,
          quizCorrect: 0,
          hoaxBusted: 0,
          puzzlesCompleted: solvedCount,
          writingSubmitted: 0,
          achievements: [],
          lastUpdated: Date.now()
        };

        try {
          await DataService.savePlayerStats(stats);
        } catch (error) {
          console.error("Error saving puzzle stats:", error);
        }

        onExit();
      };

      return (
        <div className="flex-1 bg-news-yellow flex items-center justify-center p-4">
            <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-lg w-full animate-pop-in">
                <i className="fas fa-trophy text-6xl text-news-yellow mb-6"></i>
                <h2 className="font-display text-4xl font-bold text-gray-800 mb-2">LUAR BIASA!</h2>
                <p className="text-gray-500 text-lg mb-8">Kamu berhasil menyusun {solvedCount} berita dengan sempurna.</p>
                <div className="bg-gray-100 p-4 rounded-xl mb-8">
                    <p className="font-bold text-gray-700">Level: <span className="uppercase text-news-blue">{difficulty}</span></p>
                    <p className="font-bold text-gray-700">Status: <span className="text-green-600">KOMPETEN</span></p>
                </div>
                <button onClick={saveStats} className="bg-news-dark text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-black transition">
                    Kembali ke Redaksi
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="flex-1 bg-gray-100 flex flex-col h-screen">
       <div className="bg-white p-4 shadow-md z-20 flex justify-between items-center sticky top-0">
            <button onClick={() => setGameState('menu')} className="text-gray-500 font-bold"><i className="fas fa-arrow-left mr-2"></i> Menyerah</button>
            <div className="bg-news-purple text-white px-6 py-2 rounded-full font-bold shadow text-sm">
                LEVEL {currentLevelIdx + 1} / {levels.length}
            </div>
        </div>
        
        {feedback && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-xl z-50 font-bold animate-bounce">
                <i className="fas fa-exclamation-triangle mr-2"></i> {feedback}
            </div>
        )}
        
        <div className="flex flex-col md:flex-row h-full overflow-hidden">
            {/* Sidebar Pieces */}
            <div className="w-full md:w-1/3 bg-gray-50 p-6 border-r border-gray-200 overflow-y-auto">
                <h3 className="font-bold text-gray-400 text-xs mb-4 uppercase tracking-wider">Potongan Naskah (Acak)</h3>
                <div className="space-y-4">
                    {pieces.map(p => (
                        <div 
                            key={p.id} 
                            draggable 
                            onDragStart={(e) => handleDragStart(e, p.id)}
                            className="bg-white p-4 rounded-xl shadow cursor-grab active:cursor-grabbing border-l-4 border-news-purple hover:bg-purple-50 transition transform hover:-translate-y-1"
                        >
                            {p.text}
                        </div>
                    ))}
                    {pieces.length === 0 && (
                        <div className="text-center py-10 opacity-50">
                            <i className="fas fa-check-circle text-4xl text-green-500 mb-2"></i>
                            <p className="font-bold">Selesai!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Drop Zones */}
            <div className="w-full md:w-2/3 bg-slate-200 p-6 overflow-y-auto relative">
                <div className="max-w-2xl mx-auto space-y-6 pb-20">
                    <h3 className="font-display text-2xl text-center mb-6 text-gray-700 font-bold">Susun Struktur Berita</h3>
                    
                    {/* ZONE 1: HEADLINE */}
                    <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, 'headline')}
                        className={`min-h-[80px] rounded-xl border-4 border-dashed transition flex items-center justify-center p-4 text-center
                            ${zones.headline ? 'bg-news-blue/10 border-news-blue text-news-blue' : 'bg-white/50 border-gray-300 text-gray-400'}
                        `}
                    >
                        {zones.headline ? (
                            <h1 className="font-black text-2xl uppercase">{zones.headline}</h1>
                        ) : (
                            <div>
                                <i className="fas fa-heading text-2xl mb-1 block"></i>
                                <span className="font-bold">JUDUL BERITA (Headline)</span>
                            </div>
                        )}
                    </div>

                    {/* ZONE 2: LEAD */}
                    <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, 'lead')}
                        className={`min-h-[120px] rounded-xl border-4 border-dashed transition flex items-center justify-center p-4 text-center
                            ${zones.lead ? 'bg-news-green/10 border-news-green text-green-800' : 'bg-white/50 border-gray-300 text-gray-400'}
                        `}
                    >
                        {zones.lead ? (
                            <p className="font-bold">{zones.lead}</p>
                        ) : (
                            <div>
                                <i className="fas fa-paragraph text-2xl mb-1 block"></i>
                                <span className="font-bold">TERAS BERITA (Lead)</span>
                                <p className="text-xs mt-1">Paragraf pertama (5W+1H)</p>
                            </div>
                        )}
                    </div>

                    {/* ZONE 3: BODY */}
                    <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, 'body')}
                        className={`min-h-[200px] rounded-xl border-4 border-dashed transition flex items-center justify-center p-4 text-center
                            ${zones.body ? 'bg-news-dark/10 border-gray-600 text-gray-800' : 'bg-white/50 border-gray-300 text-gray-400'}
                        `}
                    >
                        {zones.body ? (
                            <p className="text-justify">{zones.body}</p>
                        ) : (
                            <div>
                                <i className="fas fa-align-justify text-2xl mb-1 block"></i>
                                <span className="font-bold">TUBUH BERITA (Body)</span>
                                <p className="text-xs mt-1">Penjelasan detail & rinci</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
};