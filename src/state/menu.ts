import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type MenuState = {
  visible: boolean;
  selected: null | number;
  options: string[];
};

export default createSlice({
  name: "menu",
  initialState: {
    visible: false,
    selected: null,
    options: [],
  } as MenuState,
  reducers: {
    hide: state => ({
      ...state,
      visible: false,
      selected: null,
    }),
    show: {
      prepare: (options: string[]) => ({ payload: options }),
      reducer: (state, action: PayloadAction<string[]>) => ({
        ...state,
        options: action.payload,
        selected: null,
        visible: true,
      }),
    },
    choose: {
      prepare: (selected: number) => ({ payload: selected }),
      reducer: (state, action: PayloadAction<number>) => ({
        ...state,
        selected: action.payload,
      }),
    },
  },
});
