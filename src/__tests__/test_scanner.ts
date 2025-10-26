import { promises as fsPromises } from "fs";
import { FileScanner } from "../file_scanner";
import * as path from "path";

// Mock the fs/promises module
jest.mock("fs", () => ({
  promises: {
    readdir: jest.fn(),
  },
}));

describe("FileScanner", () => {
  let fileScanner: FileScanner;
  let mockReaddir: jest.MockedFunction<typeof fsPromises.readdir>;

  beforeEach(() => {
    fileScanner = new FileScanner();
    mockReaddir = fsPromises.readdir as jest.MockedFunction<
      typeof fsPromises.readdir
    >;
    jest.clearAllMocks();
    // Suppress console.error for cleaner test output
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("scanDirectory", () => {
    it("should return empty array when directory is empty", async () => {
      mockReaddir.mockResolvedValue([]);

      const result = await fileScanner.scanDirectory("/test/empty");

      expect(result).toEqual([]);
      expect(mockReaddir).toHaveBeenCalledWith("/test/empty", {
        withFileTypes: true,
      });
    });

    it("should return only audio files with supported extensions", async () => {
      const mockEntries = [
        {
          name: "song1.mp3",
          isDirectory: () => false,
          isFile: () => true,
        },
        {
          name: "song2.wav",
          isDirectory: () => false,
          isFile: () => true,
        },
        {
          name: "document.pdf",
          isDirectory: () => false,
          isFile: () => true,
        },
        {
          name: "image.jpg",
          isDirectory: () => false,
          isFile: () => true,
        },
      ];

      mockReaddir.mockResolvedValue(mockEntries as any);

      const result = await fileScanner.scanDirectory("/test/music");

      expect(result).toHaveLength(2);
      expect(result).toContain(path.join("/test/music", "song1.mp3"));
      expect(result).toContain(path.join("/test/music", "song2.wav"));
      expect(result).not.toContain(path.join("/test/music", "document.pdf"));
    });

    it("should detect all supported audio formats", async () => {
      const mockEntries = [
        { name: "track.mp3", isDirectory: () => false, isFile: () => true },
        { name: "track.wav", isDirectory: () => false, isFile: () => true },
        { name: "track.flac", isDirectory: () => false, isFile: () => true },
        { name: "track.m4a", isDirectory: () => false, isFile: () => true },
        { name: "track.ogg", isDirectory: () => false, isFile: () => true },
      ];

      mockReaddir.mockResolvedValue(mockEntries as any);

      const result = await fileScanner.scanDirectory("/test/formats");

      expect(result).toHaveLength(5);
      expect(result).toContain(path.join("/test/formats", "track.mp3"));
      expect(result).toContain(path.join("/test/formats", "track.wav"));
      expect(result).toContain(path.join("/test/formats", "track.flac"));
      expect(result).toContain(path.join("/test/formats", "track.m4a"));
      expect(result).toContain(path.join("/test/formats", "track.ogg"));
    });

    it("should handle case-insensitive file extensions", async () => {
      const mockEntries = [
        { name: "song.MP3", isDirectory: () => false, isFile: () => true },
        { name: "track.WaV", isDirectory: () => false, isFile: () => true },
        { name: "audio.FLAC", isDirectory: () => false, isFile: () => true },
      ];

      mockReaddir.mockResolvedValue(mockEntries as any);

      const result = await fileScanner.scanDirectory("/test/mixed");

      expect(result).toHaveLength(3);
      expect(result).toContain(path.join("/test/mixed", "song.MP3"));
      expect(result).toContain(path.join("/test/mixed", "track.WaV"));
      expect(result).toContain(path.join("/test/mixed", "audio.FLAC"));
    });

    it("should recursively scan subdirectories", async () => {
      // First call - root directory
      const rootEntries = [
        { name: "root.mp3", isDirectory: () => false, isFile: () => true },
        { name: "subfolder", isDirectory: () => true, isFile: () => false },
      ];

      // Second call - subdirectory
      const subEntries = [
        { name: "sub.wav", isDirectory: () => false, isFile: () => true },
      ];

      mockReaddir
        .mockResolvedValueOnce(rootEntries as any)
        .mockResolvedValueOnce(subEntries as any);

      const result = await fileScanner.scanDirectory("/test/nested");

      expect(result).toHaveLength(2);
      expect(result).toContain(path.join("/test/nested", "root.mp3"));
      expect(result).toContain(
        path.join("/test/nested", "subfolder", "sub.wav")
      );
      expect(mockReaddir).toHaveBeenCalledTimes(2);
    });

    it("should handle deeply nested directory structures", async () => {
      // Root
      const level1 = [
        { name: "level1.mp3", isDirectory: () => false, isFile: () => true },
        { name: "dir1", isDirectory: () => true, isFile: () => false },
      ];

      // Level 2
      const level2 = [
        { name: "level2.wav", isDirectory: () => false, isFile: () => true },
        { name: "dir2", isDirectory: () => true, isFile: () => false },
      ];

      // Level 3
      const level3 = [
        { name: "level3.flac", isDirectory: () => false, isFile: () => true },
      ];

      mockReaddir
        .mockResolvedValueOnce(level1 as any)
        .mockResolvedValueOnce(level2 as any)
        .mockResolvedValueOnce(level3 as any);

      const result = await fileScanner.scanDirectory("/test/deep");

      expect(result).toHaveLength(3);
      expect(result).toContain(path.join("/test/deep", "level1.mp3"));
      expect(result).toContain(path.join("/test/deep", "dir1", "level2.wav"));
      expect(result).toContain(
        path.join("/test/deep", "dir1", "dir2", "level3.flac")
      );
    });

    it("should handle multiple subdirectories at same level", async () => {
      const rootEntries = [
        { name: "folder1", isDirectory: () => true, isFile: () => false },
        { name: "folder2", isDirectory: () => true, isFile: () => false },
      ];

      const folder1Entries = [
        { name: "song1.mp3", isDirectory: () => false, isFile: () => true },
      ];

      const folder2Entries = [
        { name: "song2.wav", isDirectory: () => false, isFile: () => true },
      ];

      mockReaddir
        .mockResolvedValueOnce(rootEntries as any)
        .mockResolvedValueOnce(folder1Entries as any)
        .mockResolvedValueOnce(folder2Entries as any);

      const result = await fileScanner.scanDirectory("/test/parallel");

      expect(result).toHaveLength(2);
      expect(result).toContain(
        path.join("/test/parallel", "folder1", "song1.mp3")
      );
      expect(result).toContain(
        path.join("/test/parallel", "folder2", "song2.wav")
      );
    });

    it("should continue scanning other directories when one fails", async () => {
      const rootEntries = [
        { name: "good.mp3", isDirectory: () => false, isFile: () => true },
        { name: "badDir", isDirectory: () => true, isFile: () => false },
        { name: "goodDir", isDirectory: () => true, isFile: () => false },
      ];

      const goodDirEntries = [
        { name: "valid.wav", isDirectory: () => false, isFile: () => true },
      ];

      mockReaddir
        .mockResolvedValueOnce(rootEntries as any)
        .mockRejectedValueOnce(new Error("Permission denied"))
        .mockResolvedValueOnce(goodDirEntries as any);

      const result = await fileScanner.scanDirectory("/test/error");

      expect(result).toHaveLength(2);
      expect(result).toContain(path.join("/test/error", "good.mp3"));
      expect(result).toContain(
        path.join("/test/error", "goodDir", "valid.wav")
      );
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error scanning directory"),
        expect.any(Error)
      );
    });

    it("should handle directory with no audio files", async () => {
      const mockEntries = [
        { name: "readme.txt", isDirectory: () => false, isFile: () => true },
        { name: "config.json", isDirectory: () => false, isFile: () => true },
        { name: "image.png", isDirectory: () => false, isFile: () => true },
      ];

      mockReaddir.mockResolvedValue(mockEntries as any);

      const result = await fileScanner.scanDirectory("/test/noaudio");

      expect(result).toEqual([]);
    });

    it("should handle mixed files and directories", async () => {
      const mockEntries = [
        { name: "song1.mp3", isDirectory: () => false, isFile: () => true },
        { name: "Albums", isDirectory: () => true, isFile: () => false },
        { name: "cover.jpg", isDirectory: () => false, isFile: () => true },
        { name: "song2.flac", isDirectory: () => false, isFile: () => true },
      ];

      const albumsEntries = [
        { name: "album1.wav", isDirectory: () => false, isFile: () => true },
      ];

      mockReaddir
        .mockResolvedValueOnce(mockEntries as any)
        .mockResolvedValueOnce(albumsEntries as any);

      const result = await fileScanner.scanDirectory("/test/mixed");

      expect(result).toHaveLength(3);
      expect(result).toContain(path.join("/test/mixed", "song1.mp3"));
      expect(result).toContain(path.join("/test/mixed", "song2.flac"));
      expect(result).toContain(
        path.join("/test/mixed", "Albums", "album1.wav")
      );
    });

    it("should log error and return empty array when root directory fails", async () => {
      mockReaddir.mockRejectedValue(new Error("Directory not found"));

      const result = await fileScanner.scanDirectory("/test/notfound");

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        "Error scanning directory /test/notfound:",
        expect.any(Error)
      );
    });

    it("should handle files without extensions", async () => {
      const mockEntries = [
        { name: "README", isDirectory: () => false, isFile: () => true },
        { name: "song.mp3", isDirectory: () => false, isFile: () => true },
        { name: "Makefile", isDirectory: () => false, isFile: () => true },
      ];

      mockReaddir.mockResolvedValue(mockEntries as any);

      const result = await fileScanner.scanDirectory("/test/noext");

      expect(result).toHaveLength(1);
      expect(result).toContain(path.join("/test/noext", "song.mp3"));
    });
  });
});
