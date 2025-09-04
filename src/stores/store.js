import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/auth/authSlice';
import toastReducer from '../redux/toast/toastSlice';
import chatReducer from '../redux/chat/chatSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    chat: chatReducer
  },
});

export default store;