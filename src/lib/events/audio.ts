import audio, { AudioType } from "../audio";
import { AudioItem, Queue } from "./types";

export const audioQ = (queue: Queue) => ({
  file,
  action,
  channel,
  options,
}: {
  file: string;
  action: "play" | "stop";
  channel: AudioType;
  options: AudioItem["options"];
}): void =>
  queue.addItem({ type: "AUDIO", file, action, channel, options } as AudioItem);

export const preloadAudio = async ({
  file,
  channel,
}: AudioItem): Promise<void> => {
  file &&
    (await audio.loadAudio({
      name: file,
      file,
      map: [{ name: file, type: channel, loop: channel === "music" }],
    }));
};

export const handleAudio = async (queueItem: AudioItem): Promise<void> => {
  const { file, action, channel, options = {} } = queueItem;

  if (action === "play") {
    const { fadeIn = false, volume = 0.8 } = options;

    const startVolume = fadeIn === false ? volume : 0.001;
    const playingTrack = audio.playAudio(file, { volume: startVolume });
    if (fadeIn !== false) {
      const duration = fadeIn === true ? 1000 : fadeIn * 1000;
      playingTrack?.setVolume(volume, duration);
    }
    if (options.wait) {
      await playingTrack?.process;
    }
  }
  if (action === "stop" && channel === "music") {
    const { fadeOut = false } = options;
    if (fadeOut !== false) {
      audio.fadeMusicVolume(0, 3000);
      setTimeout(() => audio.stopMusic(), 1000);
    } else {
      audio.stopMusic();
    }
  }
};
