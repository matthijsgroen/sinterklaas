import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Ingredient = "flour" | "eggs" | "milk" | "gingerherbs";
export type GameState = {
  mansionKey: boolean;
  mansionAccess: boolean;
  poemPiet: "new" | "visited" | "q1" | "q2" | "q3" | "helped";
  sint: "new" | "visited" | "glasses" | "details" | "helped";
  glasses: "none" | "location" | "inventory" | "done";
  livingVisited: boolean;
  bakingPiet: "new" | "visited" | "helped";
  recipe: "none" | "desired" | "inventory" | "done";
  listCarl: "none" | "desired" | "inventory" | "done";
  gingerbreadButtonPie:
    | "none"
    | "desired"
    | "ingredients"
    | "inventory"
    | "done";
  neededIngriedients: Ingredient[];
  newIngredientsFound: boolean;
};

const initialState: GameState = {
  mansionKey: false,
  mansionAccess: false,
  poemPiet: "new",
  sint: "new",
  bakingPiet: "new",
  glasses: "none",
  recipe: "none",
  livingVisited: false,
  listCarl: "none",
  gingerbreadButtonPie: "none",
  neededIngriedients: ["eggs", "flour", "gingerherbs", "milk"],
  newIngredientsFound: false,
};

// const devState: GameState = {
//   mansionKey: true,
//   mansionAccess: true,
//   poemPiet: "helped",
//   sint: "details",
//   bakingPiet: "helped",
//   glasses: "done",
//   recipe: "done",
//   livingVisited: true,
//   listCarl: "done",
//   gingerbreadButtonPie: "inventory",
//   neededIngriedients: [],
//   newIngredientsFound: false,
// };

export const startScript = "titleScreen";

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
    updateRecipe: (state, action: PayloadAction<GameState["recipe"]>) => {
      state.recipe = action.payload;
    },
    updateListCarl: (state, action: PayloadAction<GameState["listCarl"]>) => {
      state.listCarl = action.payload;
    },
    updateGingerbreadButtonPie: (
      state,
      action: PayloadAction<GameState["gingerbreadButtonPie"]>
    ) => {
      state.gingerbreadButtonPie = action.payload;
    },
    findIngredient: (state, action: PayloadAction<Ingredient>) => {
      state.neededIngriedients = state.neededIngriedients.filter(
        ingriedient => ingriedient !== action.payload
      );
      state.newIngredientsFound = true;
    },
    deliverIngredients: state => {
      state.newIngredientsFound = false;
    },
    hasVisitedLiving: state => {
      state.livingVisited = true;
    },
  },
});
