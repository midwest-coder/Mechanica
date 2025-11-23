
import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Card, Button, Badge, Modal, Input, RarityBorder } from '../components/Shared';
import { User, Edit2, Wallet, Shield, Trophy, Calendar, ChevronRight, Hash, Save, RefreshCw, LogOut } from 'lucide-react';
import { GUILDS, MINION_LIBRARY } from '../constants';
import { Machine } from '../types';

const Profile = () => {
  const { player, updateProfile, logout } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [showMatchDetails, setShowMatchDetails] = useState<string | null>(null);
  
  // Edit State
  const [editName, setEditName] = useState(player.username);
  const [editWallet, setEditWallet] = useState(player.walletAddress || '');
  const [editAvatarSeed, setEditAvatarSeed] = useState(player.avatarSeed || 'mechanic');

  const handleSaveProfile = () => {
    updateProfile({
        username: editName,
        walletAddress: editWallet,
        avatarSeed: editAvatarSeed
    });
    setIsEditing(false);
  };

  const generateNewAvatar = () => {
      setEditAvatarSeed(`avatar-${Math.random().toString(36).substring(7)}`);
  };

  // Stats Logic
  const totalWins = player.matchHistory.filter(m => m.result === 'Victory').length;
  const guildName = player.guildId ? GUILDS.find(g => g.id === player.guildId)?.name : 'No Allegiance';
  const guildColor = player.guildId ? GUILDS.find(g => g.id === player.guildId)?.color : 'text-slate-500';
  
  // Mock Ranks based on level/wins
  const globalRank = Math.max(1, 10000 - (player.level * 100) - (totalWins * 50)); 
  const guildRank = player.guildId ? Math.max(1, 500 - (player.level * 10) - (totalWins * 5)) : '-';

  // Derived "Best Team" (Simply using current team for now, but styled as a preset)
  const activeTeam = player.battleTeamIds.map(id => player.roster.find(m => m.id === id)).filter(Boolean) as Machine[];

  return (
    <div className="p-4 space-y-6 pb-24 animate-slide-in">
        
        {/* ID Card Header */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-900">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-cyan-900/50 to-slate-900"></div>
            <div className="relative z-10 p-6 flex flex-col items-center">
                <div className="w-28 h-28 rounded-full border-4 border-slate-800 shadow-2xl bg-slate-950 overflow-hidden mb-4 relative group">
                    <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${player.avatarSeed}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-1">{player.username}</h2>
                <div className={`text-sm font-bold uppercase tracking-widest mb-4 ${guildColor}`}>
                    {guildName}
                </div>

                <div className="flex gap-4 w-full justify-center mb-6">
                    <div className="text-center">
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Level</div>
                        <div className="text-xl font-mono font-bold text-white">{player.level}</div>
                    </div>
                    <div className="w-px bg-slate-800"></div>
                    <div className="text-center">
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Wins</div>
                        <div className="text-xl font-mono font-bold text-emerald-400">{totalWins}</div>
                    </div>
                </div>

                <Button variant="secondary" className="w-full flex items-center justify-center" onClick={() => setIsEditing(true)}>
                    <Edit2 size={14} className="mr-2" /> Edit Dossier
                </Button>
            </div>
        </div>

        {/* Ranks Card */}
        <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                <div className="flex justify-between items-start mb-2">
                    <Trophy size={20} className="text-amber-500" />
                    <div className="text-[10px] text-slate-400 uppercase">Global</div>
                </div>
                <div className="text-2xl font-mono font-bold text-white">#{globalRank}</div>
                <div className="text-[10px] text-slate-500">Top 15%</div>
            </Card>
            <Card className="p-4 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                <div className="flex justify-between items-start mb-2">
                    <Shield size={20} className="text-cyan-500" />
                    <div className="text-[10px] text-slate-400 uppercase">Guild</div>
                </div>
                <div className="text-2xl font-mono font-bold text-white">#{guildRank}</div>
                <div className="text-[10px] text-slate-500">Among {guildName}</div>
            </Card>
        </div>

        {/* Best Loadout */}
        <div>
            <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center">
                <Shield size={14} className="mr-2"/> Active Deployment
            </h3>
            <div className="grid grid-cols-3 gap-2">
                {activeTeam.map((machine, i) => (
                    <RarityBorder key={i} rarity={machine.rarity} className="bg-slate-900 relative">
                        <img src={`https://picsum.photos/seed/${machine.imageSeed}/100/100`} className="w-full h-full object-cover opacity-60" />
                        <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/80 text-center">
                            <div className="text-[8px] text-white font-bold truncate">{machine.name}</div>
                        </div>
                    </RarityBorder>
                ))}
            </div>
            <div className="text-[10px] text-slate-500 text-center mt-2 italic">Most successful configuration based on recent combat data.</div>
        </div>

        {/* Match History */}
        <div>
            <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center">
                <Calendar size={14} className="mr-2"/> Combat Log
            </h3>
            <div className="space-y-2">
                {player.matchHistory.length > 0 ? player.matchHistory.map((match) => (
                    <div 
                        key={match.id} 
                        onClick={() => setShowMatchDetails(match.id === showMatchDetails ? null : match.id)}
                        className={`bg-slate-900 border border-slate-800 rounded-lg overflow-hidden transition-all ${showMatchDetails === match.id ? 'ring-1 ring-cyan-500' : ''}`}
                    >
                        <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-800">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-10 rounded-full ${match.result === 'Victory' ? 'bg-emerald-500 shadow-[0_0_10px_lime]' : 'bg-red-600'}`}></div>
                                <div>
                                    <div className="font-bold text-sm text-slate-200">VS {match.opponentName}</div>
                                    <div className="text-[10px] text-slate-500">{new Date(match.timestamp).toLocaleDateString()} • {new Date(match.timestamp).toLocaleTimeString()}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`font-bold text-sm ${match.result === 'Victory' ? 'text-emerald-400' : 'text-red-400'}`}>{match.result}</div>
                                <ChevronRight size={14} className={`inline transition-transform ${showMatchDetails === match.id ? 'rotate-90' : ''} text-slate-600`} />
                            </div>
                        </div>
                        
                        {/* Expanded Details */}
                        {showMatchDetails === match.id && (
                            <div className="bg-black/20 p-3 border-t border-slate-800 text-xs space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Rewards Acquired:</span>
                                    <span className="text-amber-400 font-mono">+{match.rewards.credits} Credits {match.rewards.bounty ? `+ ${match.rewards.bounty} Bounty` : ''}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block mb-1">Squad Deployed:</span>
                                    <div className="flex gap-1">
                                        {match.teamUsed.map((id, i) => {
                                            // Try to find current unit, or fallback if deleted
                                            const unit = player.roster.find(m => m.id === id);
                                            return (
                                                <span key={i} className="bg-slate-800 px-2 py-1 rounded text-[10px] text-cyan-300 border border-slate-700">
                                                    {unit ? unit.name : 'Decommissioned Unit'}
                                                </span>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="text-center py-8 text-slate-600 italic border border-dashed border-slate-800 rounded">No combat records found.</div>
                )}
            </div>
        </div>

        {/* Logout Section */}
        <div className="pt-6 border-t border-slate-800">
             <Button variant="danger" className="w-full flex items-center justify-center" onClick={logout}>
                <LogOut size={16} className="mr-2" /> Terminate Session
             </Button>
             <div className="text-center mt-2 text-[10px] text-slate-600">
                 Mechanica OS v2.4.1 - All rights reserved by Isaac Industries.
             </div>
        </div>

        {/* Edit Profile Modal */}
        <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Update Credentials">
            <div className="space-y-6 pt-2">
                {/* Avatar Edit */}
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full border-2 border-cyan-500 shadow-lg bg-black overflow-hidden mb-3 relative">
                        <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${editAvatarSeed}`} className="w-full h-full object-cover" />
                    </div>
                    <Button variant="ghost" className="text-xs border border-slate-700" onClick={generateNewAvatar}>
                        <RefreshCw size={12} className="mr-2" /> Reroll Appearance
                    </Button>
                </div>

                {/* Name Edit */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Codename</label>
                    <Input 
                        value={editName} 
                        onChange={(e: any) => setEditName(e.target.value)} 
                        placeholder="Enter Username"
                        icon={<User size={16} className="text-slate-500"/>}
                    />
                </div>

                {/* Wallet Edit */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Crypto Wallet</label>
                    <Input 
                        value={editWallet} 
                        onChange={(e: any) => setEditWallet(e.target.value)} 
                        placeholder="0x..."
                        icon={<Wallet size={16} className="text-slate-500"/>}
                    />
                    <p className="text-[10px] text-slate-500">Connect a compatible EVM wallet for bounty withdrawals.</p>
                </div>

                <Button variant="primary" className="w-full mt-4" onClick={handleSaveProfile}>
                    <Save size={16} className="mr-2" /> Save Changes
                </Button>
            </div>
        </Modal>

    </div>
  );
};

export default Profile;
