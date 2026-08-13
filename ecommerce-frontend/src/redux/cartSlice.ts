import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// 1. தயாரிப்பின் வடிவமைப்பு (Product Interface)
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

// 2. கார்ட்டில் இருக்கும் பொருளின் வடிவமைப்பு (Cart Item Interface)
interface CartItem {
  product: Product;
  quantity: number;
}

// 3. கார்ட்டின் ஆரம்ப நிலை (Initial State)
interface CartState {
  items: CartItem[];
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      state.totalPrice = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.product.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
      state.totalPrice = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
      state.totalPrice = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    }
  },
});

export const { addToCart, updateQuantity, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;