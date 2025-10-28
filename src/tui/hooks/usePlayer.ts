import { useEffect, useState, useRef } from "react";
import { AudioPlayer } from "../../audio_player.js";
import { PlaylistManager } from "../../playlist_manager.js";
import { Track } from "../../types.js";

export function usePlayer(playlist: PlaylistManager) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(
    playlist.getCurrentTrack()
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const playerRef = useRef<AudioPlayer>(new AudioPlayer());
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear any pending play operations
  function clearPendingPlay() {
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
  }

  function play() {
    if (!currentTrack) return;

    clearPendingPlay();

    try {
      playerRef.current.play(currentTrack.path);
      setIsPlaying(true);
    } catch (error) {
      console.error("Playback error:", error);
      setIsPlaying(false);
    }
  }

  function stop() {
    clearPendingPlay();
    playerRef.current.stop();
    setIsPlaying(false);
  }

  function togglePlayPause() {
    clearPendingPlay();

    if (isPlaying) {
      stop();
    } else {
      play();
    }
  }

  function next() {
    const wasPlaying = isPlaying;
    clearPendingPlay();
    stop();

    const track = playlist.nextTrack();
    setCurrentTrack(track);
    updateIndex();

    if (track && wasPlaying) {
      playTimeoutRef.current = setTimeout(() => {
        if (track === playlist.getCurrentTrack()) {
          playerRef.current.play(track.path);
          setIsPlaying(true);
        }
        playTimeoutRef.current = null;
      }, 100);
    }
  }

  function previous() {
    const wasPlaying = isPlaying;
    clearPendingPlay();
    stop();

    const track = playlist.previousTrack();
    setCurrentTrack(track);
    updateIndex();

    if (track && wasPlaying) {
      playTimeoutRef.current = setTimeout(() => {
        if (track === playlist.getCurrentTrack()) {
          playerRef.current.play(track.path);
          setIsPlaying(true);
        }
        playTimeoutRef.current = null;
      }, 100);
    }
  }

  function restart() {
    if (!currentTrack) return;

    clearPendingPlay();
    playerRef.current.stop();

    playTimeoutRef.current = setTimeout(() => {
      if (currentTrack) {
        playerRef.current.play(currentTrack.path);
        setIsPlaying(true);
      }
      playTimeoutRef.current = null;
    }, 50);
  }

  function increaseVolume() {
    const currentVolume = playerRef.current.getVolume();
    playerRef.current.setVolume(currentVolume + 5);
    setVolume(playerRef.current.getVolume());
  }

  function decreaseVolume() {
    const currentVolume = playerRef.current.getVolume();
    playerRef.current.setVolume(currentVolume - 5);
    setVolume(playerRef.current.getVolume());
  }

  function updateIndex() {
    const idx = (playlist as any).currentTrackIndex || 0;
    setCurrentIndex(idx);
  }

  useEffect(() => {
    updateIndex();
  }, [currentTrack]);

  useEffect(() => {
    return () => {
      clearPendingPlay();
      playerRef.current.stop();
    };
  }, []);

  return {
    currentTrack,
    isPlaying,
    volume,
    currentIndex,
    play,
    stop,
    togglePlayPause,
    next,
    previous,
    restart,
    increaseVolume,
    decreaseVolume,
    totalTracks: playlist.getTrackCount(),
  };
}
