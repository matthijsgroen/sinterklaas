import { Action, Store } from "redux";
import { AudioType } from "./audio";

export interface QueueItem {
  type: string;
}

export type Subscriber = () => void;
export type Unsubscribe = () => void;

export type Queue = {
  addItem(item: QueueItem): void;
  insertItem(item: QueueItem): void;
  collectToNewQueue(): () => void;
  getNext(): QueueItem | undefined;
  getQueue(): QueueItem[];
  onItemAdded(s: Subscriber): Unsubscribe;
  onQueueEnded(s: Subscriber): Unsubscribe;
};

export type PauseItem = {
  type: "PAUSE";
  delay?: number;
};

export type HoldItem = {
  type: "HOLD";
};

export type JumpItem = {
  type: "JUMP";
  target: string;
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
    wait?: boolean;
  };
};
