import { create } from 'zustand';

export const useGomotchiStore = create((set) => ({
  unitName: "UNIT-7 ZEPHYR",
  level: 1,
  experience: 0,
  maxExperience: 100,
  gold: 500,

  // İhtiyaçlar (0-100 arası)
  stats: {
    hunger: 50,
    happiness: 50,
    energy: 100,
    hygiene: 100,
    health: 100,
  },

  // Eylemler
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
    const newHapp = Math.min(100, state.stats.happiness + 20);
    const newHunger = Math.max(0, state.stats.hunger - 10);
    const newEnergy = Math.max(0, state.stats.energy - 15);
    const newXp = state.experience + 15;

    let newLevel = state.level;
    let newMaxXp = state.maxExperience;
    let finalXp = newXp;

    if (finalXp >= newMaxXp) {
      newLevel++;
      finalXp = finalXp - newMaxXp;
      newMaxXp = Math.floor(newMaxXp * 1.5);
    }

    return {
      stats: { ...state.stats, happiness: newHapp, hunger: newHunger, energy: newEnergy },
      experience: finalXp,
      level: newLevel,
      maxExperience: newMaxXp,
    };
  }),

  sleep: () => set((state) => ({
    stats: { ...state.stats, energy: 100 },
  })),
}));
