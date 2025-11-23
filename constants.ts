
import { ElementType, Guild, Machine, MachineRarity, Move, StatType, SkillNode } from './types';

// --- MOVES DATABASE (Expanded) ---
export const MOVES_DB: Record<string, Move> = {
  // KINETIC (Physical)
  'strike': { id: 'strike', name: 'Kinetic Strike', type: ElementType.KINETIC, damageMultiplier: 1.0, isBuff: false, description: 'A basic mechanical strike.', cooldown: 0 },
  'slam': { id: 'slam', name: 'Hydraulic Slam', type: ElementType.KINETIC, damageMultiplier: 1.3, isBuff: false, description: 'Heavy impact damage.', cooldown: 1 },
  'gatling': { id: 'gatling', name: 'Rotary Cannon', type: ElementType.KINETIC, damageMultiplier: 0.8, isBuff: false, description: 'Multi-hit suppression fire.', cooldown: 2 },
  'bunker': { id: 'bunker', name: 'Bunker Down', type: ElementType.KINETIC, damageMultiplier: 0, isBuff: true, statTarget: StatType.SHIELD, buffAmount: 40, description: 'Fortifies position.', cooldown: 3 },
  'repair': { id: 'repair', name: 'Nanite Repair', type: ElementType.KINETIC, damageMultiplier: 0, isBuff: true, statTarget: StatType.HEALTH, buffAmount: 50, description: 'Repairs hull integrity.', cooldown: 4 },
  'missile': { id: 'missile', name: 'Titan Missile', type: ElementType.KINETIC, damageMultiplier: 1.8, isBuff: false, description: 'Long range explosive.', cooldown: 3 },
  'shred': { id: 'shred', name: 'Armor Shred', type: ElementType.KINETIC, damageMultiplier: 1.2, isBuff: false, description: 'Weakens enemy structure.', cooldown: 2 },
  'omega-beam': { id: 'omega-beam', name: 'Omega Cannon', type: ElementType.KINETIC, damageMultiplier: 3.0, isBuff: false, description: 'Ultimate destruction.', cooldown: 6 },

  // THERMAL (Fire)
  'ember': { id: 'ember', name: 'Ember Shot', type: ElementType.THERMAL, damageMultiplier: 1.1, isBuff: false, description: 'Small burst of heat.', cooldown: 0 },
  'flamethrower': { id: 'flamethrower', name: 'Thermal Vent', type: ElementType.THERMAL, damageMultiplier: 1.5, isBuff: false, description: 'Blasts excess heat at the enemy.', cooldown: 2 },
  'overheat': { id: 'overheat', name: 'Core Overheat', type: ElementType.THERMAL, damageMultiplier: 2.2, isBuff: false, description: 'Massive damage but hurts self.', cooldown: 4 },
  'melt': { id: 'melt', name: 'Slag Melt', type: ElementType.THERMAL, damageMultiplier: 1.3, isBuff: false, description: 'Melts armor plating.', cooldown: 2 },
  'flare': { id: 'flare', name: 'Solar Flare', type: ElementType.THERMAL, damageMultiplier: 0, isBuff: true, statTarget: StatType.ATTACK, buffAmount: 20, description: 'Charges thermal output.', cooldown: 3 },
  'meteor': { id: 'meteor', name: 'Orbital Drop', type: ElementType.THERMAL, damageMultiplier: 2.5, isBuff: false, description: 'Calls down a burning satellite.', cooldown: 5 },
  'ignite': { id: 'ignite', name: 'Ignition', type: ElementType.THERMAL, damageMultiplier: 0, isBuff: true, statTarget: StatType.SPEED, buffAmount: 15, description: 'Rocket boosted agility.', cooldown: 3 },
  'magma': { id: 'magma', name: 'Magma Wave', type: ElementType.THERMAL, damageMultiplier: 1.6, isBuff: false, description: 'Area of effect heat.', cooldown: 3 },

  // VOLTAIC (Lightning)
  'zap': { id: 'zap', name: 'Static Zap', type: ElementType.VOLTAIC, damageMultiplier: 1.0, isBuff: false, description: 'Quick electric jolt.', cooldown: 0 },
  'railgun': { id: 'railgun', name: 'Railgun Shot', type: ElementType.VOLTAIC, damageMultiplier: 2.0, isBuff: false, description: 'High damage precision shot.', cooldown: 4 },
  'overclock': { id: 'overclock', name: 'Overclock', type: ElementType.VOLTAIC, damageMultiplier: 0, isBuff: true, statTarget: StatType.SPEED, buffAmount: 25, description: 'Pushing systems to the limit.', cooldown: 3 },
  'emp': { id: 'emp', name: 'E.M.P. Burst', type: ElementType.VOLTAIC, damageMultiplier: 1.2, isBuff: false, description: 'Disrupts shields heavily.', cooldown: 3 },
  'thunder': { id: 'thunder', name: 'Thunderstrike', type: ElementType.VOLTAIC, damageMultiplier: 1.7, isBuff: false, description: 'Strikes from above.', cooldown: 3 },
  'battery': { id: 'battery', name: 'Recharge', type: ElementType.VOLTAIC, damageMultiplier: 0, isBuff: true, statTarget: StatType.SHIELD, buffAmount: 30, description: 'Rapid shield charging.', cooldown: 2 },
  'plasma': { id: 'plasma', name: 'Plasma Arc', type: ElementType.VOLTAIC, damageMultiplier: 1.4, isBuff: false, description: 'Sears through defenses.', cooldown: 2 },
  'storm': { id: 'storm', name: 'Ion Storm', type: ElementType.VOLTAIC, damageMultiplier: 2.4, isBuff: false, description: 'Unleashes stored energy.', cooldown: 5 },

  // CRYOGENIC (Ice)
  'chill': { id: 'chill', name: 'Liquid Nitrogen', type: ElementType.CRYOGENIC, damageMultiplier: 1.1, isBuff: false, description: 'Slows enemy servos.', cooldown: 0 },
  'freeze': { id: 'freeze', name: 'Flash Freeze', type: ElementType.CRYOGENIC, damageMultiplier: 1.4, isBuff: false, description: 'Shatters armor with cold.', cooldown: 2 },
  'wall': { id: 'wall', name: 'Ice Wall', type: ElementType.CRYOGENIC, damageMultiplier: 0, isBuff: true, statTarget: StatType.SHIELD, buffAmount: 60, description: 'Creates a frozen barrier.', cooldown: 4 },
  'shard': { id: 'shard', name: 'Glacial Shard', type: ElementType.CRYOGENIC, damageMultiplier: 1.6, isBuff: false, description: 'Fires a sharp icicle.', cooldown: 3 },
  'absolute': { id: 'absolute', name: 'Absolute Zero', type: ElementType.CRYOGENIC, damageMultiplier: 2.3, isBuff: false, description: 'Stops all molecular motion.', cooldown: 5 },
  'snow': { id: 'snow', name: 'Blizzard', type: ElementType.CRYOGENIC, damageMultiplier: 0, isBuff: true, statTarget: StatType.SHIELD_REGEN, buffAmount: 10, description: 'Obscures vision.', cooldown: 3 },
  'frost': { id: 'frost', name: 'Frostbite', type: ElementType.CRYOGENIC, damageMultiplier: 1.3, isBuff: false, description: 'Deep freezing damage.', cooldown: 2 },
  'stasis': { id: 'stasis', name: 'Stasis Lock', type: ElementType.CRYOGENIC, damageMultiplier: 1.5, isBuff: false, description: 'Locks enemy in place.', cooldown: 3 },

  // BIO (Acid/Nature)
  'spit': { id: 'spit', name: 'Acid Spit', type: ElementType.BIO, damageMultiplier: 1.1, isBuff: false, description: 'Corrodes metal.', cooldown: 0 },
  'root': { id: 'root', name: 'Root Grapple', type: ElementType.BIO, damageMultiplier: 1.2, isBuff: false, description: 'Entangles enemy.', cooldown: 2 },
  'spore': { id: 'spore', name: 'Corrosive Cloud', type: ElementType.BIO, damageMultiplier: 1.4, isBuff: false, description: 'Area denial acid.', cooldown: 3 },
  'regen': { id: 'regen', name: 'Bio-Synthesis', type: ElementType.BIO, damageMultiplier: 0, isBuff: true, statTarget: StatType.HEALTH, buffAmount: 60, description: 'Rapid organic healing.', cooldown: 4 },
  'thorn': { id: 'thorn', name: 'Needle Barrage', type: ElementType.BIO, damageMultiplier: 1.5, isBuff: false, description: 'Fires organic spikes.', cooldown: 3 },
  'swarm': { id: 'swarm', name: 'Nanite Swarm', type: ElementType.BIO, damageMultiplier: 1.8, isBuff: false, description: 'Consumes enemy matter.', cooldown: 4 },
  'bloom': { id: 'bloom', name: 'Toxic Bloom', type: ElementType.BIO, damageMultiplier: 2.1, isBuff: false, description: 'Explosive plant growth.', cooldown: 5 },
  'leech': { id: 'leech', name: 'Life Leech', type: ElementType.BIO, damageMultiplier: 1.2, isBuff: false, description: 'Steals energy.', cooldown: 2 },
};

