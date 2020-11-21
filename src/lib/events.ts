import { audioQ, handleAudio, preloadAudio } from "./events/audio";
import { Action, Store, createStore, AnyAction } from "redux";
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
import loader, { DollQueueItem } from "src/state/loader";
import eventQueue from "./events/queue";
import { handlePause, pauseQ } from "./events/pause";
import { handleCallback, callbackQ } from "./events/callback";
import { handleHold, holdQ } from "./events/hold";
import { DollSettings } from "src/content/dolls/types";
import { RootState } from "src/state/store";

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

const isAddCharacterAction = (
  action: AnyAction | ReturnType<typeof characters.actions.add>
): action is ReturnType<typeof characters.actions.add> =>
  action.type === characters.actions.add.type;

const isDollUpdateAction = (
  action: AnyAction | ReturnType<typeof characters.actions.dollUpdate>
): action is ReturnType<typeof characters.actions.dollUpdate> =>
  action.type === characters.actions.dollUpdate.type;

const preloadAssets = async (script: Script, store: Store) => {
  const queue = eventQueue();
  script(queue);

  const items = ([] as QueueItem[]).concat(queue.getQueue());
  const queueItems = flattenQueue(items, queue);
  const hasItem = (item: DollQueueItem, list: DollQueueItem[]): boolean =>
    !!list.find(
      listItem =>
        item.doll === listItem.doll &&
        JSON.stringify(item.settings) === JSON.stringify(listItem.settings)
    );

  const dollMapping: { [key: string]: keyof DollSettings } = {};

  const dollSettings = queueItems.reduce((result, queueItem) => {
    if (queueItem.type === "DISPATCH") {
      const action = (queueItem as DispatchItem).action;
      if (isAddCharacterAction(action)) {
        dollMapping[action.payload.id] = action.payload.doll;
        const newItem: DollQueueItem = {
          doll: action.payload.doll,
          settings: action.payload.settings.dollSettings,
        };
        return hasItem(newItem, result) ? result : result.concat(newItem);
      }
      if (isDollUpdateAction(action)) {
        const newItem: DollQueueItem = {
          doll: dollMapping[action.payload.id],
          settings: action.payload.update,
        };
        return hasItem(newItem, result) ? result : result.concat(newItem);
      }
    }
    return result;
  }, [] as DollQueueItem[]);
  store.dispatch(loader.actions.preloadDolls(dollSettings));
  let resolver: () => void;

  const loadingPromise = new Promise<void>(res => {
    resolver = res;
  });

  store.subscribe(() => {
    const s: RootState = store.getState();
    if (!s.loader.imageLoading) {
      resolver();
    }
  });

  const audioItems = queueItems.reduce((loadingQueue, queueItem) => {
    if (queueItem.type === "AUDIO") {
      return loadingQueue.concat(preloadAudio(queueItem as AudioItem));
    }
    return loadingQueue;
  }, [] as Promise<void>[]);

  await Promise.all([...audioItems, loadingPromise]);
};

export const playEvent = async (
  store: Store,
  scripts: Scripts,
  active: string
): Promise<void> => {
  store.dispatch(loader.actions.loading());
  await preloadAssets(scripts[active], store);
  store.dispatch(loader.actions.loadingDone());

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
