import { pause } from "./scene";
import { audioQ, handleAudio, preloadAudio } from "./events/audio";
import { Action, Store, createStore } from "redux";
import {
  AudioItem,
  CallbackItem,
  DispatchItem,
  HoldItem,
  JumpItem,
  PauseItem,
  Queue,
  QueueItem,
  Subscriber,
} from "./types";
import characters from "src/state/characters";
import { RootState } from "src/state/store";
import buttons from "src/state/buttons";
import screen from "src/state/screen";

const eventQueue = (): Queue => {
  const mainQueue: QueueItem[] = [];
  let activeQueue = mainQueue;

  let addSubscribers: Subscriber[] = [];
  let endSubscribers: Subscriber[] = [];

  return {
    addItem: (item: QueueItem) => {
      activeQueue.push(item);
      if (mainQueue === activeQueue) {
        addSubscribers.forEach(e => e());
      }
    },
    insertItem: (item: QueueItem) => {
      activeQueue.unshift(item);
      if (mainQueue === activeQueue) {
        addSubscribers.forEach(e => e());
      }
    },
    collectToNewQueue: () => {
      const prevQueue = activeQueue;
      activeQueue = [];

      return () => {
        const result = ([] as QueueItem[]).concat(activeQueue);
        activeQueue.reverse().forEach(item => prevQueue.unshift(item));
        activeQueue = prevQueue;
        if (prevQueue === mainQueue) {
          addSubscribers.forEach(e => e());
        }
        return result;
      };
    },
    getNext: () => {
      const next = mainQueue.shift();
      if (next === undefined) {
        endSubscribers.forEach(e => e());
      }
      return next;
    },
    getQueue: () => mainQueue,
    onItemAdded: (sub: Subscriber) => {
      addSubscribers = addSubscribers.concat(sub);
      return () => {
        addSubscribers = addSubscribers.filter(item => item !== sub);
      };
    },
    onQueueEnded: (sub: Subscriber) => {
      endSubscribers = endSubscribers.concat(sub);
      return () => {
        endSubscribers = endSubscribers.filter(item => item !== sub);
      };
    },
  };
};

const playQueue = async (
  store: Store,
  queue: Queue
): Promise<string | void> => {
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
      case "JUMP":
        return (event as JumpItem).target;
      case "HOLD":
        queue.insertItem(event);
        await new Promise(resolve => {
          queue.onItemAdded(resolve);
          queue.onQueueEnded(resolve);
        });
        break;
      default:
        throw new Error(`Unsupported type: ${event.type}`);
    }
  }
};

type Script = (queue: Queue) => void;

interface Scripts {
  [key: string]: Script;
}

const FAKE_STATE = {
  fakeStore: true,
  message:
    "When you get an error on this, make sure you use 'isPreloading'." +
    " This mechanic is to allow discovery of all code paths through the event," +
    " so that content preloading can be optimised.",
};

const fakeStore = createStore(() => FAKE_STATE);

export const isPreloading = (getState: () => unknown) =>
  getState() === FAKE_STATE;

const flattenQueue = (queueItems: QueueItem[], queue: Queue): QueueItem[] =>
  queueItems.reduce<QueueItem[]>((acc, item) => {
    if (item.type === "CALLBACK") {
      const commit = queue.collectToNewQueue();
      (item as CallbackItem).callback(fakeStore);
      const items = commit();
      return acc.concat(flattenQueue(items, queue));
    }
    return acc.concat(item);
  }, []);

const preloadAssets = async (script: Script) => {
  const queue = eventQueue();
  script(queue);

  const queueItems = flattenQueue(queue.getQueue(), queue);

  const audioItems = queueItems.reduce((loadingQueue, queueItem) => {
    if (queueItem.type === "AUDIO") {
      return loadingQueue.concat(preloadAudio(queueItem as AudioItem));
    }
    return loadingQueue;
  }, [] as Promise<void>[]);

  await Promise.all(audioItems);
};

export const playEvent = async (
  store: Store,
  scripts: Scripts,
  active: string
): Promise<void> => {
  store.dispatch(screen.actions.loading());
  await preloadAssets(scripts[active]);
  store.dispatch(screen.actions.loadingDone());

  const queue = eventQueue();
  scripts[active](queue);
  const nextScript = await playQueue(store, queue);
  store.dispatch(characters.actions.reset());
  store.dispatch(buttons.actions.reset());

  if (nextScript) {
    return playEvent(store, scripts, nextScript);
  }
};

export const dispatchQ = (queue: Queue) => (action: Action): void =>
  queue.addItem({ type: "DISPATCH", action } as DispatchItem);

export const jumpQ = (queue: Queue) => (target: string): void =>
  queue.addItem({ type: "JUMP", target } as JumpItem);

export const executionDelayQ = (queue: Queue) => (
  callback: (store: Store<RootState>) => void | Promise<void>
): void => queue.addItem({ type: "CALLBACK", callback } as CallbackItem);

export const pauseQ = (queue: Queue) => (delay?: number): void =>
  queue.addItem({ type: "PAUSE", delay } as PauseItem);

export const holdQ = (queue: Queue) => (): void =>
  queue.addItem({ type: "HOLD" } as HoldItem);

const handlePause = async (queueItem: PauseItem) => {
  await pause(queueItem.delay);
};

export { audioQ };
