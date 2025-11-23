
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Player, Machine, MatchHistoryEntry } from './types';
import { INITIAL_ROSTER, LEVEL_XP_CURVE, MINION_LIBRARY } from './constants';
import { auth, db } from './firebase';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    User 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface GameContextType {
  player: Player;
  isLoading: boolean;
  isOnline: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  addCredits: (amount: number) => void;
  addBountyCoins: (amount: number) => void;
  joinGuild: (guildId: string) => void;
  levelUpMachine: (machineId: string, xpAmount: number) => void;
  openChest: (type: 'daily' | 'purchased') => any;
  craftMachine: (blueprintId: string) => void;
  updateDailyTask: (won: boolean) => void;
  connectWallet: () => void;
  recordMatch: (entry: MatchHistoryEntry) => void;
  updateProfile: (updates: Partial<Player>) => void;
}

const defaultPlayer: Player = {
  id: 'guest',
  username: 'Guest_Mechanic',
  avatarSeed: 'guest',
  level: 1,
  xp: 0,
  credits: 500,
  bountyCoins: 0,
  guildId: null,
  inventory: {
    parts: { common: 50, uncommon: 20, rare: 5 },
    blueprints: [MINION_LIBRARY[5].crafting.blueprintId, MINION_LIBRARY[55].crafting.blueprintId]
  },
  roster: INITIAL_ROSTER,
  battleTeamIds: [INITIAL_ROSTER[0].id, INITIAL_ROSTER[1].id, INITIAL_ROSTER[2].id],
  dailyWins: 0,
  dailyClaimed: false,
  matchHistory: []
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children?: ReactNode }) => {
  const [player, setPlayer] = useState<Player>(defaultPlayer);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync Helper: Updates Local State AND Firestore
  const updatePlayerState = async (updater: (prev: Player) => Player) => {
    // 1. Optimistic Update
    let newState: Player | undefined;
    setPlayer(prev => {
        newState = updater(prev);
        return newState;
    });

    // 2. Firebase Write
    if (user && newState) {
        try {
            const userRef = doc(db, 'players', user.uid);
            await updateDoc(userRef, { ...newState });
        } catch (e) {
            console.error("Error saving to cloud:", e);
        }
    }
  };

  // Auth Logic
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
            setUser(currentUser);
            // Load Data
            try {
                const docRef = doc(db, 'players', currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPlayer(docSnap.data() as Player);
                } else {
                    // This case shouldn't happen often if registered correctly, but fallback just in case
                    const newPlayerData = { 
                        ...defaultPlayer, 
                        id: currentUser.uid, 
                        username: currentUser.email?.split('@')[0] || `Mechanic_${currentUser.uid.slice(0,5)}`,
                        avatarSeed: currentUser.uid
                    };
                    await setDoc(docRef, newPlayerData);
                    setPlayer(newPlayerData);
                }
            } catch (err) {
                console.error("Firestore Load Failed", err);
            }
        } else {
            setUser(null);
            setPlayer(defaultPlayer);
        }
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
      await signInWithEmailAndPassword(auth, email, pass);
  };

  const register = async (email: string, pass: string) => {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      // Create initial DB entry
      const newPlayer: Player = {
          ...defaultPlayer,
          id: cred.user.uid,
          username: email.split('@')[0], // Default username from email
          avatarSeed: cred.user.uid
      };
      await setDoc(doc(db, 'players', cred.user.uid), newPlayer);
      setPlayer(newPlayer);
  };

  const logout = async () => {
      await signOut(auth);
      setPlayer(defaultPlayer);
  };

  // Game Actions
  const addCredits = (amount: number) => {
    updatePlayerState(prev => ({ ...prev, credits: prev.credits + amount }));
  };

  const addBountyCoins = (amount: number) => {
    updatePlayerState(prev => ({ ...prev, bountyCoins: prev.bountyCoins + amount }));
  };

  const joinGuild = (guildId: string) => {
    updatePlayerState(prev => ({ ...prev, guildId }));
  };

  const connectWallet = () => {
    setTimeout(() => {
        updatePlayerState(prev => ({...prev, walletAddress: '0x71C...9A23'}));
    }, 1000);
  }

  const updateDailyTask = (won: boolean) => {
    updatePlayerState(prev => {
        if (won && prev.dailyWins < 3) {
            return { ...prev, dailyWins: prev.dailyWins + 1 };
        }
        return prev;
    });
  }

  const levelUpMachine = (machineId: string, xpAmount: number) => {
    updatePlayerState(prev => {
      const newRoster = prev.roster.map(m => {
        if (m.id === machineId) {
          let newXp = m.xp + xpAmount;
          let newLevel = m.level;
          let needed = LEVEL_XP_CURVE(newLevel);
          while (newXp >= needed) {
            newXp -= needed;
            newLevel++;
            needed = LEVEL_XP_CURVE(newLevel);
          }
          const statMult = 1.05; 
          return {
            ...m,
            level: newLevel,
            xp: newXp,
            stats: {
                ...m.stats,
                maxHealth: Math.floor(m.stats.maxHealth * statMult),
                currentHealth: Math.floor(m.stats.maxHealth * statMult),
                attack: Math.floor(m.stats.attack * statMult),
            }
          };
        }
        return m;
      });
      return { ...prev, roster: newRoster };
    });
  };

  const craftMachine = (blueprintId: string) => {
      updatePlayerState(prev => {
        const template = MINION_LIBRARY.find(m => m.crafting.blueprintId === blueprintId);
        if (!template) return prev;
  
        const costs = template.crafting.parts;
        
        if (prev.inventory.parts.common < costs.common || 
            prev.inventory.parts.uncommon < costs.uncommon || 
            prev.inventory.parts.rare < costs.rare) {
                return prev;
        }
  
        const newMachine: Machine = {
            ...JSON.parse(JSON.stringify(template)),
            id: `${template.id}-${Date.now()}`, 
            level: 1,
            xp: 0
        };
  
        return {
            ...prev,
            inventory: {
                ...prev.inventory,
                parts: {
                    common: prev.inventory.parts.common - costs.common,
                    uncommon: prev.inventory.parts.uncommon - costs.uncommon,
                    rare: prev.inventory.parts.rare - costs.rare,
                },
                blueprints: prev.inventory.blueprints.filter(id => id !== blueprintId)
            },
            roster: [...prev.roster, newMachine]
        };
      });
  };

  const openChest = (type: 'daily' | 'purchased') => {
    let loot: any = null;

    updatePlayerState(prev => {
        let nextState = { ...prev };
        if (type === 'daily') {
            nextState.dailyClaimed = true;
        } else {
            if (prev.credits < 100) return prev;
            nextState.credits = prev.credits - 100;
        }

        // RNG Loot
        const randomBlueprint = MINION_LIBRARY[Math.floor(Math.random() * MINION_LIBRARY.length)].crafting.blueprintId;
        loot = {
            commonParts: 5,
            uncommonParts: 2,
            rareParts: 1,
            blueprint: Math.random() > 0.7 ? randomBlueprint : null
        };

        nextState.inventory = {
            ...nextState.inventory,
            parts: {
                common: nextState.inventory.parts.common + loot.commonParts,
                uncommon: nextState.inventory.parts.uncommon + loot.uncommonParts,
                rare: nextState.inventory.parts.rare + loot.rareParts,
            },
            blueprints: loot.blueprint ? [...nextState.inventory.blueprints, loot.blueprint] : nextState.inventory.blueprints
        };

        return nextState;
    });

    return loot;
  };

  const recordMatch = (entry: MatchHistoryEntry) => {
      updatePlayerState(prev => ({
          ...prev,
          matchHistory: [entry, ...prev.matchHistory].slice(0, 20)
      }));
  };

  const updateProfile = (updates: Partial<Player>) => {
      updatePlayerState(prev => ({ ...prev, ...updates }));
  };

  return (
    <GameContext.Provider value={{ 
        player, 
        isLoading, 
        isOnline: !!user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        addCredits, 
        addBountyCoins, 
        joinGuild, 
        levelUpMachine, 
        openChest, 
        updateDailyTask, 
        connectWallet, 
        craftMachine,
        recordMatch,
        updateProfile
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
