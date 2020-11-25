import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Button } from "src/components/generic/ScreenButtons";

export type ButtonState = {
  selected: string | null;
  buttons: { [key: string]: Button };
};

export default createSlice({
  name: "button",
  initialState: {
    selected: null,
    buttons: {},
  } as ButtonState,
  reducers: {
    deselect: state => {
      state.selected = null;
    },
    select: (state, action: PayloadAction<string>) => {
      state.selected = action.payload;
    },
    add: (state, action: PayloadAction<Button>) => {
      state.buttons[action.payload.id] = action.payload;
    },
    remove: (state, action: PayloadAction<string>) => {
      delete state.buttons[action.payload];
    },
    show: (state, action: PayloadAction<string>) => {
      state.buttons[action.payload].visible = true;
    },
    hide: (state, action: PayloadAction<string>) => {
      state.buttons[action.payload].visible = false;
    },
    hideAll: state => {
      Object.keys(state.buttons).forEach(buttonId => {
        state.buttons[buttonId].visible = false;
      });
    },
    reset: state => {
      state.buttons = {};
      state.selected = null;
    },
  },
});
