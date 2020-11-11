import { combineReducers } from "redux";
import characters from "./characters";
import menu from "./menu";
import screen from "./screen";
import background from "./background";
import dialog from "./dialog";
import gameState from "../content/gameState";
import buttons from "./buttons";
import { configureStore } from "@reduxjs/toolkit";

const reducer = combineReducers({
  characters: characters.reducer,
  menu: menu.reducer,
  screen: screen.reducer,
  background: background.reducer,
  dialog: dialog.reducer,
  gameState: gameState.reducer,
  buttons: buttons.reducer,
});

export type RootState = ReturnType<typeof reducer>;
export const store = configureStore({ reducer });
