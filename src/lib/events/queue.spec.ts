import eventQueue from "./queue";

describe("Queue", () => {
  describe("length", () => {
    it("starts with zero", () => {
      const queue = eventQueue();
      expect(queue.length).toEqual(0);
    });

    it("represents the amount of items in the queue when added", () => {
      const queue = eventQueue();
      queue.addItem({ type: "item1" });
      queue.addItem({ type: "item2" });

      expect(queue.length).toEqual(2);
    });
  });

  describe("getNext", () => {
    it("returns the next item", () => {
      const queue = eventQueue();
      queue.addItem({ type: "item1" });
      queue.addItem({ type: "item2" });

      const item = queue.getNext();
      expect(item?.type).toEqual("item1");

      const item2 = queue.getNext();
      expect(item2?.type).toEqual("item2");
    });

    it("returns undefined when queue has no new items", () => {
      const queue = eventQueue();
      queue.addItem({ type: "item1" });

      const item = queue.getNext();
      expect(item?.type).toEqual("item1");

      const item2 = queue.getNext();
      expect(item2).toBeUndefined();
    });
  });

  describe("Inserting queue", () => {
    it("shifts items in front", () => {
      const queue = eventQueue();
      queue.addItem({ type: "item1" });
      queue.addItem({ type: "item2" });

      const item = queue.getNext();
      expect(item?.type).toEqual("item1");

      queue.undoItem();

      const commit = queue.collectToNewQueue();
      queue.addItem({ type: "inserted1" });
      queue.addItem({ type: "inserted2" });
      commit();

      const insertedItem = queue.getNext();
      expect(insertedItem?.type).toEqual("inserted1");
    });
  });
});
