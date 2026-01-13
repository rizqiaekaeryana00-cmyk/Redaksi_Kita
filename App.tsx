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
import { LeaderboardView } from './views/LeaderboardView';
import { MultiplayerMode } from './views/MultiplayerMode';

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
    // Generate consistent user ID from name + school (not random)
    const userId = btoa(`${name}|${school}`).slice(0, 16); // Base64 encode as consistent ID
    const newUser: User = { id: userId, name, school, role, totalScore: 0 };
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

      {currentView === 'hoax-game' && user && <HoaxGameView user={user} onExit={() => navigate('lobby')} />}
      
      {currentView === 'briefing' && <NewsRoomView onExit={() => navigate('lobby')} />}
      
      {currentView === 'arena' && user && <PuzzleView user={user} onExit={() => navigate('lobby')} />}
      
      {currentView === 'writing-desk' && user && <WritingView user={user} onExit={() => navigate('lobby')} />}
      
      {currentView === 'evaluation' && user && <QuizView user={user} onExit={() => navigate('lobby')} />}

      {currentView === 'leaderboard' && <LeaderboardView onExit={() => navigate('lobby')} />}

      {currentView === 'multiplayer' && <MultiplayerMode onExit={() => navigate('lobby')} />}

    </Layout>
  );
}