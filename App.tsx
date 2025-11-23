
import React, { useState } from 'react';
import { GameProvider, useGame } from './GameContext';
import Lab from './views/Lab';
import Market from './views/Market';
import Leaderboard from './views/Leaderboard';
import Battle from './views/Battle';
import Profile from './views/Profile';
import Login from './views/Login';
import { Wrench, ShoppingCart, Trophy, Sword, User, Wifi, WifiOff, LogOut } from 'lucide-react';

const Header = ({ onProfileClick }: { onProfileClick: () => void }) => {
    const { player, isOnline } = useGame();
    return (
        <div className="fixed top-0 left-0 right-0 h-16 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 z-40 shadow-lg">
            <div className="flex items-center">
                <div className={`w-8 h-8 rounded-lg rotate-45 flex items-center justify-center mr-3 shadow-[0_0_10px_rgba(6,182,212,0.6)] ${isOnline ? 'bg-cyan-600' : 'bg-slate-600'}`}>
                    <div className="w-4 h-4 bg-slate-900 -rotate-45"></div>
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white tracking-widest uppercase" style={{ fontFamily: 'monospace' }}>Mechanica</h1>
                    <div className={`text-[10px] leading-none flex items-center ${isOnline ? 'text-cyan-500' : 'text-slate-500'}`}>
                        {isOnline ? <Wifi size={10} className="mr-1"/> : <WifiOff size={10} className="mr-1"/>}
                        {isOnline ? 'Status: Online' : 'Offline'}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center cursor-pointer group" onClick={onProfileClick}>
                    <div className="text-right mr-3 group-hover:text-cyan-400 transition-colors">
                        <div className="text-xs font-bold text-slate-200">{player.username}</div>
                        <div className="text-[10px] text-amber-400">Lv.{player.level}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-slate-600 group-hover:border-cyan-400 transition-colors">
                        {player.avatarSeed ? (
                            <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${player.avatarSeed}`} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-full h-full p-1 text-slate-400" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const BottomNav = ({ activeTab, setTab }: any) => {
    const navItems = [
        { id: 'lab', label: 'Lab', icon: Wrench },
        { id: 'market', label: 'Market', icon: ShoppingCart },
        { id: 'leaderboard', label: 'Rank', icon: Trophy },
        { id: 'battle', label: 'Battle', icon: Sword },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-slate-950 border-t border-slate-800 flex items-center justify-around z-40 pb-4 shadow-[0_-5px_10px_rgba(0,0,0,0.3)]">
            {navItems.map(item => (
                <button 
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === item.id ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <item.icon size={24} className={`mb-1 transition-all ${activeTab === item.id ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] scale-110' : ''}`} />
                    <span className="text-[10px] uppercase font-bold tracking-wider">{item.label}</span>
                </button>
            ))}
        </div>
    );
};

const MainContent = () => {
    const { isAuthenticated, isLoading } = useGame();
    const [activeTab, setActiveTab] = useState('lab');

    if (isLoading) {
         return (
          <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-cyan-500">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
              <div className="text-lg font-bold animate-pulse">Authenticating...</div>
          </div>
      )
    }

    if (!isAuthenticated) {
        return <Login />;
    }

    return (
        <div className="h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            <Header onProfileClick={() => setActiveTab('profile')} />
            
            <main className="flex-1 overflow-y-auto pt-20 no-scrollbar relative">
                {activeTab === 'lab' && <Lab />}
                {activeTab === 'market' && <Market />}
                {activeTab === 'leaderboard' && <Leaderboard />}
                {activeTab === 'battle' && <Battle />}
                {activeTab === 'profile' && <Profile />}
            </main>

            <BottomNav activeTab={activeTab} setTab={setActiveTab} />
        </div>
    );
};

const App = () => {
  return (
    <GameProvider>
      <MainContent />
    </GameProvider>
  );
};

export default App;
