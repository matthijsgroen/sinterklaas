import { pause } from "../scene";
import { PauseItem, Queue } from "./types";

export const pauseQ = (queue: Queue) => (delay?: number): void =>
  queue.addItem({ type: "PAUSE", delay } as PauseItem);

export const handlePause = async (queueItem: PauseItem) => {
  await pause(queueItem.delay);
};
