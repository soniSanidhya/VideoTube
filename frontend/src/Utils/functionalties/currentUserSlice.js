import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: {},
};

export const currentUserSlice = createSlice({
  name: "cuurentUser",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});
export const { setCurrentUser } = currentUserSlice.actions;

export default currentUserSlice.reducer;
