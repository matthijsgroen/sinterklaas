import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameState = {
  mansionKey: boolean;
  mansionAccess: boolean;
  poemPiet: "new" | "visited" | "q1" | "q2" | "q3" | "helped";
};

const initialState: GameState = {
  mansionKey: false,
  mansionAccess: false,
  poemPiet: "new",
};

// const devState: GameState = {
//   mansionKey: true,
//   mansionAccess: true,
//   poemPiet: "new",
// };

export const startScript = "intro";

export default createSlice({
  name: "game",
  initialState, //: devState,
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
