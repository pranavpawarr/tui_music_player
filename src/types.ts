export interface Track {
  id: string;
  path: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  year?: string;
}

export type RepeatMode = "off" | "on" | "all";

export interface PlaybackSafe {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  queue: Track[];
  currentindex: number;
  repeatMode: RepeatMode;
  shuffle: boolean;
}
