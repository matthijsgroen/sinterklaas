export type AudioType = "music" | "sfx";

type Sample = {
  name: string;
  type: AudioType;
  loop: boolean;
  duration?: number;
  loopStart?: number;
  loopEnd?: number;
  volume?: number;
};

export type AudioMap = {
  name: string;
  file: string;
  map: Sample[];
};

type SampleData = {
  type: AudioType;
  start: number;
  end: number;
  duration: number;
  loopStart?: number;
  loopEnd?: number;
  volume?: number;
  loop: boolean;
};

type AudioFileData = {
  audioData: AudioBuffer;
  map: Record<string, SampleData>;
};

type PlayingMusic = {
  source: AudioBufferSourceNode;
  sampleName: string;
  setVolume(volume: number, duration?: number): void;
};

type AudioPlayer = {
  stop(): void;
  setVolume(volume: number, duration?: number): void;
  process: Promise<void>;
};

type AudioManager = {
  pauseAudio(): void;
  resumeAudio(): void;
  setEffectVolume(volume: number): void;
  setMusicVolume(volume: number): void;
  getEffectVolume(): number;
  getMusicVolume(): number;
  loadAudio(audioMap: AudioMap): Promise<AudioFileData>;
  stopMusic(): void;
  fadeMusicVolume(volume?: number, duration?: number): void;
  playAudio(
    sampleName: string,
    { volume }: { volume?: number }
  ): AudioPlayer | undefined;
};

const oldBrowser = !window.AudioContext && !window.webkitAudioContext;

