import { pause } from "./scene";
import { audioQ, handleAudio, preloadAudio } from "./events/audio";
import { Action, Store } from "redux";
import {
  AudioItem,
  CallbackItem,
  DispatchItem,
  PauseItem,
  Queue,
  QueueItem,
} from "./types";
import characters from "../state/characters";

const eventQueue = (): Queue => {
  const mainQueue: QueueItem[] = [];
  let activeQueue = mainQueue;

  return {
    addItem: (item: QueueItem) => {
      activeQueue.push(item);
    },
    collectToNewQueue: () => {
      const prevQueue = activeQueue;
      activeQueue = [];

      return () => {
        activeQueue.reverse().forEach((item) => prevQueue.unshift(item));
        activeQueue = prevQueue;
      };
    },
    getNext: () => mainQueue.shift(),
    getQueue: () => mainQueue,
  };
};

const playQueue = async (store: Store, queue: Queue) => {
  let event;
  while ((event = queue.getNext())) {
    switch (event.type) {
      case "DISPATCH":
        store.dispatch((event as DispatchItem).action);
        break;
      case "CALLBACK":
        await (event as CallbackItem).callback(store);
        break;
      case "AUDIO":
        await handleAudio(event as AudioItem);
        break;
      case "PAUSE":
        await handlePause(event as PauseItem);
        break;
      default:
        throw new Error(`Unsupported type: ${event.type}`);
    }
  }
};

const preloadAssets = async (queue: Queue) => {
  const items = queue.getQueue().reduce((loadingQueue, queueItem) => {
    if (queueItem.type === "AUDIO") {
      return loadingQueue.concat(preloadAudio(queueItem as AudioItem));
    }
    return loadingQueue;
  }, [] as Promise<void>[]);

  await Promise.all(items);
};

export const playEvent = async (
  store: Store,
  queueProducer: (q: Queue) => void
): Promise<void> => {
  const queue = eventQueue();
  queueProducer(queue);

  await preloadAssets(queue);

  // Do some preloading here...
  await playQueue(store, queue);
  store.dispatch(characters.actions.reset());
};

export const dispatchQ = (queue: Queue) => (action: Action): void =>
  queue.addItem({ type: "DISPATCH", action } as DispatchItem);

export const executionDelayQ = (queue: Queue) => (
  callback: (store: Store) => void | Promise<void>
): void => queue.addItem({ type: "CALLBACK", callback } as CallbackItem);

export const pauseQ = (queue: Queue) => (delay?: number): void =>
  queue.addItem({ type: "PAUSE", delay } as PauseItem);

const handlePause = async (queueItem: PauseItem) => {
  await pause(queueItem.delay);
};

export { audioQ };
