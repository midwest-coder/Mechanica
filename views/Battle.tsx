
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../GameContext';
import { Button, Card, ProgressBar, Badge } from '../components/Shared';
import { Machine, BattleState, StatType, Move } from '../types';
import { STORY_CHAPTERS, MOVES_DB } from '../constants';
import { Sword, Wallet, Target, Zap, Timer, ShieldAlert } from 'lucide-react';

type Mode = 'menu' | 'story_select' | 'bounty_lobby' | 'combat';

const Battle = () => {
  const { player, addBountyCoins, updateDailyTask, connectWallet, addCredits, recordMatch } = useGame();
  const [mode, setMode] = useState<Mode>('menu');
  const [battleType, setBattleType] = useState<'story' | 'pvp' | 'bounty'>('pvp');
  
  // Battle Engine State
  // Phase: 'deployment' (pick unit) -> 'reveal' (slide in) -> 'command' (pick move) -> 'combat' (animate)
  const [battleState, setBattleState] = useState<BattleState>({
    active: false,
    turn: 1,
    playerTeam: [],
    enemyTeam: [],
    logs: [],
    phase: 'deployment',
    selectedUnitId: null,
    selectedMoveId: null,
    enemyAction: null
  });

  const [activeCombatants, setActiveCombatants] = useState<{player: string | null, enemy: string | null}>({player: null, enemy: null});
  const [combatAnimation, setCombatAnimation] = useState<'idle' | 'player-atk' | 'enemy-atk' | 'hit'>('idle');

  // --- Setup Battle ---
  const startBattle = (type: 'story' | 'pvp' | 'bounty', difficulty: number = 1) => {
    // Clone roster for mutable battle state
    const pTeam = player.battleTeamIds
        .map(id => player.roster.find(m => m.id === id))
        .filter((m): m is Machine => !!m)
        .map(m => JSON.parse(JSON.stringify(m))); // Deep clone

    // Generate Enemy Team
    const eTeam = pTeam.map((m, i) => ({
        ...JSON.parse(JSON.stringify(m)),
        id: `enemy-${i}`,
        name: `Rogue Bot MK-${difficulty}`,
        stats: {
            ...m.stats,
            currentHealth: m.stats.maxHealth, 
            maxHealth: Math.floor(m.stats.maxHealth * (0.8 + (difficulty * 0.1))), 
            speed: Math.floor(m.stats.speed * (0.9 + (Math.random() * 0.2)))
        },
        imageSeed: `enemy-${i}-${Date.now()}`
    }));

    setBattleType(type);
    setBattleState({
        active: true,
        turn: 1,
        playerTeam: pTeam,
        enemyTeam: eTeam,
        logs: [`Battle Initialized. Deployment Phase active.`],
        phase: 'deployment',
        selectedUnitId: null,
        selectedMoveId: null,
        enemyAction: null
    });
    setActiveCombatants({player: null, enemy: null});
    setMode('combat');
  };

  // --- Phase 1: Deployment (Tactical Choice) ---
  const handleDeployUnit = (unitId: string) => {
      if (battleState.phase !== 'deployment') return;
      
      // Player picks unit
      const pUnit = battleState.playerTeam.find(u => u.id === unitId);
      if (!pUnit || pUnit.stats.currentHealth <= 0) return;

      // Enemy picks random living unit
      const validEnemies = battleState.enemyTeam.filter(u => u.stats.currentHealth > 0);
      const eUnit = validEnemies[Math.floor(Math.random() * validEnemies.length)];

      // Transition to Reveal
      setActiveCombatants({ player: unitId, enemy: eUnit.id });
      setBattleState(prev => ({ 
          ...prev, 
          selectedUnitId: unitId,
          enemyAction: { unitId: eUnit.id, moveId: '' } ,
          phase: 'reveal' // Intermediate phase for animations
      }));

      // Delay for Reveal Animation -> Then Command Phase
      setTimeout(() => {
          setBattleState(prev => ({ ...prev, phase: 'selection' }));
      }, 1500);
  };

  // --- Phase 2: Command (Move Selection) ---
  const handleMoveSelect = (moveId: string) => {
     if (battleState.phase !== 'selection') return;
     setBattleState(prev => ({ ...prev, selectedMoveId: moveId }));
     
     // Trigger Combat Sequence
     executeCombatRound(moveId);
  };

  // --- Phase 3: Combat Execution ---
  const executeCombatRound = (playerMoveId: string) => {
    setBattleState(prev => ({ ...prev, phase: 'execution' }));

    const pUnit = battleState.playerTeam.find(u => u.id === activeCombatants.player)!;
    const eUnit = battleState.enemyTeam.find(u => u.id === activeCombatants.enemy)!;
    
    const pMove = pUnit.moves.find(m => m.id === playerMoveId)!;
    // Enemy Move AI
    const eMove = eUnit.moves[Math.floor(Math.random() * eUnit.moves.length)];

    // Speed Check
    const playerFirst = pUnit.stats.speed >= eUnit.stats.speed;
    
    const performAttack = (attacker: Machine, defender: Machine, move: Move, isPlayer: boolean) => {
        return new Promise<void>((resolve) => {
            if (attacker.stats.currentHealth <= 0) {
                resolve();
                return;
            }

            // 1. Animation Start
            setCombatAnimation(isPlayer ? 'player-atk' : 'enemy-atk');
            
            setTimeout(() => {
                setCombatAnimation('hit'); // Shake effect
                
                // 2. Logic Apply
                let damage = 0;
                let log = '';

                if (move.isBuff) {
                     // Simple buff logic
                     attacker.stats.currentShield += (move.buffAmount || 0);
                     log = `${attacker.name} used ${move.name} (Buff)`;
                } else {
                     damage = Math.floor(attacker.stats.attack * move.damageMultiplier);
                     if (defender.stats.currentShield > 0) {
                         const shieldDmg = Math.min(defender.stats.currentShield, damage);
                         defender.stats.currentShield -= shieldDmg;
                         damage -= shieldDmg;
                     }
                     defender.stats.currentHealth = Math.max(0, defender.stats.currentHealth - damage);
                     log = `${attacker.name} used ${move.name} for ${damage} DMG!`;
                }

                setBattleState(prev => ({
                    ...prev,
                    logs: [...prev.logs, log]
                }));

                // 3. Reset Animation
                setTimeout(() => {
                    setCombatAnimation('idle');
                    resolve();
                }, 500);
            }, 400); // Time for lunge to hit
        });
    };

    const runSequence = async () => {
        if (playerFirst) {
            await performAttack(pUnit, eUnit, pMove, true);
            if (eUnit.stats.currentHealth > 0) await performAttack(eUnit, pUnit, eMove, false);
        } else {
            await performAttack(eUnit, pUnit, eMove, false);
            if (pUnit.stats.currentHealth > 0) await performAttack(pUnit, eUnit, pMove, true);
        }

        // Check Win/Loss
        const playerAlive = battleState.playerTeam.some(u => u.stats.currentHealth > 0);
        const enemyAlive = battleState.enemyTeam.some(u => u.stats.currentHealth > 0);

        if (!playerAlive) {
            setBattleState(prev => ({ ...prev, phase: 'defeat' }));
        } else if (!enemyAlive) {
            setBattleState(prev => ({ ...prev, phase: 'victory' }));
        } else {
            // Reset for next turn deployment
            setTimeout(() => {
                setBattleState(prev => ({ 
                    ...prev, 
                    phase: 'deployment', 
                    turn: prev.turn + 1, 
                    selectedUnitId: null, 
                    selectedMoveId: null 
                }));
                setActiveCombatants({ player: null, enemy: null });
            }, 1000);
        }
    };

    runSequence();
  };

  const handleEndBattle = () => {
    const won = battleState.phase === 'victory';
    const reward = won ? (battleType === 'bounty' ? 0 : 50) : 10;
    const bountyReward = (won && battleType === 'bounty') ? 10 : 0;

    if (won) {
        updateDailyTask(true);
        if (battleType === 'bounty') addBountyCoins(10);
        else addCredits(50);
    } else {
        addCredits(10); 
    }

    recordMatch({
        id: `match-${Date.now()}`,
        opponentName: battleState.enemyTeam[0]?.name || 'Unknown Enemy',
        result: won ? 'Victory' : 'Defeat',
        timestamp: Date.now(),
        rewards: { credits: reward, bounty: bountyReward || undefined },
        teamUsed: battleState.playerTeam.map(u => u.id)
    });

    setMode('menu');
  };

  // --- Render ---
  if (mode === 'menu') {
    return (
        <div className="p-4 space-y-4 pb-24">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Battle Zone</h2>
            <Card className="relative overflow-hidden group" onClick={() => setMode('story_select')}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-transparent z-0"></div>
                <div className="relative z-10 p-2">
                    <h3 className="text-xl font-bold text-white flex items-center"><Sword className="mr-2"/> Story Mode</h3>
                    <p className="text-xs text-slate-300">Uncover the secrets of Isaac.</p>
                </div>
            </Card>
            <Card className="relative overflow-hidden group" onClick={() => startBattle('pvp')}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent z-0"></div>
                <div className="relative z-10 p-2">
                    <h3 className="text-xl font-bold text-white flex items-center"><Zap className="mr-2"/> PVP Arena</h3>
                    <p className="text-xs text-slate-300">Standard 3v3 Combat.</p>
                </div>
            </Card>
            <Card className="relative overflow-hidden group border-amber-500/50" onClick={() => setMode('bounty_lobby')}>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/40 to-transparent z-0"></div>
                <div className="relative z-10 p-2">
                    <h3 className="text-xl font-bold text-amber-400 flex items-center"><Target className="mr-2"/> Bounty Mode</h3>
                    <p className="text-xs text-amber-200">Wager credits, earn Crypto.</p>
                </div>
            </Card>
        </div>
    );
  }

  if (mode === 'story_select') {
      return (
        <div className="p-4 space-y-4 pb-24">
            <Button variant="secondary" onClick={() => setMode('menu')}>&larr; Back</Button>
            <h2 className="text-xl font-bold text-white">Campaign</h2>
            {STORY_CHAPTERS.map(ch => (
                <Card key={ch.id}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-purple-400">Chapter {ch.id}</span>
                        <Button className="py-1 px-3 text-xs" onClick={() => startBattle('story', ch.id)}>Play</Button>
                    </div>
                    <h4 className="font-bold">{ch.title}</h4>
                    <p className="text-xs text-slate-400">{ch.description}</p>
                </Card>
            ))}
        </div>
      );
  }

  if (mode === 'bounty_lobby') {
    return (
        <div className="p-4 space-y-6 pb-24">
            <Button variant="secondary" onClick={() => setMode('menu')}>&larr; Back</Button>
            <div className="text-center space-y-2">
                <Target size={48} className="mx-auto text-amber-500" />
                <h2 className="text-2xl font-bold text-white">Bounty Mode</h2>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                    Entry Fee: <span className="text-amber-400">50 Credits</span>
                </p>
            </div>
            <Button 
                variant="gold" 
                className="w-full" 
                onClick={() => {
                    if (player.credits >= 50) {
                        addCredits(-50);
                        startBattle('bounty', 3);
                    } else {
                        alert("Not enough credits!");
                    }
                }}
            >
                Pay Entry (50 Credits)
            </Button>
        </div>
    );
  }

  // --- MAIN COMBAT UI ---
  
  const pActiveUnit = battleState.playerTeam.find(u => u.id === activeCombatants.player);
  const eActiveUnit = battleState.enemyTeam.find(u => u.id === activeCombatants.enemy);

  return (
    <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col">
        {/* Top HUD */}
        <div className="bg-slate-900 p-2 flex justify-between items-center border-b border-slate-800 z-20">
            <div className="flex gap-1">
                {battleState.playerTeam.map(u => (
                    <div key={u.id} className={`w-3 h-3 rounded-full ${u.stats.currentHealth > 0 ? 'bg-cyan-500' : 'bg-slate-700'}`}></div>
                ))}
            </div>
            <span className="text-red-400 font-bold text-sm font-mono">TURN {battleState.turn}</span>
            <div className="flex gap-1">
                {battleState.enemyTeam.map(u => (
                    <div key={u.id} className={`w-3 h-3 rounded-full ${u.stats.currentHealth > 0 ? 'bg-red-500' : 'bg-slate-700'}`}></div>
                ))}
            </div>
        </div>

        {/* BATTLEFIELD */}
        <div className="flex-1 relative flex flex-col overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
            
            {/* Logs */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3/4 text-center z-10 pointer-events-none">
                {battleState.logs.slice(-1).map((log, i) => (
                    <div key={i} className="bg-black/60 text-cyan-300 text-xs px-3 py-1 rounded-full backdrop-blur animate-fade-in border border-cyan-500/30">
                        {log}
                    </div>
                ))}
            </div>

            {/* DEPLOYMENT PHASE VIEW */}
            {battleState.phase === 'deployment' && (
                <div className="flex-1 flex flex-col items-center justify-center gap-8 animate-fade-in">
                    <h3 className="text-cyan-400 font-bold uppercase tracking-widest animate-pulse">Select Unit to Deploy</h3>
                    <div className="flex gap-2">
                        {battleState.playerTeam.map(unit => (
                            <div 
                                key={unit.id} 
                                onClick={() => handleDeployUnit(unit.id)}
                                className={`w-24 h-32 border-2 rounded-xl bg-slate-900 p-1 relative transition-all ${unit.stats.currentHealth <= 0 ? 'opacity-40 grayscale pointer-events-none border-slate-800' : 'border-cyan-500 cursor-pointer hover:scale-105'}`}
                            >
                                <img src={`https://picsum.photos/seed/${unit.imageSeed}/200/200`} className="w-full h-full object-cover rounded-lg" />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[10px] text-center py-1 font-bold">
                                    HP {unit.stats.currentHealth}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-slate-500 text-xs">Enemy is strategizing...</div>
                </div>
            )}

            {/* ACTIVE COMBAT VIEW (Reveal, Selection, Execution) */}
            {battleState.phase !== 'deployment' && battleState.phase !== 'victory' && battleState.phase !== 'defeat' && (
                <div className="flex-1 flex flex-col items-center justify-center relative">
                    
                    {/* Enemy Unit */}
                    <div className={`transition-all duration-500 ${combatAnimation === 'enemy-atk' ? 'animate-lunge-left z-20' : ''} ${combatAnimation === 'hit' ? 'animate-shake' : ''}`}>
                        {eActiveUnit && (
                            <div className={`w-32 h-32 relative ${battleState.phase === 'reveal' ? 'animate-enter-arena' : ''}`}>
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-red-400 font-bold text-xs whitespace-nowrap">{eActiveUnit.name}</div>
                                <img src={`https://picsum.photos/seed/${eActiveUnit.imageSeed}/200/200`} className="w-full h-full rounded-xl border-4 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]" />
                                <div className="absolute -bottom-3 left-0 right-0">
                                    <ProgressBar current={eActiveUnit.stats.currentHealth} max={eActiveUnit.stats.maxHealth} color="bg-red-500" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* VS / Speed Indicator */}
                    <div className="my-6 flex items-center justify-center gap-4">
                        {pActiveUnit && eActiveUnit && (
                            <div className="flex items-center bg-black/50 rounded-full px-4 py-1 border border-slate-700 backdrop-blur">
                                <div className={`text-xs font-bold mr-2 ${pActiveUnit.stats.speed >= eActiveUnit.stats.speed ? 'text-cyan-400' : 'text-slate-600'}`}>YOU</div>
                                <Timer size={14} className="text-slate-400" />
                                <div className={`text-xs font-bold ml-2 ${eActiveUnit.stats.speed > pActiveUnit.stats.speed ? 'text-red-400' : 'text-slate-600'}`}>ENEMY</div>
                            </div>
                        )}
                    </div>

                    {/* Player Unit */}
                    <div className={`transition-all duration-500 ${combatAnimation === 'player-atk' ? 'animate-lunge-right z-20' : ''} ${combatAnimation === 'hit' ? 'animate-shake' : ''}`}>
                         {pActiveUnit && (
                            <div className={`w-32 h-32 relative ${battleState.phase === 'reveal' ? 'animate-enter-arena' : ''}`}>
                                <img src={`https://picsum.photos/seed/${pActiveUnit.imageSeed}/200/200`} className="w-full h-full rounded-xl border-4 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]" />
                                <div className="absolute -bottom-3 left-0 right-0">
                                    <ProgressBar current={pActiveUnit.stats.currentHealth} max={pActiveUnit.stats.maxHealth} color="bg-green-500" />
                                    {pActiveUnit.stats.currentShield > 0 && <div className="h-1 bg-blue-500 w-full mt-0.5 rounded-full"></div>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        {/* CONTROL PANEL */}
        <div className="h-[220px] bg-slate-900 border-t border-slate-700 p-3 z-30">
            {battleState.phase === 'victory' || battleState.phase === 'defeat' ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <h2 className={`text-4xl font-bold animate-bounce ${battleState.phase === 'victory' ? 'text-green-400' : 'text-red-500'}`}>
                        {battleState.phase.toUpperCase()}
                    </h2>
                    <Button variant="primary" className="w-40" onClick={handleEndBattle}>Continue</Button>
                </div>
            ) : battleState.phase === 'selection' && pActiveUnit ? (
                <div className="h-full flex flex-col">
                    <div className="text-center text-xs text-slate-500 mb-2 uppercase tracking-widest">Command Phase</div>
                    <div className="grid grid-cols-2 gap-2 overflow-y-auto no-scrollbar pb-2">
                        {pActiveUnit.moves.map(move => (
                            <Button 
                                key={move.id} 
                                variant="secondary" 
                                className="text-left px-3 py-2 h-auto flex flex-col items-start border-slate-700 hover:border-cyan-500"
                                onClick={() => handleMoveSelect(move.id)}
                            >
                                <div className="flex justify-between w-full">
                                    <span className="font-bold text-xs text-white">{move.name}</span>
                                    <span className="text-[9px] text-cyan-400 uppercase">{move.type.slice(0,3)}</span>
                                </div>
                                <span className="text-[9px] text-slate-400 line-clamp-1">{move.description}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            ) : (
                 <div className="flex items-center justify-center h-full text-slate-600 text-sm italic">
                    {battleState.phase === 'deployment' ? 'Awaiting Deployment...' : 'Engaging hostiles...'}
                </div>
            )}
        </div>
    </div>
  );
};

export default Battle;
