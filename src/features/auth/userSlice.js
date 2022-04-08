import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    isLoggedIn: false,
    token: null,
    user: null,
  },
};

export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate: (state, action) => {
      localStorage.setItem("token", JSON.stringify(action.payload.data));

      state.value.isLoggedIn = true;
      state.value.token = action.payload.data.token;
      state.value.user = action.payload.data.user;
    },
    updateUser: (state, action) => {
      state.value.user = action.payload.data;
    },
    disembark: (state) => {
      localStorage.removeItem("token");
      state.value = initialState.value;
    },
  },
});

const userReducer = userSlice.reducer;
export const { authenticate, updateUser, disembark } = userSlice.actions;

export default userReducer;
