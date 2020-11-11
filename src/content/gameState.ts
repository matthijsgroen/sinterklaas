import { createSlice } from "@reduxjs/toolkit";

export type GameState = {
  mansionKey: boolean;
  mansionAccess: boolean;
};

export default createSlice({
  name: "game",
  initialState: { mansionKey: false, mansionAccess: false } as GameState,
  reducers: {
    getKey: state => {
      state.mansionKey = true;
    },
    hasMansionAccess: state => {
      state.mansionAccess = true;
    },
  },
});
