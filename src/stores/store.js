import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import toastReducer from '../features/toast/toastSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
  },
});

export default store;