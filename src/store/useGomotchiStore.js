import { create } from 'zustand';

// Decay constants (points per hour)
const DECAY_RATES = {
  hunger: 18,
  happiness: 12,
  energy: 15,
  hygiene: 20,
};

export const useGomotchiStore = create((set, get) => ({
  unitName: null,
  age: 0,
  level: 1,
  lifeStage: 'Bebek',
  experience: 0,
  maxExperience: 100,
  gold: 500,
  diamonds: 10,
  day: 1,
  lastWashDay: 0,
  currentRoom: 'living',
  lastUpdate: Date.now(),
  onboardingComplete: false,
  settings: {
    soundEnabled: true,
    vibrationEnabled: true,
    notificationsEnabled: true,
  },

  stats: {
    hunger: 100,
    happiness: 100,
    energy: 100,
    hygiene: 100,
    health: 100,
  },

  // Calculate decay based on time passed
  calculateDecay: () => {
    const now = Date.now();
    const elapsedHours = (now - get().lastUpdate) / (1000 * 60 * 60);

    if (elapsedHours <= 0) return;

    set((state) => {
      const newStats = { ...state.stats };
      newStats.hunger = Math.max(0, newStats.hunger - (DECAY_RATES.hunger * elapsedHours));
      newStats.happiness = Math.max(0, newStats.happiness - (DECAY_RATES.happiness * elapsedHours));
      newStats.energy = Math.max(0, newStats.energy - (DECAY_RATES.energy * elapsedHours));
      newStats.hygiene = Math.max(0, newStats.hygiene - (DECAY_RATES.hygiene * elapsedHours));

      return {
        stats: newStats,
        lastUpdate: now,
      };
    });
  },

  setRoom: (room) => {
    get().calculateDecay();
    set({ currentRoom: room });
  },

  addGold: (amount) => set((state) => {
    const newGold = state.gold + amount;
    const newXp = state.experience + Math.floor(amount / 2);
    // Gold additions don't trigger level check here usually, but we keep it safe
    return { gold: newGold, experience: newXp };
  }),

  addDiamonds: (amount) => set((state) => ({ diamonds: state.diamonds + amount })),

  wash: () => set((state) => {
    if (state.lastWashDay >= state.day) return state; // Already washed today
    const newStats = { ...state.stats, hygiene: 100 };
    return {
      stats: newStats,
      lastWashDay: state.day,
      experience: state.experience + 15, // Multiplied XP for mini-game effort
    };
  }),

  feed: (foodItem) => set((state) => {
    if (state.gold < foodItem.price) return state;

    const newHunger = Math.min(100, state.stats.hunger + foodItem.hungerValue);
    const newHapp = Math.min(100, state.stats.happiness + (foodItem.happValue || 0));
    let newXp = state.experience + 10;

    let newLevel = state.level;
    let newMaxXp = state.maxExperience;
    let newLifeStage = state.lifeStage;

    if (newXp >= newMaxXp) {
      newLevel++;
      newXp = newXp - newMaxXp;
      newMaxXp = Math.floor(newMaxXp * 1.5);

      // Update life stage based on level
      if (newLevel >= 21) newLifeStage = 'Student';
      else if (newLevel >= 10) newLifeStage = 'Kid';
      else if (newLevel >= 4) newLifeStage = 'Toddler';
    }

    return {
      stats: { ...state.stats, hunger: newHunger, happiness: newHapp },
      gold: state.gold - foodItem.price,
      experience: newXp,
      level: newLevel,
      maxExperience: newMaxXp,
      lifeStage: newLifeStage,
    };
  }),

  sleep: () => set((state) => ({
    day: state.day + 1,
    stats: { ...state.stats, energy: 100, hunger: Math.max(0, state.stats.hunger - 20) },
  })),

  gainXP: (amount) => set((state) => {
    let newXp = state.experience + amount;
    let newLevel = state.level;
    let newMaxXp = state.maxExperience;
    let newLifeStage = state.lifeStage;

    while (newXp >= newMaxXp) {
      newLevel++;
      newXp = newXp - newMaxXp;
      newMaxXp = Math.floor(newMaxXp * 1.5);

      if (newLevel >= 21) newLifeStage = 'Student';
      else if (newLevel >= 10) newLifeStage = 'Kid';
      else if (newLevel >= 4) newLifeStage = 'Toddler';
    }

    return {
      experience: newXp,
      level: newLevel,
      maxExperience: newMaxXp,
      lifeStage: newLifeStage,
    };
  }),

  completeOnboarding: (name, age) => set({
    unitName: name,
    age: parseInt(age),
    onboardingComplete: true,
    day: 1,
    lastWashDay: 0,
    lastUpdate: Date.now()
  }),


  updateUserData: (data) => set((state) => ({ ...state, ...data })),

  toggleSetting: (key) => set((state) => ({
    settings: { ...state.settings, [key]: !state.settings[key] }
  })),
}));