// --- TRIBES ---
export const GUILDS: Guild[] = [
  { id: 'iron-march', name: 'Iron March', description: 'Industrial juggernauts focused on heavy defense and kinetic power.', perk: '+15% Max Health', color: 'text-slate-400', icon: 'Shield' },
  { id: 'aether-circuit', name: 'Aether Circuit', description: 'Cybernetic speedsters harnessing pure voltaic energy.', perk: '+15% Speed', color: 'text-cyan-400', icon: 'Zap' },
  { id: 'pyro-forge', name: 'Pyro Forge', description: 'Welders of destruction using unstable thermal cores.', perk: '+15% Attack', color: 'text-amber-600', icon: 'Flame' },
  { id: 'cryo-guard', name: 'Cryo Guard', description: 'Keepers of the frozen archives, masters of stasis.', perk: '+20% Shield Regen', color: 'text-blue-300', icon: 'Snowflake' },
  { id: 'verdant-steel', name: 'Verdant Steel', description: 'Bio-mechanical hybrids that self-repair and adapt.', perk: 'Regenerate 5% HP per turn', color: 'text-emerald-500', icon: 'Leaf' },
];

// --- EPIC NAME GENERATION ---
const LEGENDARY_NAMES = ['Aethelgard', 'Voltax', 'Ignis', 'Cryon', 'Xenon', 'Titanus', 'Omegus', 'Zeke', 'Valkyrie', 'Ragnarok', 'Kronos', 'Atlas', 'Hyperion', 'Helios'];
const LEGENDARY_TITLES = ['The World Burner', 'The Star Eater', 'Lord of the Void', 'The Unbroken', 'Architect of Ruin', 'The Silent King', 'Keeper of Time', 'The Stormbringer', 'The Iron Sovereign', 'Queen of Blades'];

