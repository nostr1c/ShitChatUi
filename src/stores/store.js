import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice";
import chatReducer from "../redux/chat/chatSlice";
import translationReducer from "../redux/translations/translationSlice"
import connectionReducer from "../redux/connection/connectionSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    translations: translationReducer,
    connection: connectionReducer
  },
});

export default store;