import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/auth/authSlice';
import chatReducer from '../redux/chat/chatSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer
  },
});

export default store;