const RARE_ADJECTIVES = ['Vengeful', 'Gilded', 'Ancient', 'Savage', 'Divine', 'Cursed', 'Radiant', 'Shadow', 'Crimson', 'Azure', 'Ethereal', 'Hallowed'];
const RARE_NOUNS = ['Vindicator', 'Reaper', 'Arbiter', 'Paladin', 'Specter', 'Warlord', 'Oracle', 'Sentinel', 'Guardian', 'Destroyer', 'Leviathan'];

const COMMON_PREFIXES = ['Scrap', 'Gear', 'Cog', 'Steam', 'Rust', 'Bolt', 'Wire', 'Junk', 'Flux', 'Core'];
const COMMON_SUFFIXES = ['Walker', 'Bot', 'Drone', 'Lifter', 'Hauler', 'Strider', 'Mender', 'Guard', 'Loader', 'Rig'];

const generateName = (tribeId: string | null, rarity: MachineRarity): string => {
    if (rarity === MachineRarity.LEGENDARY) {
        const name = LEGENDARY_NAMES[Math.floor(Math.random() * LEGENDARY_NAMES.length)];
        const title = LEGENDARY_TITLES[Math.floor(Math.random() * LEGENDARY_TITLES.length)];
        return `${name}, ${title}`;
    }

    if (rarity === MachineRarity.RARE) {
        const adj = RARE_ADJECTIVES[Math.floor(Math.random() * RARE_ADJECTIVES.length)];
        const noun = RARE_NOUNS[Math.floor(Math.random() * RARE_NOUNS.length)];
        return `${adj} ${noun}`;
    }

    // Common/Uncommon logic
    const prefix = COMMON_PREFIXES[Math.floor(Math.random() * COMMON_PREFIXES.length)];
    const suffix = COMMON_SUFFIXES[Math.floor(Math.random() * COMMON_SUFFIXES.length)];
    return `${prefix} ${suffix}`;
}

const getMovesForElement = (element: ElementType, rarity: MachineRarity): Move[] => {
    const allMoves = Object.values(MOVES_DB);
    const elementMoves = allMoves.filter(m => m.type === element);
    const normalMoves = allMoves.filter(m => m.type === ElementType.KINETIC);
    
    // Pool to pick from
    let pool = [...elementMoves, ...normalMoves];
    
    // Count based on rarity
    const moveCount = (rarity === MachineRarity.COMMON || rarity === MachineRarity.UNCOMMON) ? 6 : 8;
    
    // Shuffle and slice
    return pool.sort(() => 0.5 - Math.random()).slice(0, moveCount);
}

