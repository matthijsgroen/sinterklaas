import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameState = {
  mansionKey: boolean;
  mansionAccess: boolean;
  poemPiet: "new" | "visited" | "q1" | "q2" | "q3" | "helped";
  sint: "new" | "visited" | "glasses" | "details" | "helped";
  glasses: "none" | "location" | "inventory" | "done";
  livingVisited: boolean;
  bakingPiet: "new" | "visited" | "helped";
};

const initialState: GameState = {
  mansionKey: false,
  mansionAccess: false,
  poemPiet: "new",
  sint: "new",
  bakingPiet: "new",
  glasses: "none",
  livingVisited: false,
};

// const devState: GameState = {
//   mansionKey: true,
//   mansionAccess: true,
//   poemPiet: "new",
//   sint: "new",
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
    updateSint: (state, action: PayloadAction<GameState["sint"]>) => {
      state.sint = action.payload;
    },
    updateBakingPiet: (
      state,
      action: PayloadAction<GameState["bakingPiet"]>
    ) => {
      state.bakingPiet = action.payload;
    },
    updateGlasses: (state, action: PayloadAction<GameState["glasses"]>) => {
      state.glasses = action.payload;
    },
    hasVisitedLiving: state => {
      state.livingVisited = true;
    },
  },
});
