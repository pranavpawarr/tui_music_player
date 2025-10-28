import { Track } from "./types";

export class PlaylistManager {
  private listOfTracks: Track[];
  private currentTrackIndex: number;
  private isShuffle: boolean;
  private isRepeat: boolean;

  constructor(tracks: Track[]) {
    this.listOfTracks = tracks;
    this.currentTrackIndex = 0;
    this.isShuffle = false;
    this.isRepeat = false;
  }

  public addTrack(track: Track): void {
    this.listOfTracks.push(track);
  }

  public removeTrack(trackId: string): void {
    const index = this.listOfTracks.findIndex((track) => track.id === trackId);

    if (index !== -1) {
      this.listOfTracks.splice(index, 1);

      if (index < this.currentTrackIndex) {
        this.currentTrackIndex--;
      } else if (index === this.currentTrackIndex) {
        if (this.currentTrackIndex >= this.listOfTracks.length) {
          this.currentTrackIndex = Math.max(0, this.listOfTracks.length - 1);
        }
      }
    }
  }

  public nextTrack(): Track | null {
    if (this.listOfTracks.length === 0) {
      return null;
    }
    this.currentTrackIndex++;
    if (this.currentTrackIndex >= this.listOfTracks.length) {
      if (this.isRepeat) {
        this.currentTrackIndex = 0;
        return this.listOfTracks[this.currentTrackIndex];
      } else {
        this.currentTrackIndex = this.listOfTracks.length - 1;
        return null;
      }
    }
    return this.listOfTracks[this.currentTrackIndex];
  }

  public previousTrack(): Track | null {
    if (this.listOfTracks.length === 0) {
      return null; // Can't go to previous if playlist is empty
    }

    this.currentTrackIndex--;
    if (this.currentTrackIndex < 0) {
      if (this.isRepeat) {
        this.currentTrackIndex = this.listOfTracks.length - 1;
        return this.listOfTracks[this.currentTrackIndex];
      } else {
        this.currentTrackIndex = 0;
        return null;
      }
    }
    return this.listOfTracks[this.currentTrackIndex];
  }

  public toggleShuffle(): void {
    this.isShuffle = !this.isShuffle;
  }

  public toggleRepeat(): void {
    this.isRepeat = !this.isRepeat;
  }

  public getCurrentTrack(): Track | null {
    return this.listOfTracks[this.currentTrackIndex] || null;
  }

  public getTrackCount(): number {
    return this.listOfTracks.length;
  }
}
