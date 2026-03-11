import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OrderStatus = 'NEW' | 'PREPARING' | 'READY';

export interface Order {
  id: string;
  customerName?: string;
  items?: string[];
  status: OrderStatus;
  createdAt?: string;
}

interface OrdersState {
  orders: Order[];
  restaurantOpen: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  restaurantOpen: true,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload;
    },
    addNewOrder(state, action: PayloadAction<Order>) {
      state.orders = [action.payload, ...state.orders];
    },
    moveOrder(state, action: PayloadAction<{ id: string; status: OrderStatus }>) {
      const { id, status } = action.payload;
      const order = state.orders.find((o) => String(o.id) === String(id));
      if (order) {
        order.status = status;
      }
    },
    toggleRestaurant(state) {
      state.restaurantOpen = !state.restaurantOpen;
      if (typeof window !== 'undefined') {
        localStorage.setItem('restaurantOpen', JSON.stringify(state.restaurantOpen));
      }
    },
    setRestaurantStatus(state, action: PayloadAction<boolean>) {
      state.restaurantOpen = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    }
  }
});

const SAMPLE_ITEMS = [
  'Margherita Pizza',
  'Truffle Fries',
  'Caesar Salad',
  'Paneer Tikka',
  'Pasta Alfredo',
  'Garlic Bread',
  'Iced Tea'
];

const SAMPLE_NAMES = [
  'Guest A',
  'Guest B',
  'Guest C',
  'Guest D',
  'Guest E'
];

export function generateNewOrder(): Order {
  const id = `${Date.now()}`;
  const customerName = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
  const itemCount = 1 + Math.floor(Math.random() * 3);
  const items = Array.from({ length: itemCount }, () => {
    return SAMPLE_ITEMS[Math.floor(Math.random() * SAMPLE_ITEMS.length)];
  });

  return {
    id,
    customerName,
    items,
    status: 'NEW',
    createdAt: new Date().toISOString()
  };
}

export const { setOrders, addNewOrder, moveOrder, toggleRestaurant, setRestaurantStatus, setError } = ordersSlice.actions;
export default ordersSlice.reducer;
