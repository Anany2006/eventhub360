import { createSlice } from '@reduxjs/toolkit';

// Safely look for tokens in localStorage if the user reloads their browser
const token = localStorage.getItem('token') || null;
const refreshToken = localStorage.getItem('refreshToken') || null;

const initialState = {
  user: token ? { isLoggedIn: true } : null, 
  token: token,
  refreshToken: refreshToken,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action called when a login or signup completes successfully
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = { isLoggedIn: true };
      state.error = null;
      
      // Keep user session persistent by sync saving to localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    // Action called when logging out or if a session drops out
    logoutSuccess: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.error = null;
      
      // Wipe browser storage cleaner
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    // Clear or capture global network error details
    setAuthError: (state, action) => {
      state.error = action.payload;
    }
  },
});

export const { loginSuccess, logoutSuccess, setAuthError } = authSlice.actions;
export default authSlice.reducer;