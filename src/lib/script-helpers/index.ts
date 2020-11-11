import { Queue } from "../events/types";
import audioHelpers from "./audio";
import flowHelpers from "./flow";
import gameHelpers from "./game";
import sceneHelpers from "./scene";
import screenHelpers from "./screen";

type Helper<T> = (q: Queue) => T;

const combine = <A, B>(a: Helper<A>, b: Helper<B>): Helper<A & B> => (
  queue: Queue
) => ({
  ...a(queue),
  ...b(queue),
});

export default combine(
  gameHelpers,
  combine(
    audioHelpers,
    combine(flowHelpers, combine(sceneHelpers, screenHelpers))
  )
);
