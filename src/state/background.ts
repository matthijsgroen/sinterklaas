import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BackgroundProps } from "src/components/Background";

export type BackgroundState = Partial<BackgroundProps>;

export default createSlice({
  name: "dialog",
  initialState: {} as BackgroundState,
  reducers: {
    update: {
      prepare: (props: BackgroundState) => ({ payload: props }),
      reducer: (state, action: PayloadAction<BackgroundState>) => ({
        ...state,
        ...action.payload,
      }),
    },
  },
});
