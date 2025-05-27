import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const data = action.payload;
      state.isAuthenticated = true;
      state.user = data?.data;
      state.isLoading = false;
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
    },
    updateAvatar: (state, action) => {
      state.user.avatar = action.payload;
    }
  },
});

export const {
  setUser,
  clearUser,
  updateAvatar
} = authSlice.actions;
export default authSlice.reducer;