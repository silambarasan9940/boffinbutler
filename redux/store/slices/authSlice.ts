import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isSignedIn: boolean;
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('authToken') : null,
  isSignedIn: typeof window !== 'undefined' ? !!localStorage.getItem('authToken') : false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isSignedIn = true;
      // Save the token to localStorage
      localStorage.setItem('authToken', action.payload);
    },
    signOut: (state) => {
      state.token = null;
      state.isSignedIn = false;
      // Remove the token from localStorage
      localStorage.removeItem('authToken');
    },
  },
});

export const { signIn, signOut } = authSlice.actions;

export default authSlice.reducer;
