import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DollSettings } from "src/content/dolls/types";
import { Draft } from "immer";

export type Character<T extends keyof DollSettings> = {
  id: string;
  x: number;
  y: number;
  scale: number;
  flipped: boolean;
  visible: boolean;
  portrait: boolean;
  doll: T;
  dollSettings: Partial<DollSettings[T]>;
};

export type CharacterState = Record<string, Character<keyof DollSettings>>;

const defaultCharacterSettings: Omit<
  Character<never>,
  "doll" | "id" | "dollSettings"
> = {
  x: 0,
  y: 0,
  scale: 1.0,
  visible: true,
  flipped: false,
  portrait: false,
};

export type CharacterSetup<TDoll extends keyof DollSettings> = Partial<
  Omit<Character<TDoll>, "id" | "doll" | "dollSettings">
> &
  Pick<Character<TDoll>, "dollSettings">;

export default createSlice({
  name: "characters",
  initialState: {} as CharacterState,
  reducers: {
    add: {
      prepare: <TDoll extends keyof DollSettings>(
        id: string,
        doll: TDoll,
        settings: CharacterSetup<TDoll>
      ) => ({
        payload: { id, doll, settings },
      }),
      reducer: <TDoll extends keyof DollSettings>(
        state: Draft<CharacterState>,
        action: PayloadAction<{
          id: string;
          doll: TDoll;
          settings: CharacterSetup<TDoll>;
        }>
      ) => {
        state[action.payload.id] = {
          id: action.payload.id,
          doll: action.payload.doll,
          ...defaultCharacterSettings,
          ...action.payload.settings,
        };
      },
    },
    remove: {
      prepare: (id: string) => ({ payload: id }),
      reducer: (state, action: PayloadAction<string>) => {
        delete state[action.payload];
      },
    },
    update: {
      prepare: <TDoll extends keyof DollSettings>(
        id: string,
        update: Partial<Omit<Character<TDoll>, "id" | "doll">>
      ) => ({
        payload: { id, update },
      }),
      reducer: <TDoll extends keyof DollSettings>(
        state: Draft<CharacterState>,
        action: PayloadAction<{
          id: string;
          update: Partial<Omit<Character<TDoll>, "id" | "doll">>;
        }>
      ) => {
        state[action.payload.id] = {
          ...state[action.payload.id],
          ...action.payload.update,
        };
      },
    },
    dollUpdate: {
      prepare: <TDoll extends keyof DollSettings>(
        id: string,
        update: DollSettings[TDoll]
      ) => ({
        payload: { id, update },
      }),
      reducer: <TDoll extends keyof DollSettings>(
        state: Draft<CharacterState>,
        action: PayloadAction<{
          id: string;
          update: DollSettings[TDoll];
        }>
      ) => {
        const { id, update } = action.payload;
        state[id].visible = true;
        state[id].dollSettings = {
          ...state[id].dollSettings,
          ...update,
        };
      },
    },
    reset: () => ({}),
  },
});
