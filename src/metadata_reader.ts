import { parseFile } from "music-metadata";
import * as path from "path";
import { randomUUID } from "crypto";
import { Track } from "./types";

export interface MetadataOptions {
  skipCovers?: boolean;
  duration?: boolean;
}

export class MetadataReader {
  private readonly defaultOptions: MetadataOptions = {
    skipCovers: true,
    duration: true,
  };

  public async readMetadata(
    filePath: string,
    options?: MetadataOptions
  ): Promise<Track> {
    try {
      const parseOptions = { ...this.defaultOptions, ...options };
      const metadata = await parseFile(filePath, parseOptions);

      return {
        id: randomUUID(),
        path: filePath,
        title: metadata.common.title || this.getTitleFromFilename(filePath),
        artist: metadata.common.artist || "Unknown Artist",
        album: metadata.common.album || "Unknown Album",
        duration: metadata.format.duration || 0,
        year: metadata.common.year?.toString(),
      };
    } catch (error) {
      console.error(`Failed to read metadata from ${filePath}:`, error);
      return this.createFallbackTrack(filePath);
    }
  }

  public async readMultipleMetadata(
    filePaths: string[],
    options?: MetadataOptions,
    batchSize: number = 10
  ): Promise<Track[]> {
    const tracks: Track[] = [];

    for (let i = 0; i < filePaths.length; i += batchSize) {
      const batch = filePaths.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map((filePath) => this.readMetadata(filePath, options))
      );

      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          tracks.push(result.value);
        }
      }
    }

    return tracks;
  }

  private createFallbackTrack(filePath: string): Track {
    return {
      id: randomUUID(),
      path: filePath,
      title: this.getTitleFromFilename(filePath),
      artist: "Unknown Artist",
      album: "Unknown Album",
      duration: 0,
    };
  }

  private getTitleFromFilename(filePath: string): string {
    const filename = path.basename(filePath);
    return path.basename(filename, path.extname(filename));
  }

  public formatDuration(durationInSeconds: number): string {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}
