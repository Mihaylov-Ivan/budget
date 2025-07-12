import { create } from "zustand";

interface AmountsState {
  availableMoney: number;
  essentialsTotal: number;
  setAvailableMoney: (amount: number) => void;
  setEssentialsTotal: (amount: number) => void;
}

export const useAmounts = create<AmountsState>((set: any) => ({
  availableMoney: 0,
  essentialsTotal: 0,
  setAvailableMoney: (amount: number) => set({ availableMoney: amount }),
  setEssentialsTotal: (amount: number) => set({ essentialsTotal: amount }),
}));
