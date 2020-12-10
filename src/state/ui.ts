import { createSlice } from "@reduxjs/toolkit";

export enum Dialogs {
  None,
  Loading,
  Saving,
}

export type UIState = {
  dialogOpen: Dialogs;
};

export default createSlice({
  name: "ui",
  initialState: {
    dialogOpen: Dialogs.None,
  } as UIState,
  reducers: {
    loadGame: state => {
      state.dialogOpen = Dialogs.Loading;
    },
    closeDialog: state => {
      state.dialogOpen = Dialogs.None;
    },
  },
});
