import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Card, Badge, Button } from '../components/Shared';
import { GUILDS } from '../constants';
import { Trophy, Users, Globe } from 'lucide-react';

const Leaderboard = () => {
  const { player, joinGuild } = useGame();
  const [activeTab, setActiveTab] = useState<'global' | 'guild'>('global');

  const mockRankings = [
    { rank: 1, name: 'CyberKing99', level: 54, score: 9820, guild: 'iron-clad' },
    { rank: 2, name: 'NeoSpark', level: 52, score: 9540, guild: 'aether-spark' },
    { rank: 3, name: 'ZeroCool', level: 51, score: 9100, guild: 'frost-byte' },
    { rank: 4, name: 'Mechanic_01', level: player.level, score: 1200, guild: player.guildId || 'none' }, // Current user mock
    { rank: 5, name: 'RustBucket', level: 48, score: 8900, guild: 'forge-flame' },
  ].sort((a,b) => b.score - a.score);

  return (
    <div className="p-4 space-y-4 pb-24">
      <header>
        <h2 className="text-2xl font-bold text-indigo-400 mb-1">Rankings</h2>
        <p className="text-slate-400 text-sm">Compete for seasonal rewards.</p>
      </header>

      {/* Toggle */}
      <div className="flex p-1 bg-slate-800 rounded-lg">
        <button 
            className={`flex-1 py-2 text-sm font-bold rounded flex items-center justify-center ${activeTab === 'global' ? 'bg-slate-700 text-white shadow' : 'text-slate-500'}`}
            onClick={() => setActiveTab('global')}
        >
            <Globe size={14} className="mr-2" /> Global
        </button>
        <button 
            className={`flex-1 py-2 text-sm font-bold rounded flex items-center justify-center ${activeTab === 'guild' ? 'bg-slate-700 text-white shadow' : 'text-slate-500'}`}
            onClick={() => setActiveTab('guild')}
        >
            <Users size={14} className="mr-2" /> Guild
        </button>
      </div>

      {activeTab === 'global' ? (
        <div className="space-y-2">
            {mockRankings.map((user, idx) => (
                <Card key={idx} className={`flex items-center p-3 ${user.name === player.username ? 'border-indigo-500 bg-indigo-900/20' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${idx < 3 ? 'bg-amber-500 text-black' : 'bg-slate-700 text-slate-400'}`}>
                        {idx + 1}
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-sm">{user.name}</div>
                        <div className="text-xs text-slate-400">Level {user.level}</div>
                    </div>
                    <div className="text-right">
                        <div className="font-mono font-bold text-indigo-300">{user.score}</div>
                        <div className="text-[10px] text-slate-500">PTS</div>
                    </div>
                </Card>
            ))}
        </div>
      ) : (
        <div className="space-y-6">
            {!player.guildId && player.level < 10 && (
                <div className="text-center py-10 opacity-50">
                    <Users size={48} className="mx-auto mb-2"/>
                    <p>Reach Level 10 to join a Guild.</p>
                </div>
            )}

            {!player.guildId && player.level >= 10 && (
                <div className="space-y-4">
                    <h3 className="text-center text-white font-bold">Choose your Allegiance</h3>
                    {GUILDS.map(guild => (
                        <Card key={guild.id} className="border-l-4 border-l-slate-500 hover:border-l-cyan-400 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className={`font-bold ${guild.color}`}>{guild.name}</h4>
                                <Button variant="secondary" className="py-1 px-3 text-xs" onClick={() => joinGuild(guild.id)}>Join</Button>
                            </div>
                            <p className="text-xs text-slate-300 mb-2">{guild.description}</p>
                            <Badge>{guild.perk}</Badge>
                        </Card>
                    ))}
                </div>
            )}

            {player.guildId && (
                <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-4">
                        <span className={GUILDS.find(g => g.id === player.guildId)?.color}>
                            {GUILDS.find(g => g.id === player.guildId)?.name}
                        </span> Leaderboard
                    </h3>
                    <p className="text-slate-400 text-sm">Top 50 Battle Qualifiers</p>
                    {/* Placeholder for guild ranking list */}
                    <div className="mt-4 p-4 border border-dashed border-slate-700 rounded text-slate-500 text-sm">
                        Seasonal Event Starts in 2d 14h
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
