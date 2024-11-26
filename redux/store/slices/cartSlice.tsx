import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}
interface CartState {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null; 
}

const initialState: CartState = {
  cartItems: [],
  loading: false,
  error: null,
};

// Create an async thunk for fetching cart items
export const fetchCartItems = createAsyncThunk<CartItem[]>('cart/fetchCartItems', async () => {
  return new Promise<CartItem[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { itemId: '1', name: 'Product 1', price: 50, quantity: 1 },
        { itemId: '2', name: 'Product 2', price: 30, quantity: 2 },
      ]);
    }, 1000);
  });
});

// Create a slice of the state
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add a new action for adding items to the cart
    addToCart(state, action: PayloadAction<CartItem>) {
      const existingItem = state.cartItems.find(item => item.itemId === action.payload.itemId);
      if (existingItem) {
        // If the item already exists, update its quantity
        existingItem.quantity += action.payload.quantity;
      } else {
        // Otherwise, add the new item to the cart
        state.cartItems.push(action.payload);
      }
    },
    addQuantity(state, action: PayloadAction<string>) {
      const item = state.cartItems.find(item => item.itemId === action.payload);
      if (item) {
        item.quantity += 1; 
      }
    },
    removeQuantity(state, action: PayloadAction<string>) {
      const item = state.cartItems.find(item => item.itemId === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1; 
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter(item => item.itemId !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null; 
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.cartItems = action.payload; 
        state.loading = false;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart items'; 
      });
  },
});

// Export actions and reducer
export const { addToCart, addQuantity, removeQuantity, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
