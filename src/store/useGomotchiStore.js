import { create } from 'zustand';

export const useGomotchiStore = create((set) => ({
  unitName: "UNIT-7 ZEPHYR",
  level: 1,
  experience: 0,
  maxExperience: 100,
  gold: 500,
  currentRoom: 'living', // 'living', 'bedroom', 'bathroom'

  // İhtiyaçlar (0-100 arası)
  stats: {
    hunger: 50,
    happiness: 50,
    energy: 100,
    hygiene: 100,
    health: 100,
  },

  // Eylemler
  setRoom: (room) => set({ currentRoom: room }),

  addGold: (amount) => set((state) => ({ 
    gold: state.gold + amount,
    experience: state.experience + Math.floor(amount / 2)
  })),

  wash: () => set((state) => ({
    stats: { ...state.stats, hygiene: 100 },
    experience: state.experience + 5
  })),

  feed: (foodItem) => set((state) => {
    if (state.gold < foodItem.price) return state;

    const newHunger = Math.min(100, state.stats.hunger + foodItem.hungerValue);
    const newHapp = Math.min(100, state.stats.happiness + (foodItem.happValue || 0));
    const newXp = state.experience + 10;

    let newLevel = state.level;
    let newMaxXp = state.maxExperience;
    let finalXp = newXp;

    if (finalXp >= newMaxXp) {
      newLevel++;
      finalXp = finalXp - newMaxXp;
      newMaxXp = Math.floor(newMaxXp * 1.5);
    }

    return {
      stats: { ...state.stats, hunger: newHunger, happiness: newHapp },
      gold: state.gold - foodItem.price,
      experience: finalXp,
      level: newLevel,
      maxExperience: newMaxXp,
    };
  }),

  play: () => set((state) => {
    // Basic play still exists but we'll use addGold for the mini-game
    const newHapp = Math.min(100, state.stats.happiness + 20);
    const newHunger = Math.max(0, state.stats.hunger - 10);
    const newEnergy = Math.max(0, state.stats.energy - 15);
    return {
      stats: { ...state.stats, happiness: newHapp, hunger: newHunger, energy: newEnergy },
    };
  }),

  sleep: () => set((state) => ({
    stats: { ...state.stats, energy: 100, hunger: Math.max(0, state.stats.hunger - 20) },
  })),
}));

