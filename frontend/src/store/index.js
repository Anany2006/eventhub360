import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// Combines all tracking reducers under a singular application state object
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;