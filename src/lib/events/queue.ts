import { AddSubscriber, Queue, QueueItem, Subscriber } from "./types";

const eventQueue = (): Queue => {
  const mainQueue: QueueItem[] = [];
  let activeQueue = mainQueue;
  let position = 0;

  let addSubscribers: AddSubscriber[] = [];
  let endSubscribers: Subscriber[] = [];

  return {
    get length() {
      return mainQueue.length;
    },
    addItem: (item: QueueItem) => {
      activeQueue.push(item);
      if (mainQueue === activeQueue) {
        addSubscribers.forEach(e =>
          e({
            addItem: (subscriberItem: QueueItem) => {
              activeQueue.push(subscriberItem);
            },
          })
        );
      }
    },
    undoItem: () => {
      position--;
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
      let added = 0;

      return () => {
        const result = ([] as QueueItem[]).concat(activeQueue);
        added = result.length;
        if (prevQueue === mainQueue) {
          mainQueue.splice(position, 0, ...result);
        } else {
          activeQueue.reverse().forEach(item => prevQueue.unshift(item));
        }

        activeQueue = prevQueue;
        if (prevQueue === mainQueue) {
          addSubscribers.forEach(e =>
            e({
              addItem: (item: QueueItem) => {
                mainQueue.splice(position + added, 0, item);
                added++;
              },
            })
          );
        }
        return result;
      };
    },
    getNext: () => {
      const next = mainQueue[position];
      if (next === undefined) {
        endSubscribers.forEach(e => e());
      } else {
        position++;
      }
      return next;
    },
    getQueue: () => mainQueue,
    onItemAdded: (sub: AddSubscriber) => {
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
