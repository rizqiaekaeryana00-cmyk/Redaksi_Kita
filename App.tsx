import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { User } from './types';
import { AdminPanel } from './components/AdminPanel';
import { DataService } from './services/dataService';
import { AudioService } from './services/audioService';

// View Components
import { LoginView } from './views/LoginView';
import { LobbyView } from './views/LobbyView';
import { HoaxGameView } from './views/HoaxGameView';
import { NewsRoomView } from './views/NewsRoomView';
import { PuzzleView } from './views/PuzzleView';
import { WritingView } from './views/WritingView';
import { QuizView } from './views/QuizView';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('login');
  const [showAdmin, setShowAdmin] = useState(false);

  // Load user from session storage if exists
  useEffect(() => {
    const savedUser = sessionStorage.getItem('redaksi_user');
    if (savedUser) {
        setUser(JSON.parse(savedUser));
        setCurrentView('lobby');
    }
  }, []);

  const handleLogin = (name: string, school: string) => {
    const role = name.toLowerCase() === 'admin' ? 'admin' : 'user';
    const newUser: User = { id: Date.now().toString(), name, school, role, totalScore: 0 };
    setUser(newUser);
    sessionStorage.setItem('redaksi_user', JSON.stringify(newUser));
    setCurrentView('lobby');
    AudioService.playWin();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('redaksi_user');
    setUser(null);
    setCurrentView('login');
  };

  const navigate = (view: string) => {
    AudioService.playClick();
    setCurrentView(view);
  };

  return (
    <Layout>
      {/* Admin Panel Modal */}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}

      {/* Main View Router */}
      {currentView === 'login' && <LoginView onLogin={handleLogin} />}
      
      {currentView === 'lobby' && user && (
        <LobbyView 
          user={user} 
          onNavigate={navigate} 
          onLogout={handleLogout}
          onOpenAdmin={() => setShowAdmin(true)}
        />
      )}

      {currentView === 'hoax-game' && <HoaxGameView onExit={() => navigate('lobby')} />}
      
      {currentView === 'briefing' && <NewsRoomView onExit={() => navigate('lobby')} />}
      
      {currentView === 'arena' && <PuzzleView onExit={() => navigate('lobby')} />}
      
      {currentView === 'writing-desk' && <WritingView user={user} onExit={() => navigate('lobby')} />}
      
      {currentView === 'evaluation' && <QuizView onExit={() => navigate('lobby')} />}

    </Layout>
  );
}