export const createAudioManager = (): AudioManager => {
  const audioData: Record<string, AudioFileData> = {};

  const context = new (window.AudioContext || window.webkitAudioContext)();

  const playingPool: {
    music: null | PlayingMusic;
    effectsGain: GainNode;
    musicGain: GainNode;
  } = {
    music: null,
    effectsGain: context.createGain(),
    musicGain: context.createGain(),
  };

  playingPool.effectsGain.connect(context.destination);
  playingPool.musicGain.connect(context.destination);

  const convertAudioMap = (samples: Sample[], fileDuration: number) =>
    samples.reduce<Record<string, SampleData>>((acc, entry, i, l) => {
      const previous = i > 0 && acc[l[i - 1].name];
      const start = previous ? previous.end : 0;
      const dur = entry.duration || fileDuration * 1000;
      return {
        ...acc,
        [entry.name]: {
          type: entry.type,
          start,
          end: start + dur,
          duration: dur,
          loopStart: entry.loopStart,
          loopEnd: entry.loopEnd,
          volume: entry.volume,
          loop: entry.loop,
        },
      };
    }, {});

  const assignAudioBuffer = (audioMap: AudioMap, decodedData: AudioBuffer) => {
    audioData[audioMap.name] = {
      audioData: decodedData,
      map: convertAudioMap(audioMap.map, decodedData.duration),
    };
  };

  const currentMusic = () => {
    if (playingPool.music !== null) {
      return playingPool.music.sampleName;
    }
  };

  let audioPaused = false;

  const stopMusic = () => {
    if (playingPool.music !== null) {
      playingPool.music.source.stop();
      playingPool.music.source.disconnect();
      playingPool.music = null;
    }
  };

  let effectsVolume = 1.0;
  let musicVolume = 1.0;

  if (oldBrowser) {
    return {
      pauseAudio() {
        return void 0;
      },
      resumeAudio() {
        return void 0;
      },
      setEffectVolume(_vol: number) {
        return void 0;
      },
      setMusicVolume(_vol: number) {
        return void 0;
      },
      getEffectVolume() {
        return 0;
      },
      getMusicVolume() {
        return 0;
      },
      loadAudio: async (audioMap: AudioMap) => {
        return {
          audioData: context.createBuffer(
            2,
            context.sampleRate * 3,
            context.sampleRate
          ),
          map: convertAudioMap(audioMap.map, 0),
        };
      },
      stopMusic() {
        return void 0;
      },
      fadeMusicVolume() {
        return void 0;
      },
      playAudio() {
        return undefined;
      },
    };
  }
  if (oldBrowser) {
    return {
      pauseAudio() {
        return void 0;
      },
      resumeAudio() {
        return void 0;
      },
      setEffectVolume(_vol: number) {
        return void 0;
      },
      setMusicVolume(_vol: number) {
        return void 0;
      },
      getEffectVolume() {
        return 0;
      },
      getMusicVolume() {
        return 0;
      },
      loadAudio: async (audioMap: AudioMap) => {
        return {
          audioData: context.createBuffer(
            2,
            context.sampleRate * 3,
            context.sampleRate
          ),
          map: convertAudioMap(audioMap.map, 0),
        };
      },
      stopMusic() {
        return void 0;
      },
      fadeMusicVolume() {
        return void 0;
      },
      playAudio() {
        return undefined;
      },
    };
  }

  const api = {
    pauseAudio: () => {
      audioPaused = true;
      context.suspend();
    },

    resumeAudio: () => {
      audioPaused = false;
      context.resume();
    },

    setEffectVolume: (volume: number) => {
      playingPool.effectsGain.gain.setValueAtTime(volume, context.currentTime);
      effectsVolume = volume;
    },

    setMusicVolume: (volume: number) => {
      playingPool.musicGain.gain.setValueAtTime(volume, context.currentTime);
      musicVolume = volume;
    },

    getEffectVolume: () => effectsVolume,
    getMusicVolume: () => musicVolume,

    loadAudio: async (audioMap: AudioMap) => {
      const name = audioMap.name;
      if (audioData[name]) {
        return audioData[name];
      }

      const file = await window.fetch(audioMap.file);
      const buffer = await file.arrayBuffer();
      try {
        const decodedData = await new Promise<AudioBuffer>(
          (resolve, reject) => {
            context.decodeAudioData(buffer, resolve, reject);
          }
        );

        assignAudioBuffer(audioMap, decodedData);
      } catch (e) {
        // Some fileformats are not compatible with the browser,
        // silently fail for now
      }

      return audioData[name];
    },

    stopMusic,

    fadeMusicVolume: (volume = 0, duration = 1000) => {
      if (playingPool.music !== null) {
        return playingPool.music.setVolume(volume, duration);
      }
    },

    playAudio: (
      sampleName: string,
      { volume = 1.0 } = {}
    ): AudioPlayer | undefined => {
      const map = Object.values(audioData).find((e) => e.map[sampleName]);
      if (!map) {
        return;
      }
      const sampleData = map.map[sampleName];
      if (sampleData.type === "music") {
        if (currentMusic() === sampleName && playingPool.music !== null) {
          const music = playingPool.music;
          return {
            stop: () => music.source.stop(),
            setVolume: (...args: Parameters<typeof setVolume>) =>
              music.setVolume(...args),
            process: new Promise(
              (resolve) => (music.source.onended = () => resolve())
            ),
          };
        }
        // Cross fade if track is already playing??
        stopMusic();

        const baseVolume =
          sampleData.volume === undefined ? 1.0 : sampleData.volume;

        const sampleVolume = volume * baseVolume;
        const source = context.createBufferSource();
        source.buffer = map.audioData;

        const trackGain = context.createGain();
        trackGain.connect(playingPool.musicGain);
        trackGain.gain.setValueAtTime(
          sampleVolume === 0 ? 0.01 : sampleVolume,
          context.currentTime
        );

        source.connect(trackGain);
        if (sampleData.loop) {
          source.loop = true;
          if (sampleData.loopStart) {
            source.loopStart = sampleData.loopStart;
          }
          if (sampleData.loopEnd) {
            source.loopEnd = sampleData.loopEnd;
          }
        }

        source.start();

        const process = new Promise<void>(
          (resolve) => (source.onended = () => resolve())
        );

        const setVolume = async (value: number, duration = 0) => {
          const newVolume = value * baseVolume;
          trackGain.gain.exponentialRampToValueAtTime(
            newVolume === 0 ? 0.01 : newVolume,
            context.currentTime + duration / 1000.0
          );
        };
        playingPool.music = { source, sampleName, setVolume };

        return {
          stop: () => source.stop(),
          setVolume,
          process,
        };
      } else {
        const source = context.createBufferSource();
        source.buffer = map.audioData;

        const baseVolume =
          sampleData.volume === undefined ? 1.0 : sampleData.volume;
        const sampleVolume = volume * baseVolume;
        if (sampleData.loop) {
          source.loop = true;
          source.loopStart = sampleData.start / 1000.0;
          source.loopEnd = sampleData.end / 1000.0;
        }

        const sampleGain = context.createGain();
        sampleGain.connect(playingPool.effectsGain);
        sampleGain.gain.setValueAtTime(
          sampleVolume === 0 ? 0.01 : sampleVolume,
          context.currentTime
        );

        source.connect(sampleGain);
        source.start(
          context.currentTime,
          sampleData.start / 1000.0,
          source.loop ? undefined : sampleData.duration / 1000.0
        );
        const process = new Promise<void>(
          (resolve) => (source.onended = () => resolve())
        );

        return {
          stop: () => source.stop(),
          setVolume: async (value, duration = 0) => {
            const newVolume = value * baseVolume;
            sampleGain.gain.exponentialRampToValueAtTime(
              newVolume === 0 ? 0.01 : newVolume,
              context.currentTime + duration / 1000.0
            );
          },
          process,
        };
      }
    },
  };

  document.addEventListener(
    "visibilitychange",
    () => {
      if (audioPaused) return;
      if (document["hidden"]) {
        context.suspend();
      } else {
        context.resume();
      }
    },
    false
  );

  return api;
};

const defaultAudio = createAudioManager();

export default defaultAudio;
