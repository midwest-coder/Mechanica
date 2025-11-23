
export enum MachineRarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  LEGENDARY = 'Legendary',
}

export enum ElementType {
  KINETIC = 'Kinetic',
  THERMAL = 'Thermal', // Fire
  VOLTAIC = 'Voltaic', // Lightning
  CRYOGENIC = 'Cryogenic', // Ice
  BIO = 'Bio-Mech', // Nature/Acid
}

export enum StatType {
  ATTACK = 'Attack',
  HEALTH = 'Health',
  SHIELD = 'Shield',
  SHIELD_REGEN = 'Shield Regen',
  SPEED = 'Speed',
}

export interface Move {
  id: string;
  name: string;
  type: ElementType;
  damageMultiplier: number; // 1.0 = 100% attack
  isBuff: boolean;
  statTarget?: StatType;
  buffAmount?: number;
  description: string;
  cooldown: number;
}

export interface CraftingRequirements {
  blueprintId: string;
  parts: {
    common: number;
    uncommon: number;
    rare: number;
  };
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  levelReq: number;
  unlockedMoveId?: string;
  statBonus?: { stat: StatType; value: number };
  parentId?: string;
}

export interface Machine {
  id: string;
  name: string;
  description: string; // Added
  tribeId: string | null; // Null is Neutral
  rarity: MachineRarity;
  element: ElementType;
  level: number;
  xp: number;
  crafting: CraftingRequirements; // Added
  stats: {
    maxHealth: number;
    currentHealth: number;
    maxShield: number;
    currentShield: number;
    shieldRegen: number;
    attack: number;
    speed: number;
  };
  baseStats: { // For library view (level 1 stats)
    maxHealth: number;
    maxShield: number;
    shieldRegen: number;
    attack: number;
    speed: number;
  };
  moves: Move[]; 
  equippedMoves: string[]; 
  skillTree: SkillNode[]; // Added
  imageSeed: string;
}

export interface Guild {
  id: string;
  name: string;
  description: string;
  perk: string;
  color: string;
  icon: string; // lucide icon name
}

export interface MatchHistoryEntry {
  id: string;
  opponentName: string;
  result: 'Victory' | 'Defeat';
  timestamp: number;
  rewards: { credits: number; bounty?: number };
  teamUsed: string[]; // IDs of machines used
}

export interface Player {
  id: string;
  username: string;
  avatarSeed: string; // New field for profile pic
  level: number;
  xp: number;
  credits: number;
  bountyCoins: number;
  guildId: string | null;
  inventory: {
    parts: {
      common: number;
      uncommon: number;
      rare: number;
    };
    blueprints: string[]; // IDs of machine blueprints owned
  };
  roster: Machine[];
  battleTeamIds: string[]; 
  dailyWins: number;
  dailyClaimed: boolean;
  walletAddress?: string;
  matchHistory: MatchHistoryEntry[]; // New field
}

export interface BattleState {
  active: boolean;
  turn: number;
  playerTeam: Machine[];
  enemyTeam: Machine[];
  logs: string[];
  phase: 'selection' | 'execution' | 'victory' | 'defeat';
  selectedUnitId: string | null;
  selectedMoveId: string | null;
  enemyAction: { unitId: string; moveId: string } | null;
}
