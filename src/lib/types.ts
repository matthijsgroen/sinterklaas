import { Action, Store } from "redux";
import { AudioType } from "./audio";

export interface QueueItem {
  type: string;
}

export type Queue = {
  addItem(item: QueueItem): void;
  collectToNewQueue(): () => void;
  getNext(): QueueItem | undefined;
  getQueue(): QueueItem[];
};

export type PauseItem = {
  type: "PAUSE";
  delay?: number;
};

export type DispatchItem = {
  type: "DISPATCH";
  action: Action;
};

export type CallbackItem = {
  type: "CALLBACK";
  callback: (store: Store) => void | Promise<void>;
};

export type AudioItem = {
  type: "AUDIO";
  file: string;
  action: "play" | "stop";
  channel: AudioType;
  options: {
    volume?: number;
    fadeIn?: boolean;
    fadeOut?: boolean;
  };
};
