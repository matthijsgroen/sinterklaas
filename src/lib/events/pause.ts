import { PauseItem, Queue } from "./types";
import styles from "./pause.module.scss";

export const delay = (amount: number): Promise<void> =>
  new Promise<void>(resolve => setTimeout(resolve, amount));

let onKeyPress: (() => void) | null = null;

document.addEventListener("keypress", () => {
  if (onKeyPress) {
    const item = onKeyPress;
    onKeyPress = null;
    item();
  }
});

document.addEventListener("click", () => {
  if (onKeyPress) {
    const item = onKeyPress;
    onKeyPress = null;
    item();
  }
});

document.addEventListener("touchend", () => {
  // this enables the normal click
});

const pause = (autoContinue: number | null = null): Promise<void> =>
  new Promise(resolve => {
    document.body.classList.add(styles.promoteClick);
    const timeout: ReturnType<typeof setTimeout> | undefined =
      autoContinue !== null ? setTimeout(resolve, autoContinue) : undefined;

    onKeyPress = () => {
      timeout !== undefined && clearTimeout(timeout);
      resolve();
    };
  }).then(() => {
    document.body.classList.remove(styles.promoteClick);
  });

export const pauseQ = (queue: Queue) => (delay?: number): void =>
  queue.addItem({ type: "PAUSE", delay } as PauseItem);

export const handlePause = async (queueItem: PauseItem) => {
  await pause(queueItem.delay);
};
