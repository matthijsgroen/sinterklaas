import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DollSettings } from "src/content/dolls/types";

export type DollQueueItem<
  TDollName extends keyof DollSettings = keyof DollSettings
> = {
  doll: TDollName;
  settings: DollSettings[TDollName];
};

type LoadingState = {
  isLoading: boolean;
  imageLoading: boolean;
  dollPreloading: DollQueueItem[];
};

export default createSlice({
  name: "loading",
  initialState: {
    isLoading: false,
    imageLoading: false,
    dollPreloading: [],
  } as LoadingState,
  reducers: {
    loading: state => {
      state.isLoading = true;
      state.imageLoading = true;
    },
    loadingDone: state => {
      state.isLoading = false;
    },
    imageLoadingDone: state => {
      state.imageLoading = false;
    },
    preloadDolls: (state, action: PayloadAction<DollQueueItem[]>) => {
      state.dollPreloading = action.payload;
    },
  },
});
