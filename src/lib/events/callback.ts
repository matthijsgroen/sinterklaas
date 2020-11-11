import { Store } from "redux";
import { RootState } from "src/state/store";
import { CallbackItem, Queue } from "./types";

export const handleCallback = (item: CallbackItem, store: Store) =>
  item.callback(store);

export const callbackQ = (queue: Queue) => (
  callback: (store: Store<RootState>) => void | Promise<void>
): void => queue.addItem({ type: "CALLBACK", callback } as CallbackItem);
