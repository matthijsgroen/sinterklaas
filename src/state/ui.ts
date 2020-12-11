import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum Dialogs {
  None,
  Loading,
  Saving,
}

export type UIState = {
  dialogOpen: Dialogs;
  dialogResult: string | null;
};

export default createSlice({
  name: "ui",
  initialState: {
    dialogOpen: Dialogs.None,
    dialogResult: null,
  } as UIState,
  reducers: {
    loadGame: state => {
      state.dialogOpen = Dialogs.Loading;
      state.dialogResult = null;
    },
    closeDialog: state => {
      state.dialogOpen = Dialogs.None;
    },
    dialogResult: (state, action: PayloadAction<string | null>) => {
      state.dialogOpen = Dialogs.None;
      state.dialogResult = action.payload;
    },
  },
});
