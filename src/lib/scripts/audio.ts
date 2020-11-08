import { audioQ } from "../events";
import { Queue } from "../types";

const audioHelpers = (queue: Queue) => {
  const audio = audioQ(queue);

  return {
    playMusic: (
      file: string,
      options: { fadeIn?: boolean; volume?: number } = {}
    ) => {
      audio({ file, action: "play", channel: "music", options });
    },
    playSound: (
      file: string,
      options: { volume?: number; wait?: boolean } = {}
    ) => {
      audio({ file, action: "play", channel: "sfx", options });
    },
    stopMusic: (options: { fadeOut?: boolean } = {}) => {
      audio({ file: "", action: "stop", channel: "music", options });
    },
  };
};

export default audioHelpers;
