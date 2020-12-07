import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BackgroundProps } from "src/components/Background";
import { FrontLayerProps } from "src/components/Frontlayer";

export type BackgroundState = Partial<BackgroundProps> &
  Partial<FrontLayerProps> & { blur?: boolean };

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
