import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItemCountState {
  count: number;
}

const initialState: CartItemCountState = {
  count: 0,
};

const cartItemCountSlice = createSlice({
  name: 'cartItemCount',
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      if (state.count > 0) state.count -= 1;
    },
    setCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    resetCount: (state) => {
      state.count = 0;
    },
    deleteCount: (state, action: PayloadAction<number>) => {
      state.count -= action.payload;
    }
  },
});

export const { increment, decrement, setCount, resetCount, deleteCount } = cartItemCountSlice.actions;

export default cartItemCountSlice.reducer;
