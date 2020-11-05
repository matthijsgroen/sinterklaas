import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DialogProps } from "../components/Dialog";

export type DialogState = {
  visible: boolean;
  name: null | string;
  contents: null | string;
  settings: Omit<DialogProps, "name" | "text">;
};

export default createSlice({
  name: "dialog",
  initialState: {
    visible: false,
    name: null,
    contents: null,
    settings: {},
  } as DialogState,
  reducers: {
    hide: (state) => ({ ...state, visible: false }),
    say: {
      prepare: (
        name: string | null,
        contents: string | null,
        settings?: DialogState["settings"]
      ) => ({
        payload: { name, contents, settings },
      }),
      reducer: (
        state,
        action: PayloadAction<{
          name: string | null;
          contents: string | null;
          settings?: DialogState["settings"];
        }>
      ) => ({
        ...state,
        visible: true,
        name: action.payload.name,
        contents: action.payload.contents,
        settings: { ...action.payload.settings },
      }),
    },
  },
});
