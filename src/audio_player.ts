import player from "play-sound";

export class AudioPlayer {
  private currentTrack?: string;
  private isPlaying: boolean = false;
  private volume: number = 1.0;

  private player: ReturnType<typeof player>;
  private currentAudio: ReturnType<ReturnType<typeof player>["play"]> | null =
    null;

  constructor() {
    this.player = player({});
  }

  play(trackPath: string): void {
    // IMPORTANT: Stop completely before playing new track
    this.stop();

    this.currentTrack = trackPath;
    this.isPlaying = true;

    this.currentAudio = this.player.play(trackPath, (err) => {
      if (err && !err.killed) {
        console.error("Playback error:", err);
      }
      this.isPlaying = false;
      this.currentAudio = null;
    });
  }

  public stop(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.kill();
      } catch (err) {
        // Ignore errors if already killed
      }
      this.currentAudio = null;
    }
    this.isPlaying = false;
    this.currentTrack = undefined;
  }

  public restart(): void {
    if (this.currentTrack) {
      this.play(this.currentTrack);
    }
  }

  public setVolume(level: number): void {
    if (level > 50) {
      console.log(`too loud`);
      this.volume = 50;
    } else if (level < 0) {
      console.log(`cant go lower than 0`);
      this.volume = 0;
    } else {
      this.volume = level;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentTrack(): string | undefined {
    return this.currentTrack;
  }

  public isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}
