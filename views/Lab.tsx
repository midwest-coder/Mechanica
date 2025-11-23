
import React, { useState } from 'react';
import { useGame } from '../GameContext';
import { Card, Button, Badge, ProgressBar, Tabs, RarityBorder, Modal } from '../components/Shared';
import { Hammer, Box, Grid, Cpu, ChevronRight, Users, CheckCircle } from 'lucide-react';
import { LEVEL_XP_CURVE, MINION_LIBRARY } from '../constants';
import { Machine, MachineRarity } from '../types';

const Lab = () => {
  const { player, levelUpMachine, craftMachine, updateProfile } = useGame();
  const [activeTab, setActiveTab] = useState<'hangar' | 'workshop' | 'warehouse'>('hangar');
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [showSquadEditor, setShowSquadEditor] = useState(false);

  const selectedMachine = player.roster.find(m => m.id === selectedMachineId);

  const blueprints = player.inventory.blueprints.map(bpId => {
      return MINION_LIBRARY.find(m => m.crafting.blueprintId === bpId);
  }).filter(Boolean) as Machine[];

  const handleSquadChange = (machineId: string) => {
      const isSelected = player.battleTeamIds.includes(machineId);
      let newTeam = [...player.battleTeamIds];
      
      if (isSelected) {
          if (newTeam.length > 1) {
              newTeam = newTeam.filter(id => id !== machineId);
          }
      } else {
          if (newTeam.length < 3) {
              newTeam.push(machineId);
          } else {
              // Replace first if full (simple logic, could be better)
              newTeam.shift();
              newTeam.push(machineId);
          }
      }
      updateProfile({ battleTeamIds: newTeam });
  };

  return (
    <div className="p-4 space-y-4 pb-24 h-full flex flex-col">
      <header className="flex justify-between items-start">
        <div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-1">Engineering Lab</h2>
            <p className="text-slate-400 text-sm">Manage fleet and protocols.</p>
        </div>
        <Button variant="secondary" onClick={() => setShowSquadEditor(true)} className="text-xs py-2 px-3">
            <Users size={16} className="mr-2"/> Squad
        </Button>
      </header>

      <Tabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        tabs={[
            { id: 'hangar', label: 'Hangar' },
            { id: 'workshop', label: 'Workshop' },
            { id: 'warehouse', label: 'Warehouse' }
        ]} 
      />

      {/* HANGAR TAB */}
      {activeTab === 'hangar' && (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-3 gap-3">
                {player.roster.map(machine => {
                    const isInSquad = player.battleTeamIds.includes(machine.id);
                    return (
                        <div 
                            key={machine.id} 
                            onClick={() => setSelectedMachineId(machine.id)}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${selectedMachineId === machine.id ? 'border-cyan-400 ring-2 ring-cyan-400/30 scale-105 z-10' : 'border-slate-800 hover:border-slate-600'}`}
                        >
                            <img 
                            src={`https://picsum.photos/seed/${machine.imageSeed}/200/200`} 
                            className="w-full h-full object-cover" 
                            alt={machine.name} 
                            />
                            {isInSquad && (
                                <div className="absolute top-1 right-1 bg-cyan-500 rounded-full p-0.5 shadow-lg z-10">
                                    <CheckCircle size={12} className="text-white" />
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-1 text-center pt-4">
                                <span className="text-[10px] font-bold text-white block truncate">{machine.name}</span>
                                <span className="text-[9px] text-cyan-400 font-mono">LV {machine.level}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedMachine && (
                <Card className="animate-fade-in-up border-t-2 border-t-cyan-500 bg-slate-900/95">
                    <div className="flex gap-4 mb-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-600 shrink-0">
                             <img src={`https://picsum.photos/seed/${selectedMachine.imageSeed}/200/200`} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                             <h3 className="text-lg font-bold text-white leading-tight mb-1">{selectedMachine.name}</h3>
                             <div className="flex gap-2 mb-2">
                                <Badge>{selectedMachine.rarity}</Badge>
                                <Badge color="bg-indigo-900">{selectedMachine.element}</Badge>
                            </div>
                            <div className="text-[10px] text-slate-400 line-clamp-2">{selectedMachine.description}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-4 text-center">
                         <div className="bg-slate-950 border border-slate-800 p-2 rounded">
                            <div className="text-[9px] text-slate-500 uppercase">HP</div>
                            <div className="font-mono text-sm font-bold text-white">{selectedMachine.stats.maxHealth}</div>
                         </div>
                         <div className="bg-slate-950 border border-slate-800 p-2 rounded">
                            <div className="text-[9px] text-slate-500 uppercase">SHLD</div>
                            <div className="font-mono text-sm font-bold text-cyan-300">{selectedMachine.stats.maxShield}</div>
                         </div>
                         <div className="bg-slate-950 border border-slate-800 p-2 rounded">
                            <div className="text-[9px] text-slate-500 uppercase">ATK</div>
                            <div className="font-mono text-sm font-bold text-red-400">{selectedMachine.stats.attack}</div>
                         </div>
                         <div className="bg-slate-950 border border-slate-800 p-2 rounded">
                            <div className="text-[9px] text-slate-500 uppercase">SPD</div>
                            <div className="font-mono text-sm font-bold text-amber-400">{selectedMachine.stats.speed}</div>
                         </div>
                    </div>

                    {/* XP Bar */}
                    <div className="mb-4 bg-slate-950 p-3 rounded border border-slate-800">
                        <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                            <span>LEVEL {selectedMachine.level}</span>
                            <span>{selectedMachine.xp} / {LEVEL_XP_CURVE(selectedMachine.level)} XP</span>
                        </div>
                        <ProgressBar current={selectedMachine.xp} max={LEVEL_XP_CURVE(selectedMachine.level)} color="bg-purple-500" />
                    </div>
                    
                    <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => levelUpMachine(selectedMachine.id, 50)}>Train Unit</Button>
                        <Button variant="secondary" className="flex-1"><Cpu size={16} className="inline mr-1"/> Systems</Button>
                    </div>
                </Card>
            )}
        </div>
      )}

      {/* WORKSHOP TAB */}
      {activeTab === 'workshop' && (
          <div className="space-y-4 animate-fade-in">
              {blueprints.length === 0 ? (
                  <div className="text-center py-12 opacity-50 border-2 border-dashed border-slate-800 rounded-xl">
                      <Hammer size={48} className="mx-auto mb-2 text-slate-600" />
                      <p>No blueprints available.</p>
                      <p className="text-xs mt-1">Visit the Market to acquire schematics.</p>
                  </div>
              ) : (
                  blueprints.map((bp, idx) => {
                      const costs = bp.crafting.parts;
                      const canCraft = 
                        player.inventory.parts.common >= costs.common &&
                        player.inventory.parts.uncommon >= costs.uncommon &&
                        player.inventory.parts.rare >= costs.rare;

                      return (
                        <RarityBorder key={idx} rarity={bp.rarity} className="bg-slate-900">
                            <div className="p-3 flex gap-3 border-b border-slate-800">
                                <div className="w-16 h-16 bg-black rounded flex items-center justify-center overflow-hidden relative shrink-0">
                                     <img src={`https://picsum.photos/seed/${bp.imageSeed}/100/100`} className="absolute inset-0 opacity-50" />
                                     <Cpu className="text-white z-10" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{bp.name}</h3>
                                    <div className="text-xs text-slate-400 mb-1">{bp.rarity} Schematic</div>
                                    {canCraft ? <span className="text-xs text-emerald-400 font-bold">Ready to Build</span> : <span className="text-xs text-red-400">Insufficient Parts</span>}
                                </div>
                            </div>
                            
                            <div className="p-3 bg-black/20 grid grid-cols-3 gap-2 text-center text-xs">
                                <div>
                                    <div className={player.inventory.parts.common >= costs.common ? 'text-white font-bold' : 'text-red-400'}>{player.inventory.parts.common}/{costs.common}</div>
                                    <div className="text-[9px] text-slate-500 uppercase">Common</div>
                                </div>
                                <div>
                                    <div className={player.inventory.parts.uncommon >= costs.uncommon ? 'text-white font-bold' : 'text-red-400'}>{player.inventory.parts.uncommon}/{costs.uncommon}</div>
                                    <div className="text-[9px] text-slate-500 uppercase">Uncommon</div>
                                </div>
                                <div>
                                    <div className={player.inventory.parts.rare >= costs.rare ? 'text-white font-bold' : 'text-red-400'}>{player.inventory.parts.rare}/{costs.rare}</div>
                                    <div className="text-[9px] text-slate-500 uppercase">Rare</div>
                                </div>
                            </div>

                            <div className="p-2">
                                <Button 
                                    disabled={!canCraft} 
                                    variant={canCraft ? 'success' : 'secondary'} 
                                    className="w-full py-3 text-xs"
                                    onClick={() => craftMachine(bp.crafting.blueprintId)}
                                >
                                    {canCraft ? 'Initialize Assembly' : 'Gathering Resources...'}
                                </Button>
                            </div>
                        </RarityBorder>
                      );
                  })
              )}
          </div>
      )}

      {/* WAREHOUSE TAB */}
      {activeTab === 'warehouse' && (
          <div className="animate-fade-in">
              <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider pl-1">Component Storage</h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                  <Card className="flex flex-col items-center justify-center p-4 border-slate-600 bg-slate-800">
                      <Box className="text-slate-400 mb-2" />
                      <div className="text-2xl font-bold text-white">{player.inventory.parts.common}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest">Common</div>
                  </Card>
                  <Card className="flex flex-col items-center justify-center p-4 border-emerald-800 bg-emerald-950/30">
                      <Box className="text-emerald-400 mb-2" />
                      <div className="text-2xl font-bold text-white">{player.inventory.parts.uncommon}</div>
                      <div className="text-[10px] text-emerald-400/60 uppercase tracking-widest">Uncommon</div>
                  </Card>
                  <Card className="flex flex-col items-center justify-center p-4 border-amber-800 bg-amber-950/30">
                      <Box className="text-amber-500 mb-2" />
                      <div className="text-2xl font-bold text-white">{player.inventory.parts.rare}</div>
                      <div className="text-[10px] text-amber-400/60 uppercase tracking-widest">Rare</div>
                  </Card>
              </div>

              <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider pl-1">Schematic Archive</h3>
              <div className="space-y-2">
                  {player.inventory.blueprints.length > 0 ? (
                      blueprints.map((bp, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg">
                              <div className="flex items-center">
                                <Grid size={16} className="mr-3 text-cyan-600" />
                                <span className="text-sm font-bold text-slate-300">{bp.name}</span>
                              </div>
                              <ChevronRight size={14} className="text-slate-600" />
                          </div>
                      ))
                  ) : (
                      <div className="text-slate-600 text-sm italic p-4 border border-dashed border-slate-800 rounded text-center">No stored blueprints.</div>
                  )}
              </div>
          </div>
      )}

      <Modal isOpen={showSquadEditor} onClose={() => setShowSquadEditor(false)} title="Squad Configuration">
          <div className="p-2">
              <p className="text-sm text-slate-400 mb-4">Select exactly 3 units for your Active Deployment.</p>
              <div className="grid grid-cols-3 gap-2">
                  {player.roster.map(machine => {
                      const isSelected = player.battleTeamIds.includes(machine.id);
                      return (
                        <div 
                            key={machine.id} 
                            onClick={() => handleSquadChange(machine.id)}
                            className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer ${isSelected ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-slate-800 opacity-70'}`}
                        >
                            <img src={`https://picsum.photos/seed/${machine.imageSeed}/200/200`} className="w-full h-full object-cover" />
                            {isSelected && (
                                <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                                    <CheckCircle className="text-white drop-shadow-md" />
                                </div>
                            )}
                        </div>
                      )
                  })}
              </div>
              <div className="mt-4">
                  <Button variant="primary" className="w-full" onClick={() => setShowSquadEditor(false)}>Confirm Deployment ({player.battleTeamIds.length}/3)</Button>
              </div>
          </div>
      </Modal>
    </div>
  );
};

export default Lab;
