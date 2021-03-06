import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ScreenState = {
  horizontalPunch: boolean;
  verticalPunch: boolean;
  fadeOut: number | boolean;
  color: string;
};

export default createSlice({
  name: "screen",
  initialState: {
    horizontalPunch: false,
    verticalPunch: false,
    fadeOut: true,
    color: "black",
  } as ScreenState,
  reducers: {
    punch: (state, action: PayloadAction<boolean>) => {
      state.horizontalPunch = action.payload;
      state.verticalPunch = !action.payload;
    },
    stopPunch: state => {
      state.horizontalPunch = false;
      state.verticalPunch = false;
    },
    fade: {
      prepare: (fadeOut: number | boolean, color = "black") => ({
        payload: { fadeOut, color },
      }),
      reducer: (
        state,
        action: PayloadAction<{ fadeOut: number | boolean; color: string }>
      ) => ({
        ...state,
        fadeOut: action.payload.fadeOut,
        ...(action.payload.fadeOut && { color: action.payload.color }),
      }),
    },
  },
});
