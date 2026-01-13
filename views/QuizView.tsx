import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { AudioService } from '../services/audioService';
import { QuizQuestion } from '../types';

export const QuizView: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    DataService.getQuiz().then(setQuestions);
  }, []);

  const handleAnswer = (idx: number) => {
    const isCorrect = idx === questions[currentIdx].correctIndex;
    
    if (isCorrect) {
        setScore(s => s + (100 / questions.length));
        AudioService.playCorrect();
    } else {
        AudioService.playWrong();
    }

    if (currentIdx + 1 < questions.length) {
        setCurrentIdx(c => c + 1);
    } else {
        setFinished(true);
        AudioService.playWin();
    }
  };

  if (questions.length === 0) return <div className="p-10 text-center">Memuat soal...</div>;

  return (
    <div className="flex-1 bg-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative border-b-8 border-news-pink animate-pop-in">
             <button onClick={onExit} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"><i className="fas fa-times text-2xl"></i></button>
             
             {!finished ? (
                 <div>
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-news-pink">Kuis Redaksi</h2>
                        <span className="bg-pink-100 text-news-pink px-3 py-1 rounded-full text-xs font-bold">Soal {currentIdx + 1} / {questions.length}</span>
                     </div>
                     
                     <h3 className="text-xl font-bold mb-8 text-gray-800">{questions[currentIdx].question}</h3>
                     
                     <div className="space-y-3">
                         {questions[currentIdx].options.map((opt, i) => (
                             <button 
                                key={i}
                                onClick={() => handleAnswer(i)}
                                className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:bg-pink-50 hover:border-news-pink transition font-bold text-gray-600"
                             >
                                {opt}
                             </button>
                         ))}
                     </div>
                 </div>
             ) : (
                 <div className="text-center py-8">
                     <h2 className="text-3xl font-bold mb-4 text-gray-800">Evaluasi Selesai!</h2>
                     <p className="text-gray-500 mb-2">Nilai Akhir Kamu</p>
                     <p className="text-8xl font-black text-news-pink mb-8 drop-shadow-sm">{Math.round(score)}</p>
                     <button onClick={onExit} className="bg-news-pink text-white px-10 py-3 rounded-full font-bold text-xl shadow hover:bg-pink-600 transition transform hover:scale-105">
                        Kembali ke Lobi
                     </button>
                 </div>
             )}
        </div>
    </div>
  );
};