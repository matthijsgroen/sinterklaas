import { Action, Store } from "redux";
import { AudioType } from "../audio";

export interface QueueItem {
  type: string;
}

export type AddSubscriber = (api: {
  addItem: (item: QueueItem) => void;
}) => void;

export type Subscriber = () => void;
export type Unsubscribe = () => void;

export type Queue = {
  length: number;
  addItem(item: QueueItem): void;
  undoItem(): void;
  collectToNewQueue(): () => QueueItem[];
  getNext(): QueueItem | undefined;
  getQueue(): QueueItem[];
  closeQueue(): void;
  onItemAdded(s: AddSubscriber): Unsubscribe;
  onQueueEnded(s: Subscriber): Unsubscribe;
};

export type PauseItem = {
  type: "PAUSE";
  delay?: number;
};

export type HoldItem = {
  type: "HOLD";
};

export type LoadGameItem = {
  type: "LOAD_GAME";
  gameSlotId: string;
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
