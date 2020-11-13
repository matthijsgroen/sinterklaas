import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameState = {
  mansionKey: boolean;
  mansionAccess: boolean;
  poemPiet: "new" | "visited" | "helped";
};

const initialState: GameState = {
  mansionKey: false,
  mansionAccess: false,
  poemPiet: "new",
};

const devState: GameState = {
  mansionKey: true,
  mansionAccess: true,
  poemPiet: "new",
};

export const startScript = "hall";

export default createSlice({
  name: "game",
  initialState: devState,
  reducers: {
    getKey: state => {
      state.mansionKey = true;
    },
    hasMansionAccess: state => {
      state.mansionAccess = true;
    },
    updatePoemPiet: (state, action: PayloadAction<GameState["poemPiet"]>) => {
      state.poemPiet = action.payload;
    },
  },
});
