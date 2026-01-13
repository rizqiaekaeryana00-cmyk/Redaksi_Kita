import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { AudioService } from '../services/audioService';
import { QuizQuestion } from '../types';

interface MultiplayerQuizViewProps {
  player1Name: string;
  player2Name: string;
  timeLimit: number; // seconds
  onGameEnd: (player1Score: number, player2Score: number, player1Correct: number, player2Correct: number) => void;
}

export const MultiplayerQuizView: React.FC<MultiplayerQuizViewProps> = ({
  player1Name,
  player2Name,
  timeLimit,
  onGameEnd,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [gameActive, setGameActive] = useState(true);

  // Player 1 (LEFT)
  const [p1Score, setP1Score] = useState(0);
  const [p1Correct, setP1Correct] = useState(0);
  const [p1Answered, setP1Answered] = useState(false);

  // Player 2 (RIGHT)
  const [p2Score, setP2Score] = useState(0);
  const [p2Correct, setP2Correct] = useState(0);
  const [p2Answered, setP2Answered] = useState(false);

  // Load questions
  useEffect(() => {
    DataService.getQuiz().then((data) => {
      const shuffled = [...data].sort(() => 0.5 - Math.random()).slice(0, 10);
      setQuestions(shuffled);
    });
  }, []);

  // Timer
  useEffect(() => {
    if (!gameActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((t) => {
        if (t <= 1) {
          setGameActive(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, timeRemaining]);

  // Game end
  useEffect(() => {
    if (!gameActive && questions.length > 0) {
      setTimeout(() => {
        onGameEnd(p1Score, p2Score, p1Correct, p2Correct);
      }, 1000);
    }
  }, [gameActive]);

  if (questions.length === 0) {
    return (
      <div className="h-screen bg-gradient-to-br from-news-blue to-news-purple flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-2xl font-bold">Mempersiapkan soal...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentIdx];

  const handleAnswer = (playerId: 1 | 2, optionIdx: number) => {
    if (!gameActive) return;

    const isCorrect = optionIdx === question.correctIndex;

    if (playerId === 1) {
      if (!p1Answered) {
        if (isCorrect) {
          setP1Score((s) => s + 10);
          setP1Correct((c) => c + 1);
          AudioService.playCorrect();
        } else {
          AudioService.playWrong();
        }
        setP1Answered(true);
      }
    } else {
      if (!p2Answered) {
        if (isCorrect) {
          setP2Score((s) => s + 10);
          setP2Correct((c) => c + 1);
          AudioService.playCorrect();
        } else {
          AudioService.playWrong();
        }
        setP2Answered(true);
      }
    }
  };

  const moveToNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((c) => c + 1);
      setP1Answered(false);
      setP2Answered(false);
    } else {
      setGameActive(false);
    }
  };

  const bothAnswered = p1Answered && p2Answered;

  return (
    <div className="min-h-screen bg-gradient-to-br from-news-blue to-news-purple p-2 md:p-4 flex flex-col">
      {/* Timer Bar */}
      <div className="glass-panel rounded-2xl p-4 mb-4 text-center">
        <div className="flex justify-between items-center mb-3">
          <div className="text-white font-bold flex-1 text-center">
            <span className="text-2xl font-black">{Math.ceil(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}</span>
          </div>
          <div className="text-gray-600 font-bold text-sm">
            Soal {currentIdx + 1} / {questions.length}
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-news-green to-news-yellow h-full transition-all"
            style={{ width: `${(timeRemaining / timeLimit) * 100}%` }}
          />
        </div>
      </div>

      {/* Split Screen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* PLAYER 1 - LEFT */}
        <div className="glass-panel rounded-2xl p-4 md:p-6 border-4 border-news-green flex flex-col">
          <div className="text-center mb-4 pb-4 border-b-2 border-news-green">
            <h2 className="font-display text-2xl font-bold text-news-green">{player1Name}</h2>
            <div className="text-3xl font-black text-news-green mt-2">{p1Score}</div>
            <p className="text-xs text-gray-600 font-bold">({p1Correct} Benar)</p>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-800 mb-4">{question.question}</h3>
              <div className="space-y-2">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(1, idx)}
                    disabled={p1Answered || !gameActive}
                    className={`w-full p-3 rounded-lg font-bold text-sm transition ${
                      p1Answered
                        ? idx === question.correctIndex
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                        : 'bg-news-green/20 text-gray-800 hover:bg-news-green/40'
                    } ${!gameActive && 'opacity-50 cursor-not-allowed'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {p1Answered && (
              <div className="mt-4 p-3 bg-green-100 rounded-lg text-center text-xs font-bold text-green-700">
                ✓ Terjawab!
              </div>
            )}
          </div>
        </div>

        {/* PLAYER 2 - RIGHT */}
        <div className="glass-panel rounded-2xl p-4 md:p-6 border-4 border-news-red flex flex-col">
          <div className="text-center mb-4 pb-4 border-b-2 border-news-red">
            <h2 className="font-display text-2xl font-bold text-news-red">{player2Name}</h2>
            <div className="text-3xl font-black text-news-red mt-2">{p2Score}</div>
            <p className="text-xs text-gray-600 font-bold">({p2Correct} Benar)</p>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-800 mb-4">{question.question}</h3>
              <div className="space-y-2">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(2, idx)}
                    disabled={p2Answered || !gameActive}
                    className={`w-full p-3 rounded-lg font-bold text-sm transition ${
                      p2Answered
                        ? idx === question.correctIndex
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                        : 'bg-news-red/20 text-gray-800 hover:bg-news-red/40'
                    } ${!gameActive && 'opacity-50 cursor-not-allowed'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {p2Answered && (
              <div className="mt-4 p-3 bg-green-100 rounded-lg text-center text-xs font-bold text-green-700">
                ✓ Terjawab!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Button */}
      {bothAnswered && gameActive && (
        <div className="mt-4 text-center">
          <button
            onClick={moveToNextQuestion}
            className="bg-gradient-to-r from-news-green to-news-blue text-white font-bold px-12 py-3 rounded-full hover:scale-105 transition"
          >
            SOAL BERIKUTNYA →
          </button>
        </div>
      )}

      {/* Game Over */}
      {!gameActive && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 text-center animate-pop-in">
            <p className="text-gray-600 font-bold mb-2">WAKTU HABIS!</p>
            <p className="text-lg text-gray-500">Menghitung hasil...</p>
          </div>
        </div>
      )}
    </div>
  );
};
