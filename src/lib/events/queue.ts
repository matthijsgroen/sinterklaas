import { Queue, QueueItem, Subscriber } from "./types";

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
    closeQueue: () => {
      while (mainQueue.shift()) {
        // clearing queue
      }
      activeQueue = mainQueue;
      endSubscribers.forEach(e => e());
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

export default eventQueue;
