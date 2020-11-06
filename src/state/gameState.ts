import { createSlice } from "@reduxjs/toolkit";

export type GameState = {
  location?: "bridge" | "personell";
};

export default createSlice({
  name: "game",
  initialState: {} as GameState,
  reducers: {},
});
