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
} from "./events/types";
import characters from "src/state/characters";
import buttons from "src/state/buttons";
import screen from "src/state/screen";
import eventQueue from "./events/queue";
import { handlePause, pauseQ } from "./events/pause";
import { handleCallback, callbackQ } from "./events/callback";
import { handleHold, holdQ } from "./events/hold";

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
        await handleCallback(event as CallbackItem, store);
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
        await handleHold(event as HoldItem, queue);
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

  const items = ([] as QueueItem[]).concat(queue.getQueue());
  const queueItems = flattenQueue(items, queue);

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

export { audioQ, pauseQ, callbackQ, holdQ };
