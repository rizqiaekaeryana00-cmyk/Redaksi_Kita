import React, { useState } from 'react';

interface LoginProps {
  onLogin: (name: string, school: string) => void;
}

export const LoginView: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && school) onLogin(name, school);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 text-center border-4 border-white shadow-2xl relative overflow-hidden transform transition duration-500">
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-news-blue to-news-pink"></div>
        <div className="animate-float mb-6 inline-block">
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg border-4 border-news-blue">
                <i className="fas fa-user-astronaut text-5xl text-news-blue"></i>
            </div>
        </div>
        <h1 className="font-display text-4xl font-bold text-news-dark mb-2 tracking-tight">REDaksi KITA</h1>
        <p className="text-gray-500 mb-6 font-bold">Portal Belajar Jurnalis Cilik</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-left">
                <label className="block text-sm font-black text-gray-600 mb-1 ml-1">Nama Lengkap</label>
                <input 
                  type="text" required 
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl border-2 border-gray-200 focus:border-news-blue focus:ring-4 focus:ring-blue-100 outline-none transition font-bold text-gray-700 bg-gray-50" 
                  placeholder="Ketik namamu..." 
                />
            </div>
            <div className="text-left">
                <label className="block text-sm font-black text-gray-600 mb-1 ml-1">Asal Sekolah</label>
                <input 
                  type="text" required 
                  value={school} onChange={e => setSchool(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl border-2 border-gray-200 focus:border-news-blue focus:ring-4 focus:ring-blue-100 outline-none transition font-bold text-gray-700 bg-gray-50" 
                  placeholder="Nama sekolahmu..." 
                />
            </div>
            <div className="text-xs text-gray-400 mt-2">* Gunakan nama "admin" untuk masuk sebagai pengelola</div>
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-news-blue to-blue-600 text-white font-display font-bold text-xl rounded-2xl shadow-lg transform transition hover:scale-105 active:scale-95 mt-6">
                MASUK REDAKSI <i className="fas fa-arrow-right ml-2"></i>
            </button>
        </form>
      </div>
    </div>
  );
};