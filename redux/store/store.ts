"use client";
import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';
import paymentReducer from './slices/paymentSlice';
import cartItemCountReducer from './slices/cartItemCountSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    // cart: cartReducer,
    payment: paymentReducer,
    cartItemCount:cartItemCountReducer
  },
});

// Export types for usage in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
