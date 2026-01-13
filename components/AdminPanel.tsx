import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { NewsItem, VideoContent, QuizQuestion, PuzzleLevel } from '../types';

export const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'news' | 'video' | 'quiz' | 'puzzle'>('news');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [puzzles, setPuzzles] = useState<PuzzleLevel[]>([]);

  // Form States
  const [newsForm, setNewsForm] = useState({ text: '', type: 'hoax' as const });
  const [videoForm, setVideoForm] = useState({ title: '', youtubeId: '', category: 'materi' as const });
  const [quizForm, setQuizForm] = useState({ question: '', opt1: '', opt2: '', correctIdx: 0 });
  const [puzzleForm, setPuzzleForm] = useState({ difficulty: 'mudah' as const, headline: '', lead: '', body: '' });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const n = await DataService.getNews();
    const v = await DataService.getVideos();
    const q = await DataService.getQuiz();
    const p = await DataService.getPuzzles();
    setNews(n);
    setVideos(v);
    setQuizzes(q);
    setPuzzles(p);
  };

  // News Handlers
  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    await DataService.addNews(newsForm);
    setNewsForm({ text: '', type: 'hoax' });
    refreshData();
  };
  const handleDeleteNews = async (id: string) => { await DataService.deleteNews(id); refreshData(); };

  // Video Handlers
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-extract ID if user pastes full URL
    let cleanId = videoForm.youtubeId;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = cleanId.match(regExp);
    if (match && match[2].length === 11) {
        cleanId = match[2];
    }

    await DataService.addVideo({ ...videoForm, youtubeId: cleanId });
    setVideoForm({ title: '', youtubeId: '', category: 'materi' });
    refreshData();
  };
  const handleDeleteVideo = async (id: string) => { await DataService.deleteVideo(id); refreshData(); };

  // Quiz Handlers
  const handleAddQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    await DataService.addQuiz({
      question: quizForm.question,
      options: [quizForm.opt1, quizForm.opt2],
      correctIndex: quizForm.correctIdx
    });
    setQuizForm({ question: '', opt1: '', opt2: '', correctIdx: 0 });
    refreshData();
  };
  const handleDeleteQuiz = async (id: string) => { await DataService.deleteQuiz(id); refreshData(); };

  // Puzzle Handlers
  const handleAddPuzzle = async (e: React.FormEvent) => {
    e.preventDefault();
    await DataService.addPuzzle(puzzleForm);
    setPuzzleForm({ difficulty: 'mudah', headline: '', lead: '', body: '' });
    refreshData();
  };
  const handleDeletePuzzle = async (id: string) => { await DataService.deletePuzzle(id); refreshData(); };


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold font-display"><i className="fas fa-cogs mr-2"></i>Admin Panel</h2>
          <button onClick={onClose} className="hover:text-red-400 transition"><i className="fas fa-times text-xl"></i></button>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 border-b text-sm md:text-base overflow-x-auto">
          <button onClick={() => setActiveTab('news')} className={`flex-1 py-4 font-bold px-4 whitespace-nowrap ${activeTab === 'news' ? 'bg-white text-news-blue border-b-4 border-news-blue' : 'text-gray-500 hover:bg-gray-200'}`}>Hoax Buster</button>
          <button onClick={() => setActiveTab('video')} className={`flex-1 py-4 font-bold px-4 whitespace-nowrap ${activeTab === 'video' ? 'bg-white text-news-purple border-b-4 border-news-purple' : 'text-gray-500 hover:bg-gray-200'}`}>Videos</button>
          <button onClick={() => setActiveTab('quiz')} className={`flex-1 py-4 font-bold px-4 whitespace-nowrap ${activeTab === 'quiz' ? 'bg-white text-news-pink border-b-4 border-news-pink' : 'text-gray-500 hover:bg-gray-200'}`}>Quiz</button>
          <button onClick={() => setActiveTab('puzzle')} className={`flex-1 py-4 font-bold px-4 whitespace-nowrap ${activeTab === 'puzzle' ? 'bg-white text-orange-500 border-b-4 border-orange-500' : 'text-gray-500 hover:bg-gray-200'}`}>Puzzle Game</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          
          {/* NEWS TAB */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              <form onSubmit={handleAddNews} className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
                <h3 className="font-bold text-gray-700">Tambah Headline Berita</h3>
                <div className="flex gap-4">
                  <input type="text" required placeholder="Judul Berita..." value={newsForm.text} onChange={e => setNewsForm({...newsForm, text: e.target.value})} className="flex-1 border p-2 rounded" />
                  <select value={newsForm.type} onChange={e => setNewsForm({...newsForm, type: e.target.value as any})} className="border p-2 rounded">
                    <option value="hoax">HOAX</option>
                    <option value="real">FAKTA</option>
                  </select>
                  <button type="submit" className="bg-news-blue text-white px-4 py-2 rounded font-bold hover:bg-blue-600">Tambah</button>
                </div>
              </form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {news.map(item => (
                  <div key={item.id} className={`p-3 rounded-lg border flex justify-between items-center ${item.type === 'hoax' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                    <div>
                      <span className={`text-xs font-bold uppercase px-2 py-1 rounded mr-2 ${item.type === 'hoax' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>{item.type}</span>
                      <span className="font-medium">{item.text}</span>
                    </div>
                    <button onClick={() => handleDeleteNews(item.id)} className="text-gray-400 hover:text-red-500"><i className="fas fa-trash"></i></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIDEOS TAB */}
          {activeTab === 'video' && (
             <div className="space-y-6">
             <form onSubmit={handleAddVideo} className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
               <h3 className="font-bold text-gray-700">Tambah Video Youtube</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <input type="text" required placeholder="Judul Video..." value={videoForm.title} onChange={e => setVideoForm({...videoForm, title: e.target.value})} className="border p-2 rounded" />
                 <input type="text" required placeholder="Youtube ID / URL" value={videoForm.youtubeId} onChange={e => setVideoForm({...videoForm, youtubeId: e.target.value})} className="border p-2 rounded" />
                 <select value={videoForm.category} onChange={e => setVideoForm({...videoForm, category: e.target.value as any})} className="border p-2 rounded">
                   <option value="materi">Materi</option>
                   <option value="contoh">Contoh Berita</option>
                 </select>
               </div>
               <button type="submit" className="w-full bg-news-purple text-white px-4 py-2 rounded font-bold hover:bg-purple-600">Tambah Video</button>
               <p className="text-xs text-gray-400 italic">Bisa memasukkan ID saja (cth: 5F6vQp1lBEM) atau link lengkap (cth: https://youtube.com/watch?v=...)</p>
             </form>
             <div className="space-y-2">
               {videos.map(item => (
                 <div key={item.id} className="p-3 bg-white rounded-lg border flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      {/* Gunakan ID yang mungkin masih berupa URL untuk preview thumbnail, tapi sebaiknya dibersihkan juga */}
                      <img 
                        src={`https://img.youtube.com/vi/${item.youtubeId.length === 11 ? item.youtubeId : (item.youtubeId.match(/v=([^&]+)/)?.[1] || item.youtubeId)}/default.jpg`} 
                        className="w-16 h-12 object-cover rounded" 
                        alt="thumb"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} 
                      />
                      <div>
                        <div className="font-bold">{item.title}</div>
                        <div className="text-xs text-gray-500 uppercase">{item.category}</div>
                      </div>
                   </div>
                   <button onClick={() => handleDeleteVideo(item.id)} className="text-gray-400 hover:text-red-500"><i className="fas fa-trash"></i></button>
                 </div>
               ))}
             </div>
           </div>
          )}

          {/* QUIZ TAB */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
            <form onSubmit={handleAddQuiz} className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
              <h3 className="font-bold text-gray-700">Tambah Soal Kuis</h3>
              <input type="text" required placeholder="Pertanyaan..." value={quizForm.question} onChange={e => setQuizForm({...quizForm, question: e.target.value})} className="w-full border p-2 rounded" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" required placeholder="Pilihan A" value={quizForm.opt1} onChange={e => setQuizForm({...quizForm, opt1: e.target.value})} className="border p-2 rounded" />
                <input type="text" required placeholder="Pilihan B" value={quizForm.opt2} onChange={e => setQuizForm({...quizForm, opt2: e.target.value})} className="border p-2 rounded" />
              </div>
              <div className="flex items-center gap-2">
                 <label className="text-sm font-bold">Jawaban Benar:</label>
                 <select value={quizForm.correctIdx} onChange={e => setQuizForm({...quizForm, correctIdx: Number(e.target.value)})} className="border p-2 rounded">
                    <option value={0}>Pilihan A</option>
                    <option value={1}>Pilihan B</option>
                 </select>
              </div>
              <button type="submit" className="w-full bg-news-pink text-white px-4 py-2 rounded font-bold hover:bg-pink-500">Tambah Soal</button>
            </form>
            <div className="space-y-3">
              {quizzes.map(item => (
                <div key={item.id} className="p-4 bg-white rounded-lg border relative">
                  <div className="font-bold text-lg mb-2">{item.question}</div>
                  <ul className="list-disc ml-5 text-sm text-gray-600">
                    <li className={item.correctIndex === 0 ? "text-green-600 font-bold" : ""}>{item.options[0]}</li>
                    <li className={item.correctIndex === 1 ? "text-green-600 font-bold" : ""}>{item.options[1]}</li>
                  </ul>
                  <button onClick={() => handleDeleteQuiz(item.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><i className="fas fa-trash"></i></button>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* PUZZLE TAB */}
          {activeTab === 'puzzle' && (
            <div className="space-y-6">
              <form onSubmit={handleAddPuzzle} className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
                <h3 className="font-bold text-gray-700">Tambah Level Puzzle Susun Berita</h3>
                <div className="flex gap-4">
                  <select 
                    value={puzzleForm.difficulty} 
                    onChange={e => setPuzzleForm({...puzzleForm, difficulty: e.target.value as any})} 
                    className="border p-2 rounded w-40 font-bold text-gray-700"
                  >
                    <option value="mudah">Mudah</option>
                    <option value="sulit">Sulit</option>
                  </select>
                  <input type="text" required placeholder="JUDUL BERITA (Headline)" value={puzzleForm.headline} onChange={e => setPuzzleForm({...puzzleForm, headline: e.target.value})} className="flex-1 border p-2 rounded uppercase" />
                </div>
                <textarea required placeholder="Teras Berita (Lead) - Ringkasan 5W+1H" value={puzzleForm.lead} onChange={e => setPuzzleForm({...puzzleForm, lead: e.target.value})} className="w-full border p-2 rounded h-20" />
                <textarea required placeholder="Tubuh Berita (Body) - Penjelasan Detail" value={puzzleForm.body} onChange={e => setPuzzleForm({...puzzleForm, body: e.target.value})} className="w-full border p-2 rounded h-24" />
                <button type="submit" className="w-full bg-orange-500 text-white px-4 py-2 rounded font-bold hover:bg-orange-600">Tambah Level Puzzle</button>
              </form>

              <div className="space-y-3">
                 <h4 className="font-bold text-gray-500">Daftar Level Aktif</h4>
                 {puzzles.map(p => (
                   <div key={p.id} className="bg-white border rounded-xl p-4 flex justify-between items-start">
                      <div>
                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded mr-2 ${p.difficulty === 'mudah' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>Level {p.difficulty}</span>
                        <h4 className="font-bold text-lg mt-1">{p.headline}</h4>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.lead}</p>
                      </div>
                      <button onClick={() => handleDeletePuzzle(p.id)} className="text-gray-400 hover:text-red-500 ml-4"><i className="fas fa-trash"></i></button>
                   </div>
                 ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};