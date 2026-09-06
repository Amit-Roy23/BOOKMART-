import { create } from "zustand";

export interface WishlistItem {
  id: string;
  title: string;
  price: number;
  image: string;
  condition: "Good Condition" | "Like New" | "Acceptable";
  sellerName: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, "id" | "price"> & { id: string; price: number }) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: Omit<WishlistItem, "id" | "price"> & { id: string; price: number }) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      if (state.items.some((i) => i.id === item.id)) return state;
      return { items: [...state.items, item] };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  toggleItem: (item) => {
    const exists = get().items.some((i) => i.id === item.id);
    if (exists) {
      get().removeItem(item.id);
    } else {
      get().addItem(item);
    }
  },

  isInWishlist: (id) => get().items.some((i) => i.id === id),
}));