const createMinion = (id: string, tribeId: string | null, rarity: MachineRarity): Machine => {
    // Determine Element
    let element = ElementType.KINETIC;
    if (tribeId === 'iron-march') element = ElementType.KINETIC;
    else if (tribeId === 'aether-circuit') element = ElementType.VOLTAIC;
    else if (tribeId === 'pyro-forge') element = ElementType.THERMAL;
    else if (tribeId === 'cryo-guard') element = ElementType.CRYOGENIC;
    else if (tribeId === 'verdant-steel') element = ElementType.BIO;
    else {
        const elements = Object.values(ElementType);
        element = elements[Math.floor(Math.random() * elements.length)];
    }

    // Base Stats based on Rarity
    const baseStatMult = rarity === MachineRarity.LEGENDARY ? 2.5 : rarity === MachineRarity.RARE ? 1.8 : rarity === MachineRarity.UNCOMMON ? 1.3 : 1.0;
    
    const stats = {
        maxHealth: Math.floor((80 + Math.random() * 40) * baseStatMult),
        maxShield: Math.floor((30 + Math.random() * 30) * baseStatMult),
        shieldRegen: Math.floor((5 + Math.random() * 5) * baseStatMult),
        attack: Math.floor((15 + Math.random() * 10) * baseStatMult),
        speed: Math.floor((8 + Math.random() * 12) * baseStatMult),
    };

    const name = generateName(tribeId, rarity);
    const assignedMoves = getMovesForElement(element, rarity);

    const partsCost = {
        common: rarity === MachineRarity.COMMON ? 10 : rarity === MachineRarity.UNCOMMON ? 20 : rarity === MachineRarity.RARE ? 50 : 100,
        uncommon: rarity === MachineRarity.COMMON ? 0 : rarity === MachineRarity.UNCOMMON ? 10 : rarity === MachineRarity.RARE ? 25 : 50,
        rare: rarity === MachineRarity.LEGENDARY ? 20 : rarity === MachineRarity.RARE ? 5 : 0
    };

    return {
        id: id,
        name: name,
        description: `A ${rarity.toLowerCase()} class construct.`,
        tribeId,
        rarity,
        element,
        level: 1,
        xp: 0,
        crafting: {
            blueprintId: `bp-${id}`,
            parts: partsCost
        },
        baseStats: stats,
        stats: { ...stats, currentHealth: stats.maxHealth, currentShield: stats.maxShield },
        moves: assignedMoves,
        equippedMoves: assignedMoves.map(m => m.id), // Equip all assigned by default
        skillTree: [],
        imageSeed: `${id}-${element}-${rarity}`
    };
};

// Generator Function
const generateMinionDb = () => {
    const minions: Machine[] = [];
    let count = 0;

    // 1. Tribe Specific
    GUILDS.forEach(guild => {
        for (let i = 0; i < 3; i++) minions.push(createMinion(`mech-${count++}`, guild.id, MachineRarity.COMMON));
        for (let i = 0; i < 3; i++) minions.push(createMinion(`mech-${count++}`, guild.id, MachineRarity.UNCOMMON));
        for (let i = 0; i < 3; i++) minions.push(createMinion(`mech-${count++}`, guild.id, MachineRarity.RARE));
        minions.push(createMinion(`mech-${count++}`, guild.id, MachineRarity.LEGENDARY));
    });

    // 2. Neutral
    for (let i = 0; i < 15; i++) minions.push(createMinion(`mech-${count++}`, null, MachineRarity.COMMON));
    for (let i = 0; i < 15; i++) minions.push(createMinion(`mech-${count++}`, null, MachineRarity.UNCOMMON));
    for (let i = 0; i < 15; i++) minions.push(createMinion(`mech-${count++}`, null, MachineRarity.RARE));
    for (let i = 0; i < 5; i++) minions.push(createMinion(`mech-${count++}`, null, MachineRarity.LEGENDARY));

    return minions;
};

export const MINION_LIBRARY = generateMinionDb();

export const INITIAL_ROSTER: Machine[] = [
    MINION_LIBRARY.find(m => m.tribeId === null && m.rarity === MachineRarity.COMMON)!,
    MINION_LIBRARY.filter(m => m.tribeId === null && m.rarity === MachineRarity.COMMON)[1]!,
    MINION_LIBRARY.filter(m => m.tribeId === null && m.rarity === MachineRarity.COMMON)[2]!,
].map(m => ({...m, id: `${m.id}-starter`})); 

export const LEVEL_XP_CURVE = (level: number) => Math.floor(100 * Math.pow(1.5, level - 1));

export const STORY_CHAPTERS = [
  { id: 1, title: "The Vanishing", description: "Investigate Isaac's workshop for clues." },
  { id: 2, title: "Steel & Steam", description: "The Iron March is blocking the trade routes." },
  { id: 3, title: "Neon Shadows", description: "Unknown signals from the Aether Circuit district." },
];
