import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Card, Button, Modal, Badge } from '../components/Shared';
import { Package, Coins, Lock, BookOpen, Info, Cpu, Layers, Filter } from 'lucide-react';
import { MINION_LIBRARY, GUILDS } from '../constants';
import { MachineRarity } from '../types';

const Market = () => {
  const { player, addCredits, openChest } = useGame();
  const [loot, setLoot] = useState<any>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedMinion, setSelectedMinion] = useState<any>(null);
  const [libraryFilter, setLibraryFilter] = useState<{tribe: string | 'all', rarity: string | 'all'}>({tribe: 'all', rarity: 'all'});

  const handleBuyCredits = () => {
    addCredits(500);
  };

  const handleOpenChest = (type: 'daily' | 'purchased') => {
    if (type === 'purchased' && player.credits < 100) return;
    if (type === 'daily' && player.dailyWins < 3) return;
    if (type === 'daily' && player.dailyClaimed) return;

    const result = openChest(type);
    if (result) {
        setLoot(result);
    }
  };

  const filteredMinions = MINION_LIBRARY.filter(m => {
      if (libraryFilter.tribe !== 'all') {
          if (libraryFilter.tribe === 'neutral' && m.tribeId !== null) return false;
          if (libraryFilter.tribe !== 'neutral' && m.tribeId !== libraryFilter.tribe) return false;
      }
      if (libraryFilter.rarity !== 'all' && m.rarity !== libraryFilter.rarity) return false;
      return true;
  });

  const getRarityColor = (rarity: MachineRarity) => {
      switch(rarity) {
          case MachineRarity.COMMON: return 'border-slate-500 shadow-slate-500/20';
          case MachineRarity.UNCOMMON: return 'border-emerald-500 shadow-emerald-500/30';
          case MachineRarity.RARE: return 'border-amber-500 shadow-amber-500/40';
          case MachineRarity.LEGENDARY: return 'border-purple-500 shadow-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-pulse-border';
          default: return 'border-slate-500';
      }
  };

  const getGuildBg = (tribeId: string | null) => {
      switch(tribeId) {
          case 'iron-march': return 'bg-gradient-to-br from-slate-900 to-slate-800';
          case 'aether-circuit': return 'bg-gradient-to-br from-cyan-950 to-slate-900';
          case 'pyro-forge': return 'bg-gradient-to-br from-orange-950 to-slate-900';
          case 'cryo-guard': return 'bg-gradient-to-br from-blue-950 to-slate-900';
          case 'verdant-steel': return 'bg-gradient-to-br from-emerald-950 to-slate-900';
          default: return 'bg-gradient-to-br from-zinc-900 to-zinc-950';
      }
  };

  const getGuildAccent = (tribeId: string | null) => {
    switch(tribeId) {
        case 'iron-march': return 'text-slate-400';
        case 'aether-circuit': return 'text-cyan-400';
        case 'pyro-forge': return 'text-orange-400';
        case 'cryo-guard': return 'text-blue-300';
        case 'verdant-steel': return 'text-emerald-400';
        default: return 'text-zinc-400';
    }
};

  return (
    <div className="p-4 space-y-6 pb-24">
       <header className="flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-amber-400 mb-1">Black Market</h2>
            <p className="text-slate-400 text-sm">Acquire rare parts and blueprints.</p>
        </div>
        <div className="bg-slate-800 px-3 py-1 rounded-full flex items-center border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <Coins size={14} className="text-amber-400 mr-2" />
            <span className="font-mono font-bold text-amber-100">{player.credits}</span>
        </div>
      </header>

      <Button variant="secondary" className="w-full flex items-center justify-center py-4 border border-cyan-500/30 shadow-[0_0_15px_rgba(8,145,178,0.1)] group transition-all hover:border-cyan-400" onClick={() => setShowLibrary(true)}>
          <BookOpen size={20} className="mr-3 text-cyan-400 group-hover:scale-110 transition-transform"/> 
          <div className="text-left">
             <div className="font-bold text-white">Minion Database</div>
             <div className="text-[10px] text-slate-400">View all 100 discoverable machines</div>
          </div>
      </Button>

      {/* Daily Reward Section */}
      <Card className="border-cyan-500/50 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden relative">
         <div className="absolute top-0 right-0 p-4 opacity-10">
             <Package size={100} />
         </div>
         <div className="relative z-10">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-cyan-300 flex items-center"><Package className="mr-2"/> Daily Supply Drop</h3>
                <Badge color="bg-slate-900">{player.dailyWins}/3 Wins</Badge>
            </div>
            <p className="text-xs text-slate-400 mb-4">Win 3 battles today to unlock this chest for free.</p>
            
            <div className="w-full bg-slate-950 h-2 rounded-full mb-4 overflow-hidden border border-slate-700">
                <div className="h-full bg-cyan-400 transition-all shadow-[0_0_10px_cyan]" style={{width: `${(player.dailyWins/3)*100}%`}}></div>
            </div>

            <Button 
                variant="primary" 
                className="w-full"
                disabled={player.dailyWins < 3 || player.dailyClaimed}
                onClick={() => handleOpenChest('daily')}
            >
                {player.dailyClaimed ? 'Claimed for Today' : player.dailyWins >= 3 ? 'Open Chest' : 'Locked'}
            </Button>
         </div>
      </Card>

      {/* Shop Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col items-center text-center border-amber-500/30 hover:border-amber-500 transition-colors">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-3 shadow-inner border border-slate-700">
                <Package size={32} className="text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]" />
            </div>
            <h4 className="font-bold text-white mb-1">Mechanic's Chest</h4>
            <p className="text-[10px] text-slate-400 mb-3 px-2">Contains 5 Common, 2 Uncommon, 1 Rare part + Blueprint Chance.</p>
            <Button 
                variant="gold" 
                className="w-full mt-auto"
                onClick={() => handleOpenChest('purchased')}
            >
                100 Credits
            </Button>
        </Card>

        <Card className="flex flex-col items-center text-center opacity-60 border-slate-700">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-3 border border-slate-700">
                <Lock size={32} className="text-slate-500" />
            </div>
            <h4 className="font-bold text-white mb-1">Guild Chest</h4>
            <p className="text-[10px] text-slate-400 mb-3 px-2">Exclusive Guild Blueprints. Unlocks at Level 10.</p>
            <Button variant="secondary" disabled className="w-full mt-auto">Locked</Button>
        </Card>
      </div>

      <div className="pt-4 border-t border-slate-700">
        <Button variant="ghost" className="w-full border border-slate-600 text-slate-400" onClick={handleBuyCredits}>
            <Coins size={14} className="inline mr-2"/> Buy 500 Credits ($4.99)
        </Button>
      </div>

      {/* Library Modal */}
      <Modal isOpen={showLibrary} onClose={() => setShowLibrary(false)} title="Minion Database">
          <div className="sticky -top-4 -mx-4 px-4 pt-2 bg-slate-900/95 backdrop-blur z-20 border-b border-slate-800 mb-4 pb-3">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <Filter size={12} /> Filter Protocol
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  <Button 
                    variant={libraryFilter.tribe === 'all' ? 'primary' : 'secondary'} 
                    className="text-xs whitespace-nowrap py-1 px-3 rounded-full"
                    onClick={() => setLibraryFilter(prev => ({...prev, tribe: 'all'}))}
                  >All</Button>
                  <Button 
                    variant={libraryFilter.tribe === 'neutral' ? 'primary' : 'secondary'} 
                    className="text-xs whitespace-nowrap py-1 px-3 rounded-full"
                    onClick={() => setLibraryFilter(prev => ({...prev, tribe: 'neutral'}))}
                  >Neutral</Button>
                  {GUILDS.map(g => (
                      <Button 
                        key={g.id} 
                        variant={libraryFilter.tribe === g.id ? 'primary' : 'secondary'}
                        className={`text-xs whitespace-nowrap py-1 px-3 rounded-full ${libraryFilter.tribe === g.id ? '' : g.color}`}
                        onClick={() => setLibraryFilter(prev => ({...prev, tribe: g.id}))}
                      >
                          {g.name}
                      </Button>
                  ))}
              </div>
              <div className="flex gap-2 pt-1">
                  {['all', MachineRarity.COMMON, MachineRarity.UNCOMMON, MachineRarity.RARE, MachineRarity.LEGENDARY].map(r => (
                      <button 
                        key={r}
                        onClick={() => setLibraryFilter(prev => ({...prev, rarity: r}))}
                        className={`text-[10px] px-3 py-1 rounded border transition-all uppercase tracking-wider font-bold ${libraryFilter.rarity === r ? 'bg-cyan-900 border-cyan-500 text-white shadow-[0_0_10px_rgba(8,145,178,0.3)]' : 'border-slate-700 text-slate-500 bg-slate-900'}`}
                      >
                          {r}
                      </button>
                  ))}
              </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-4">
              {filteredMinions.map(m => (
                  <div 
                    key={m.id} 
                    onClick={() => setSelectedMinion(m)} 
                    className={`relative group rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:scale-105 hover:z-10 ${getRarityColor(m.rarity)} ${getGuildBg(m.tribeId)}`}
                  >
                      <div className="aspect-[4/5] relative p-2 flex flex-col">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                          
                          {/* Card Header */}
                          <div className="relative z-10 flex justify-between items-start mb-1">
                              <Badge color="bg-black/50 backdrop-blur">{m.element.slice(0,3)}</Badge>
                              {m.tribeId && <div className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${getGuildAccent(m.tribeId)} bg-current`}></div>}
                          </div>

                          {/* Image Placeholder */}
                          <div className="flex-1 w-full rounded bg-black/40 border border-white/10 mb-2 overflow-hidden relative">
                              <img src={`https://picsum.photos/seed/${m.imageSeed}/200/200`} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                          </div>
                          
                          {/* Name & Rarity */}
                          <div className="relative z-10 text-center">
                            <div className="text-[10px] font-bold text-white leading-tight mb-1 shadow-black drop-shadow-md">{m.name}</div>
                            <div className={`text-[8px] uppercase tracking-widest font-bold ${
                                m.rarity === MachineRarity.LEGENDARY ? 'text-purple-400' : 
                                m.rarity === MachineRarity.RARE ? 'text-amber-400' : 
                                m.rarity === MachineRarity.UNCOMMON ? 'text-emerald-400' : 'text-slate-400'
                            }`}>{m.rarity}</div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </Modal>

      {/* Detail Modal */}
      {selectedMinion && (
          <Modal isOpen={!!selectedMinion} onClose={() => setSelectedMinion(null)} title="Unit Analysis">
              <div className={`rounded-xl p-1 mb-4 border-2 ${getRarityColor(selectedMinion.rarity)}`}>
                <div className={`rounded-lg p-4 ${getGuildBg(selectedMinion.tribeId)} relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
                        <Cpu size={120} />
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-full border-4 border-white/10 shadow-2xl overflow-hidden mb-4 bg-black">
                            <img src={`https://picsum.photos/seed/${selectedMinion.imageSeed}/300/300`} className="w-full h-full object-cover" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{selectedMinion.name}</h2>
                        <p className={`text-sm font-bold uppercase tracking-widest mb-4 ${getGuildAccent(selectedMinion.tribeId)}`}>
                            {selectedMinion.tribeId ? GUILDS.find(g => g.id === selectedMinion.tribeId)?.name : 'Neutral Faction'}
                        </p>
                        
                        <div className="flex gap-2 mb-4">
                            <Badge>{selectedMinion.rarity}</Badge>
                            <Badge color="bg-indigo-900">{selectedMinion.element}</Badge>
                        </div>
                        
                        <p className="text-sm text-slate-300 italic bg-black/30 p-3 rounded border border-white/5 w-full">"{selectedMinion.description}"</p>
                    </div>
                </div>
              </div>

              <div className="space-y-6">
                  {/* Stats */}
                  <div>
                      <h3 className="text-sm font-bold text-cyan-400 mb-2 border-b border-slate-700 pb-1 flex items-center"><Info size={14} className="mr-2"/> Base Specs</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex justify-between bg-slate-800 p-2 rounded border border-slate-700"><span>Hull Integrity</span> <span className="font-mono font-bold">{selectedMinion.baseStats.maxHealth}</span></div>
                          <div className="flex justify-between bg-slate-800 p-2 rounded border border-slate-700"><span>Shield Cap</span> <span className="font-mono font-bold">{selectedMinion.baseStats.maxShield}</span></div>
                          <div className="flex justify-between bg-slate-800 p-2 rounded border border-slate-700"><span>Offense</span> <span className="font-mono font-bold text-red-400">{selectedMinion.baseStats.attack}</span></div>
                          <div className="flex justify-between bg-slate-800 p-2 rounded border border-slate-700"><span>Mobility</span> <span className="font-mono font-bold text-amber-400">{selectedMinion.baseStats.speed}</span></div>
                      </div>
                  </div>

                  {/* Crafting */}
                  <div>
                      <h3 className="text-sm font-bold text-amber-400 mb-2 border-b border-slate-700 pb-1 flex items-center"><Layers size={14} className="mr-2"/> Fabrication Costs</h3>
                      <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                          <div className="flex justify-between text-sm pt-2">
                             <div className="text-center"><div className="font-bold text-lg">{selectedMinion.crafting.parts.common}</div><div className="text-[10px] text-slate-500 uppercase">Common</div></div>
                             <div className="text-center"><div className="font-bold text-lg text-emerald-400">{selectedMinion.crafting.parts.uncommon}</div><div className="text-[10px] text-slate-500 uppercase">Uncommon</div></div>
                             <div className="text-center"><div className="font-bold text-lg text-amber-400">{selectedMinion.crafting.parts.rare}</div><div className="text-[10px] text-slate-500 uppercase">Rare</div></div>
                          </div>
                      </div>
                  </div>

                  {/* Skill Tree Preview */}
                  <div>
                      <h3 className="text-sm font-bold text-purple-400 mb-2 border-b border-slate-700 pb-1 flex items-center"><Cpu size={14} className="mr-2"/> Evolution Matrix</h3>
                      <div className="space-y-2 relative">
                          <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-slate-700"></div>
                          {selectedMinion.skillTree.map((node: any, i: number) => (
                              <div key={i} className="flex items-start relative z-10">
                                  <div className="mr-3 mt-1 w-6 h-6 rounded-full bg-slate-800 border-2 border-purple-500 flex items-center justify-center text-[10px] font-bold text-purple-300 shadow-[0_0_5px_purple] z-10">
                                      {node.levelReq}
                                  </div>
                                  <div className="flex-1 bg-slate-800/50 p-2 rounded border border-slate-700 mb-2">
                                      <div className="text-xs font-bold text-white">{node.name}</div>
                                      <div className="text-[10px] text-slate-400">{node.description}</div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </Modal>
      )}

      {/* Loot Modal Overlay */}
      {loot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 animate-fade-in">
            <Card className="w-full max-w-sm border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                <div className="text-center mb-6">
                    <Package size={48} className="mx-auto text-amber-400 mb-2 animate-bounce" />
                    <h2 className="text-2xl font-bold text-white">Acquisition Successful</h2>
                </div>
                <div className="space-y-2 mb-6">
                    <div className="flex justify-between bg-slate-800 p-3 rounded border border-slate-700">
                        <span className="text-slate-300 text-sm">Common Parts</span>
                        <span className="font-bold text-white">+{loot.commonParts}</span>
                    </div>
                    <div className="flex justify-between bg-slate-800 p-3 rounded border border-slate-700">
                        <span className="text-slate-300 text-sm">Uncommon Parts</span>
                        <span className="font-bold text-emerald-400">+{loot.uncommonParts}</span>
                    </div>
                    <div className="flex justify-between bg-slate-800 p-3 rounded border border-slate-700">
                        <span className="text-slate-300 text-sm">Rare Parts</span>
                        <span className="font-bold text-amber-400">+{loot.rareParts}</span>
                    </div>
                    {loot.blueprint && (
                        <div className="flex flex-col bg-indigo-900/30 border border-indigo-500 p-3 rounded text-center mt-4">
                            <span className="text-indigo-300 text-[10px] uppercase tracking-widest mb-1">Blueprint Discovered</span>
                            <span className="font-bold text-white text-sm">{MINION_LIBRARY.find(m => m.crafting.blueprintId === loot.blueprint)?.name}</span>
                        </div>
                    )}
                </div>
                <Button variant="primary" className="w-full" onClick={() => setLoot(null)}>Secure Loot</Button>
            </Card>
        </div>
      )}
    </div>
  );
};

export default Market;