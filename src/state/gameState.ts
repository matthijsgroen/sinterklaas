import { createSlice } from "@reduxjs/toolkit";

export type GameState = {
  mansionKey: boolean;
};

export default createSlice({
  name: "game",
  initialState: { mansionKey: false } as GameState,
  reducers: {
    getKey: state => {
      state.mansionKey = true;
    },
  },
});
