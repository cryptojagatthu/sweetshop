import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  weight: string;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, weight: string) => void;
  updateQuantity: (id: string, weight: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existing = state.items.find((i) => i.id === item.id && i.weight === item.weight);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.id === item.id && i.weight === item.weight
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (id, weight) => set((state) => ({
        items: state.items.filter((i) => !(i.id === id && i.weight === weight)),
      })),
      updateQuantity: (id, weight, quantity) => set((state) => ({
        items: state.items.map((i) =>
          i.id === id && i.weight === weight
            ? { ...i, quantity: Math.max(1, quantity) }
            : i
        ),
      })),
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'haji-syeed-cart',
    }
  )
);
