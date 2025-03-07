import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import toastReducer from '../features/toast/toastSlice';
import chatReducer from '../features/chat/chatSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    chat: chatReducer
  },
});

export default store;