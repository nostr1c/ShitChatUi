import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  english: {},
};

const normalizeTranslations = (translations) => {
  const normalized = {};
  translations.forEach((tr) => {
    normalized[tr.name] = tr.value;
  }
  );
  return normalized;
}

const translationSlice = createSlice({
  name: "translation",
  initialState,
  reducers: {
    setTranslations: (state, action) => {
      state.english = normalizeTranslations(action.payload);
    },
  },
});

export const { setTranslations } = translationSlice.actions;
export default translationSlice.reducer;