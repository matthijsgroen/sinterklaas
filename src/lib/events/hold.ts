import { HoldItem, Queue } from "./types";

export const handleHold = async (item: HoldItem, queue: Queue) => {
  queue.undoItem();
  await new Promise<void>(resolve => {
    queue.onItemAdded(() => resolve());
    queue.onQueueEnded(resolve);
  });
};

export const holdQ = (queue: Queue) => (): void =>
  queue.addItem({ type: "HOLD" } as HoldItem);
