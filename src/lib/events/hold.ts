import { HoldItem, Queue } from "./types";

export const handleHold = async (item: HoldItem, queue: Queue) => {
  queue.insertItem(item);
  await new Promise(resolve => {
    queue.onItemAdded(resolve);
    queue.onQueueEnded(resolve);
  });
};

export const holdQ = (queue: Queue) => (): void =>
  queue.addItem({ type: "HOLD" } as HoldItem);
